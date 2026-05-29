const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ override: true });

const { setupDatabase, pool } = require('./db_setup');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'mdk_resume_ai_secure_token_key_2026';

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
                systemInstruction: "You are a highly precise resume parser. Extract all information and return ONLY valid, raw JSON matching the requested structure. CRITICAL: Ensure all internal quotes and newlines inside string values are properly escaped so that the response parses perfectly using standard JSON.parse(). Do not truncate the JSON output.",
                responseMimeType: "application/json",
                maxOutputTokens: 8000
            }
        });

        res.json(safeParseJSON(response.text));
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
        res.status(500).json({ error: "Failed to score resume", message: error.message, stack: error.stack });
    }
});

/* ----------------------------------
   POSTGRESQL SECURE AUTHENTICATION APIs
---------------------------------- */

// JWT Authorization Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Authentication token missing" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Session invalid or expired. Please sign in again." });
        }
        req.user = user;
        next();
    });
}

// User Registration Endpoint (Secure parameterized query + bcrypt hashing)
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name, provider } = req.body;

    if (!email || !provider) {
        return res.status(400).json({ error: "Email and provider type are required" });
    }

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
        
        if (userExists.rows.length > 0) {
            const existingUser = userExists.rows[0];
            
            // If social login and user exists, just log them in
            if (provider !== 'email') {
                const token = jwt.sign(
                    { id: existingUser.id, email: existingUser.email, name: existingUser.name, provider: existingUser.provider },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return res.json({ success: true, token, user: { id: existingUser.id, email: existingUser.email, name: existingUser.name, provider: existingUser.provider } });
            }
            
            return res.status(400).json({ error: "An account with this email is already registered." });
        }

        let passwordHash = null;
        if (provider === 'email') {
            if (!password || password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            // Hashing password securely with bcrypt
            passwordHash = await bcrypt.hash(password, 10);
        }

        // Insert new user securely
        const newUserQuery = `
            INSERT INTO users (email, password_hash, name, provider) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, email, name, provider
        `;
        const values = [email.trim().toLowerCase(), passwordHash, name || 'User', provider];
        const result = await pool.query(newUserQuery, values);
        const newUser = result.rows[0];

        // Generate dynamic secure JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, name: newUser.name, provider: newUser.provider },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token, user: newUser });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server registration failed", details: error.message });
    }
});

// User Login Endpoint (Secure parameterized query + bcrypt compare)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Incorrect email or password." });
        }

        const user = result.rows[0];

        if (user.provider !== 'email') {
            return res.status(400).json({ error: `This account was registered using ${user.provider}. Please log in using that method.` });
        }

        // Compare secure password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect email or password." });
        }

        // Generate signed session JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, provider: user.provider },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, email: user.email, name: user.name, provider: user.provider }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server login failed", details: error.message });
    }
});

/* ----------------------------------
   POSTGRESQL SECURE DRAFTS SYNC APIs
---------------------------------- */

// Fetch all drafts for the authenticated user
app.get('/api/users/me/drafts', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT name, resume_data, updated_at FROM drafts WHERE user_id = $1 ORDER BY updated_at DESC';
        const result = await pool.query(query, [req.user.id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error("Fetch Drafts Error:", error);
        res.status(500).json({ error: "Failed to fetch drafts from server", details: error.message });
    }
});

// Sync/Save a draft to the database (Secure SQL Upsert)
app.post('/api/users/me/drafts', authenticateToken, async (req, res) => {
    const { name, resume_data } = req.body;

    if (!name || !resume_data) {
        return res.status(400).json({ error: "Draft name and resume data are required" });
    }

    try {
        // Upsert draft using unique constraints
        const syncQuery = `
            INSERT INTO drafts (user_id, name, resume_data, updated_at) 
            VALUES ($1, $2, $3, NOW()) 
            ON CONFLICT ON CONSTRAINT unique_user_draft_name 
            DO UPDATE SET resume_data = EXCLUDED.resume_data, updated_at = NOW() 
            RETURNING name, updated_at
        `;
        const result = await pool.query(syncQuery, [req.user.id, name.trim(), JSON.stringify(resume_data)]);
        
        res.json({ success: true, draft: result.rows[0] });
    } catch (error) {
        console.error("Sync Draft Error:", error);
        res.status(500).json({ error: "Failed to save draft to server", details: error.message });
    }
});

// Delete a draft from the database
app.delete('/api/users/me/drafts/:name', authenticateToken, async (req, res) => {
    const draftName = req.params.name;

    try {
        const deleteQuery = 'DELETE FROM drafts WHERE user_id = $1 AND name = $2';
        await pool.query(deleteQuery, [req.user.id, draftName]);
        
        res.json({ success: true });
    } catch (error) {
        console.error("Delete Draft Error:", error);
        res.status(500).json({ error: "Failed to delete draft from server", details: error.message });
    }
});

/* ----------------------------------
   ROUTING
---------------------------------- */

// Serve static workspace
app.get('/workspace', (req, res) => {
    res.sendFile(path.join(__dirname, 'workspace.html'));
});

// Redirect root to index.html (the new landing page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Avoid 404 for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

const PORT = process.env.PORT || 5000;

// Initialize database tables on server start, then listen
setupDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("❌ Server startup failed due to database connection error:", err.message);
        // Start server anyway for front-end guest accessibility if PG local server is offline
        app.listen(PORT, () => console.log(`⚠ Server running in OFFLINE/GUEST MODE on port ${PORT} (Database connection failed)`));
    });
