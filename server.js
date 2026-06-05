const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ override: true });

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

// Middleware to ensure API key is configured and not using placeholder values
const checkApiKey = (req, res, next) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === '' || key === 'your_gemini_api_key_here') {
        return res.status(400).json({
            error: "Configuration Error",
            message: "Gemini API Key is missing or not configured. Please add a valid GEMINI_API_KEY inside your .env file."
        });
    }
    next();
};

// Robust helper to extract and clean error messages returned by @google/genai SDK
function formatGeminiError(error) {
    let message = error.message || "An unknown error occurred inside Gemini AI";
    
    // Often @google/genai SDK wraps API errors as a serialized JSON string in error.message
    if (typeof message === 'string' && message.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(message);
            if (parsed.error && parsed.error.message) {
                message = parsed.error.message;
            }
        } catch (e) {
            // Keep original message if parsing fails
        }
    }
    
    // Check for common error contexts
    if (message.includes("API key was reported as leaked") || message.includes("API key") || error.status === 403) {
        return "Your Gemini API Key is invalid or has been reported as leaked. Please update the GEMINI_API_KEY inside your .env file with a new, valid key from Google AI Studio (https://aistudio.google.com/).";
    }
    
    return message;
}

// Endpoint to generate resume content via AI
app.post('/api/generate-summary', checkApiKey, async (req, res) => {
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
        res.status(500).json({ error: "Failed to generate summary", message: formatGeminiError(error) });
    }
});

// Robust JSON parser that handles markdown backticks, unescaped newlines/tabs inside strings, and trailing commas
function safeParseJSON(text) {
    let cleanText = text.trim();
    
    // 1. Remove markdown code blocks if present
    if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\s*\n?/i, "");
        cleanText = cleanText.replace(/\n?\s*```$/, "");
    }
    cleanText = cleanText.trim();
    
    try {
        return JSON.parse(cleanText);
    } catch (error) {
        console.warn("Standard JSON.parse failed. Attempting advanced parsing and cleanup...", error.message);
        
        try {
            // 2. Escape literal newlines and control characters inside double-quoted string values
            let inString = false;
            let escaped = false;
            let result = "";
            
            for (let i = 0; i < cleanText.length; i++) {
                let char = cleanText[i];
                if (escaped) {
                    result += char;
                    escaped = false;
                } else if (char === '\\') {
                    result += char;
                    escaped = true;
                } else if (char === '"') {
                    result += char;
                    inString = !inString;
                } else if (inString && (char === '\n' || char === '\r')) {
                    result += '\\n'; // escape the literal newline
                } else if (inString && char === '\t') {
                    result += '\\t'; // escape literal tabs
                } else {
                    result += char;
                }
            }
            
            // 3. Remove trailing commas before closing braces/brackets
            let fixedText = result.replace(/,\s*([\]}])/g, '$1');
            
            return JSON.parse(fixedText);
        } catch (innerError) {
            console.error("Advanced JSON parsing and cleanup failed:", innerError);
            throw new Error(`JSON parse error: ${error.message} (Advanced recovery error: ${innerError.message}). Raw response text: ${text}`);
        }
    }
}

// Endpoint to parse full resume text into JSON
app.post('/api/parse-resume', checkApiKey, async (req, res) => {
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
  "certifications": [{"name": "", "url": "", "provider": "", "start": "", "end": "", "skills": ""}],
  "customSections": [{"heading": "", "content": ""}]
}

Resume:
"""
${text}
"""`,
            config: {
                systemInstruction: "You are a highly precise resume parser. Extract all information and return ONLY valid, raw JSON matching the requested structure. CRITICAL: Map any sections related to 'Achievements', 'Extracurricular Activities', 'Leadership', 'Awards & Honors', or 'Co-curricular Activities' directly to the 'leadership' array. For the 'leadership' array, map achievements or extracurriculars using the 'org' field for organization/award name, 'role' for role/award title, and 'bullets' for description. Do NOT put achievements, awards, or extracurricular activities into 'customSections'. If there is any significant section or information that does not fit into the standard predefined tabs (such as Declarations, Hobbies, Publications, Patents, Interests, etc.), dynamically extract it into the 'customSections' list, generating a professional title/heading for each section based on its content. Do not create custom sections for information that already fits the standard predefined fields. Ensure all internal quotes and newlines inside string values are properly escaped so that the response parses perfectly using standard JSON.parse(). Do not truncate the JSON output.",
                responseMimeType: "application/json",
                maxOutputTokens: 8000
            }
        });

        res.json(safeParseJSON(response.text));
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to parse resume", message: formatGeminiError(error) });
    }
});

// Endpoint to score resume for ATS optimization
app.post('/api/score-resume', checkApiKey, async (req, res) => {
    const { resume } = req.body;

    try {
        const response = await generateContentWithFallback({
            contents: `Analyze the following resume data for ATS (Applicant Tracking System) optimization.
Provide a score from 0 to 100 based on keyword density, clarity of impact in experience bullets (using Action Verbs), structural completeness, and professional terminology.

Data:
${resume}

Return ONLY a JSON object: {"score": 85, "feedback": "Detailed advice..."}`,
            config: {
                systemInstruction: "You are an ATS (Applicant Tracking System) expert. Analyze the resume and provide a score (0-100) and brief feedback. CRITICAL: The output MUST be valid JSON. Escaping all control characters properly.",
                responseMimeType: "application/json",
                maxOutputTokens: 2000
            }
        });

        res.json(safeParseJSON(response.text));
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to score resume", message: formatGeminiError(error) });
    }
});

/* ----------------------------------
   ROUTING
---------------------------------- */

// Serve static workspace
app.get('/workspace', (req, res) => {
    res.sendFile(path.join(__dirname, 'workspace.html'));
});

// Redirect root to index.html (the landing page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Avoid 404 for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
