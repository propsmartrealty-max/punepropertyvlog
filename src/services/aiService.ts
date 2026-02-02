// @ts-ignore
import { GoogleGenAI } from "@google/genai";
import { Project, Builder } from "../types";

// Initialize Gemini
// Note: We ignore the type error for now if the SDK types aren't fully picked up
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const client = new GoogleGenAI({ apiKey });

// We need a partial project type that doesn't strictly require ID or internal fields
export type AIProjectDetails = Omit<Project, 'id'>;
export type AIBuilderDetails = Omit<Builder, 'id' | 'locations'>; // Locations inferred from projects usually

export const fetchProjectDetailsFromAI = async (query: string): Promise<Partial<AIProjectDetails>> => {
    console.log("Starting AI fetch for query:", query);

    // Debug API Key presence (do not log full key)
    if (!apiKey) console.error("API Key is missing/empty");

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        throw new Error('Gemini API Key is missing. Please check .env.local and restart server.');
    }

    try {
        const prompt = `
        You are a Database Assistant for a Real Estate Application.
        Your job is to specific factual data about the following project in Pune, India:
        "${query}"

        RULES:
        1. **ACCURACY IS PARAMOUNT**. If you do not find the exact RERA ID or Carpet Area, return null or empty string. DO NOT GUESS.
        2. **RERA ID**: Must start with 'P521' (for Pune) followed by digits. If unsure, omit.
        3. **PRICING**: Use the most recent 2024/2025 market price.
        4. **FORMAT**: Return PURE JSON. No markdown.
        5. **SOURCE TRUTH**: Prioritize data from reliable real estate portals if direct government data is inaccessible.

        Return this JSON structure:
        {
            "title": "Exact Official Project Name",
            "builderId": "Name of the builder (string)",
            "location": "Specific Micro-Location (e.g. 'Baner Annex', 'Kharadi', 'Wakad'). Avoid generic 'Pune'.",
            "priceRange": "e.g. ₹85L - ₹1.2Cr (Market Estimate)",
            "exactPrice": "Starting Price (e.g. ₹87.5 Lakhs)",
            "configurations": ["2 BHK", "3 BHK"], 
            "status": "Under Construction", 
            "type": "Residential",
            "possessionDate": "e.g. Dec 2027",
            "reraId": "P521000vx... (Return NULL if not explicitly found)",
            "description": "Professional summary (max 100 words).",
            "metaDescription": "SEO Description.",
            "seoKeywords": ["keyword1", "keyword2"],
            "features": ["Amenity 1", "Amenity 2"],
            "slug": "project-name-location-pune-official", // e.g. 'godrej-rivergreens-manjari-pune'
            "advancedConfigurations": [
                {
                    "name": "2 BHK Classic",
                    "carpetArea": 0, // Set to 0 if unknown. DO NOT ESTIMATE.
                    "basePrice": 0,  // Set to 0 if unknown.
                    "bathrooms": 2
                }
            ]
        }
        `;

        console.log("Sending prompt to Gemini...");
        const response = await client.models.generateContent({
            model: "gemini-flash-latest",
            contents: [{ parts: [{ text: prompt }] }]
        });

        const text = response.text;
        if (!text) throw new Error("Empty response from AI");

        // Cleanup potential markdown
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(cleanJson);
            // Normalize type if AI returns something weird
            const validTypes = ['Residential', 'Commercial', 'Plot'];
            if (!validTypes.includes(data.type)) data.type = 'Residential';

            return data;
        } catch (jsonError) {
            console.error("JSON Parse Error:", jsonError);
            throw new Error("AI returned invalid data format. Please try again.");
        }
    } catch (error: any) {
        console.error("AI Fetch Error:", error);
        throw new Error(error.message || "Failed to fetch details from AI.");
    }
};

export const fetchBuilderDetailsFromAI = async (builderName: string): Promise<Partial<AIBuilderDetails>> => {
    if (!apiKey) throw new Error('Gemini API Key is missing.');

    try {
        const prompt = `
        Search for the real estate developer "${builderName}" in India/Pune.
        Return a STRICT JSON object:
        {
            "name": "${builderName}",
            "slug": "builder-slug",
            "logo": "URL to a high quality logo image (from reliable source or placeholder)",
            "heroImage": "URL to a banner image of their office or flagship project",
            "description": "2-sentence company profile (year established, reputation).",
            "establishedYear": 1990,
            "totalProjects": 0,    // Estimate
            "ongoingProjects": 0   // Estimate
        }
        Do not include markdown.
        `;

        const response = await client.models.generateContent({
            model: "gemini-flash-latest",
            contents: [{ parts: [{ text: prompt }] }]
        });

        const text = response.text;
        if (!text) throw new Error("Empty response from AI");

        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);

    } catch (error: any) {
        console.error("AI Builder Fetch Error:", error);
        throw new Error(error.message || "Failed to fetch builder details.");
    }
};
