const { GoogleGenAI } = require('@google/genai');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function generateContentWithFallback(options) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
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

    // Step 2: Attempt fallback model with robust retries and exponential backoff
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
                currentDelay *= 2;
                continue;
            }
            throw error;
        }
    }
}

function safeParseJSON(text) {
    let cleanText = text.trim();
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
                    result += '\\n';
                } else if (inString && char === '\t') {
                    result += '\\t';
                } else {
                    result += char;
                }
            }
            
            let fixedText = result.replace(/,\s*([\]}])/g, '$1');
            return JSON.parse(fixedText);
        } catch (innerError) {
            console.error("Advanced JSON parsing and cleanup failed:", innerError);
            throw new Error(`JSON parse error: ${error.message} (Advanced recovery error: ${innerError.message}). Raw response text: ${text}`);
        }
    }
}

function formatGeminiError(error) {
    let message = error.message || "An unknown error occurred inside Gemini AI";
    if (typeof message === 'string' && message.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(message);
            if (parsed.error && parsed.error.message) {
                message = parsed.error.message;
            }
        } catch (e) {}
    }
    if (message.includes("API key was reported as leaked") || message.includes("API key") || error.status === 403) {
        return "Your Gemini API Key is invalid or has been reported as leaked. Please update the GEMINI_API_KEY inside your Netlify site settings.";
    }
    return message;
}

module.exports = {
    generateContentWithFallback,
    safeParseJSON,
    formatGeminiError
};
