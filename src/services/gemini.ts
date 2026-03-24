import { GoogleGenAI } from "@google/genai";
import { ChatMessage, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getStudyAdvice(query: string, history: ChatMessage[]) {
  const model = "gemini-3-flash-preview";
  const contents = [
    { role: "user", parts: [{ text: "You are StudySynapse AI, a brilliant and encouraging study tutor. Help the user with their academic questions, provide study tips, and explain complex concepts simply. Keep responses concise and use markdown for formatting." }] },
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    })),
    { role: "user", parts: [{ text: query }] }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: contents as any,
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to StudySynapse AI.";
  }
}

export async function generateStudyPlan(goal: string, timeframe: string): Promise<StudyPlan | null> {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate a detailed study plan for the following goal: "${goal}" over a timeframe of "${timeframe}". 
  Return the response in JSON format with the following structure:
  {
    "goal": "string",
    "schedule": [
      { "day": "Day 1", "topics": ["Topic A", "Topic B"], "duration": "2 hours" }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as StudyPlan;
    }
    return null;
  } catch (error) {
    console.error("Gemini Plan Error:", error);
    return null;
  }
}
