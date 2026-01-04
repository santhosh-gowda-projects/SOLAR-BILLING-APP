
import { GoogleGenAI } from "@google/genai";

export const getEnergyInsights = async (units: number, month: string) => {
  try {
    // Initialized GoogleGenAI client using process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 short, helpful energy-saving tips for a tenant who consumed ${units} units of solar energy in ${month}. Keep it concise and encouraging.`,
    });
    return response.text || "Conserve energy by using high-drain appliances during peak sun hours (10 AM - 3 PM).";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Conserve energy by using high-drain appliances during peak sun hours (10 AM - 3 PM).";
  }
};

export const getBillingSummary = async (bills: any[]) => {
  try {
    // Initialized GoogleGenAI client using process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
    const prompt = `Analyze these billing records: ${JSON.stringify(bills)}. Provide a one-sentence summary of revenue trends and one action item for the property owner.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Revenue is stable. Consider checking meter MTR-102 for potential maintenance.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Revenue is stable. Consider checking meter MTR-102 for potential maintenance.";
  }
};
