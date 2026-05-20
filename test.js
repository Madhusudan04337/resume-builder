require('dotenv').config(); 
const { GoogleGenAI } = require('@google/genai'); 
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
}); 
ai.models.generateContent({
    model: 'gemini-2.5-flash-lite', 
    contents: 'Extract information from this resume and return ONLY raw JSON with this structure: {"personal": {"firstName": ""}}\n\nResume:\nJohn Doe',
    config: {
        systemInstruction: 'You are a resume parser. Extract all information and return ONLY raw JSON.',
        responseMimeType: 'application/json'
    }
}).then(res => { 
    console.log('RAW CONTENT:', JSON.stringify(res.text)); 
    try {
        JSON.parse(res.text);
        console.log('JSON.parse SUCCESS');
    } catch (e) {
        console.error('JSON.parse ERROR:', e.message);
    }
}).catch(console.error);


