import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface UserData {
  mood: number; // 1-10
  stress: number; // 1-10
  sleepHours: number;
  activityMinutes: number;
  dietQuality: number; // 1-10
  journalEntry: string;
  hrv: number; // Heart Rate Variability (ms)
}

export const getNeuroInsights = async (data: UserData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // Using a stable flash model for quick insights
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this neuro-health data and provide personalized insights. 
              Data: ${JSON.stringify(data)}
              
              Provide the response in JSON format with the following structure:
              {
                "brainScore": number (0-100),
                "stateDescription": "string",
                "recommendations": ["string"],
                "cognitiveOutlook": "string",
                "scientificContext": "string"
              }`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brainScore: { type: Type.NUMBER },
            stateDescription: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            cognitiveOutlook: { type: Type.STRING },
            scientificContext: { type: Type.STRING }
          },
          required: ["brainScore", "stateDescription", "recommendations", "cognitiveOutlook", "scientificContext"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error fetching neuro insights:", error);
    return null;
  }
};
