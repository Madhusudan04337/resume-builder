const { generateContentWithFallback, safeParseJSON, formatGeminiError } = require('./shared');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { text } = JSON.parse(event.body);
        if (!text) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing body property: text" }) };
        }

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
                systemInstruction: "You are a highly precise resume parser. Extract all information and return ONLY valid, raw JSON matching the requested structure. CRITICAL: Analyze the entire resume text. If there is any significant section or information that does not fit into the standard predefined tabs (such as Declarations, Hobbies, Publications, Patents, Interests, etc.), dynamically extract it into the 'customSections' list, generating a professional title/heading for each section based on its content. Do not create custom sections for information that already fits the standard predefined fields. Ensure all internal quotes and newlines inside string values are properly escaped so that the response parses perfectly using standard JSON.parse(). Do not truncate the JSON output.",
                responseMimeType: "application/json",
                maxOutputTokens: 8000
            }
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(safeParseJSON(response.text))
        };
    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: "Failed to parse resume", message: formatGeminiError(error) })
        };
    }
};
