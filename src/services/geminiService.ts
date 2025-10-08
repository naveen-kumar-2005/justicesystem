import { GoogleGenAI, Type } from "@google/genai";
import type { CaseAnalysisResult, BiasAnalysisResult } from '../types';

// Fix: Adhere to coding guidelines by using process.env.API_KEY. This also resolves the TypeScript error.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const getChatResponseStream = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string) => {
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: 'You are an AI legal assistant for the Indian judicial system named "AI Justice". Provide concise and accurate answers based on Indian laws, acts, and past judgments. Be formal and respectful in all your responses.',
    },
    history
  });
  return chat.sendMessageStream({ message: newMessage });
};


const caseAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A concise summary of the case document provided.' },
        relevant_sections: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of relevant Indian Penal Code (IPC) sections or other applicable laws.' },
        predicted_outcome: { type: Type.STRING, description: 'The most likely outcome of the case (e.g., "Acquittal", "Conviction", "Settlement").' },
        confidence_score: { type: Type.NUMBER, description: 'A confidence score for the prediction, from 0.0 to 1.0.' },
        reasoning: { type: Type.STRING, description: 'A detailed explanation for the predicted outcome, citing precedents if possible.' },
    },
    required: ['summary', 'relevant_sections', 'predicted_outcome', 'confidence_score', 'reasoning']
};

export const analyzeCaseText = async (caseText: string): Promise<CaseAnalysisResult> => {
    const prompt = `Analyze the following case document from the Indian legal context and provide a detailed analysis.

Case Document:
---
${caseText}
---

Provide your analysis in the specified JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: caseAnalysisSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

const biasAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        bias_found: { type: Type.BOOLEAN, description: 'Whether any potential bias was detected.' },
        score: { type: Type.NUMBER, description: 'A bias score from 0 (no bias) to 10 (strong bias).' },
        explanation: { type: Type.STRING, description: 'A detailed explanation of the findings, describing the nature of any detected bias.' },
        flagged_phrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of specific quotes or phrases from the text that indicate potential bias.' },
    },
    required: ['bias_found', 'score', 'explanation', 'flagged_phrases']
};

export const detectBiasInText = async (judgmentText: string): Promise<BiasAnalysisResult> => {
    const prompt = `Analyze the following legal judgment text for potential signs of bias (e.g., related to gender, caste, religion, or other protected characteristics under Indian law). Flag specific phrases and provide an overall analysis.

Judgment Text:
---
${judgmentText}
---

Provide your analysis in the specified JSON format.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: biasAnalysisSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};