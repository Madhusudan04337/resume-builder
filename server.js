const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Robust wrapper with automatic model fallback and transient retries to bypass rate limits (429) & server demand spikes (503)
async function generateContentWithFallback(options) {
    const primaryModel = "gemini-2.5-flash";
    const fallbackModel = "gemini-2.5-flash-lite";

    // Step 1: Attempt the primary model
    try {
        return await ai.models.generateContent({
            model: primaryModel,
            ...options
        });
    } catch (error) {
        const isQuotaExceeded = error.status === 429 || error.message?.includes("quota") || error.message?.includes("Quota") || error.message?.includes("RESOURCE_EXHAUSTED");
        const isTransient503 = error.status === 503 || error.message?.includes("demand") || error.message?.includes("temporary");

        if (isQuotaExceeded) {
            console.warn(`Primary model (${primaryModel}) quota exceeded. Switching to fallback model (${fallbackModel})...`);
        } else if (isTransient503) {
            console.warn(`Primary model (${primaryModel}) temporarily unavailable (503). Attempting fallback model (${fallbackModel})...`);
        } else {
            throw error;
        }
    }

    // Step 2: Attempt fallback model with robust retries and exponential backoff for high-demand spikes
    const maxRetries = 2;
    let currentDelay = 1500;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await ai.models.generateContent({
                model: fallbackModel,
                ...options
            });
        } catch (error) {
            const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes("demand") || error.message?.includes("temporary");
            if (isRetryable && attempt < maxRetries) {
                console.warn(`Fallback model (${fallbackModel}) transient error: ${error.message}. Retrying (${attempt + 1}/${maxRetries}) in ${currentDelay}ms...`);
                await delay(currentDelay);
                currentDelay *= 2; // Exponential backoff
                continue;
            }
            throw error;
        }
    }
}

// Endpoint to generate resume content via AI
app.post('/api/generate-summary', async (req, res) => {
    const { skills, experience } = req.body;

    try {
        const response = await generateContentWithFallback({
            contents: `Create a professional 3-line resume summary for a candidate with these skills: ${skills} and experience: ${experience}.`,
            config: {
                systemInstruction: "You are an expert resume writer.",
                maxOutputTokens: 200
            }
        });

        res.json({ summary: response.text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to generate summary", message: error.message, stack: error.stack });
    }
});

// Endpoint to parse full resume text into JSON
app.post('/api/parse-resume', async (req, res) => {
    const { text } = req.body;

    try {
        const response = await generateContentWithFallback({
            contents: `Extract information from this resume and return ONLY raw JSON with this structure:
{
  "personal": {
    "firstName": "", "lastName": "", "address": "", "phone": "", "email": "", 
    "linkedin": "", "github": "", "portfolio": "", "leetcode": "", "gfg": "", 
    "twitter": "", "hackerrank": "", "codechef": "", "summary": ""
  },
  "headline": "",
  "education": [{"university": "", "degree": "", "start": "", "end": "", "loc": ""}],
  "coursework": [],
  "experience": [{"company": "", "role": "", "start": "", "end": "", "loc": "", "bullets": []}],
  "projects": [{"name": "", "tech": "", "date": "", "bullets": []}],
  "skills": {"languages": "", "tools": "", "tech": ""},
  "spokenLanguages": "",
  "leadership": [{"org": "", "role": "", "start": "", "end": "", "loc": "", "bullets": []}],
  "certifications": [{"name": "", "url": "", "provider": "", "start": "", "end": "", "skills": ""}]
}

Resume:
"""
${text}
"""`,
            config: {
                systemInstruction: "You are a resume parser. Extract all information and return ONLY raw JSON.",
                responseMimeType: "application/json",
                maxOutputTokens: 2000
            }
        });

        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to parse resume", message: error.message, stack: error.stack });
    }
});

// Endpoint to score resume for ATS optimization
app.post('/api/score-resume', async (req, res) => {
    const { resume } = req.body;

    try {
        const response = await generateContentWithFallback({
            contents: `Analyze this resume data and return ONLY raw JSON in this format: {"score": 85, "feedback": "Detailed 2-line advice..."}

Data:
${resume}`,
            config: {
                systemInstruction: "You are an ATS (Applicant Tracking System) expert. Analyze the resume and provide a score (0-100) and brief feedback.",
                responseMimeType: "application/json",
                maxOutputTokens: 500
            }
        });

        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to score resume", message: error.message, stack: error.stack });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


