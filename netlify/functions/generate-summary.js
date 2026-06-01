const { generateContentWithFallback, formatGeminiError } = require('./shared');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { skills, experience } = JSON.parse(event.body);

        const response = await generateContentWithFallback({
            contents: `Create a professional 3-line resume summary for a candidate with these skills: ${skills} and experience: ${experience}.`,
            config: {
                systemInstruction: "You are an expert resume writer.",
                maxOutputTokens: 200
            }
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary: response.text })
        };
    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: "Failed to generate summary", message: formatGeminiError(error) })
        };
    }
};
