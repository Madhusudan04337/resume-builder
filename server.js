const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter rankings
        "X-Title": "Resume Builder", // Optional, for OpenRouter rankings
    }
});

// Endpoint to generate resume content via AI
app.post('/api/generate-summary', async (req, res) => {
    const { skills, experience } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: "You are an expert resume writer." 
                },
                { 
                    role: "user", 
                    content: `Create a professional 3-line resume summary for a candidate with these skills: ${skills} and experience: ${experience}.` 
                }
            ],
            max_tokens: 200
        });

        res.json({ summary: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

// Endpoint to parse full resume text into JSON
app.post('/api/parse-resume', async (req, res) => {
    const { text } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: "You are a resume parser. Extract all information and return ONLY raw JSON." 
                },
                { 
                    role: "user", 
                    content: `Extract information from this resume and return ONLY raw JSON with this structure:
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
"""` 
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 2000
        });

        res.json(JSON.parse(response.choices[0].message.content));
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "Failed to parse resume" });
    }
});

// Endpoint to score resume for ATS optimization
app.post('/api/score-resume', async (req, res) => {
    const { resume } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: "You are an ATS (Applicant Tracking System) expert. Analyze the resume and provide a score (0-100) and brief feedback." 
                },
                { 
                    role: "user", 
                    content: `Analyze this resume data and return ONLY raw JSON in this format: {"score": 85, "feedback": "Detailed 2-line advice..."}

Data:
${resume}` 
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500
        });

        res.json(JSON.parse(response.choices[0].message.content));
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "Failed to score resume" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
