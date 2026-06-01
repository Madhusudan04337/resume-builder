const { generateContentWithFallback, safeParseJSON, formatGeminiError } = require('./shared');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { resume } = JSON.parse(event.body);

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
            body: JSON.stringify({ error: "Failed to score resume", message: formatGeminiError(error) })
        };
    }
};
