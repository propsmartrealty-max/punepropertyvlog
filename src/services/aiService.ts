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
        You are a real estate assistant. Search for the following real estate project in Pune and extract its details:
        "${query}"

        Return a STRICT JSON object with the following fields (if data is missing, use empty strings or reasonable estimates/TBD):
        Return a STRICT JSON object with the following fields:
        {
            "title": "Project Name",
            "builderId": "Name of the builder (string)",
            "location": "Project Location (Area, City)",
            "priceRange": "Market Range (e.g. ₹85L - ₹1.2Cr)",
            "exactPrice": "Specific Starting Price (e.g. ₹87.5 Lakhs*)",
            "configurations": ["2BHK", "3BHK"],
            "configurationDetails": [
                { "type": "2 BHK", "carpetArea": "e.g. 750-850 sq.ft", "priceRange": "₹85L - ₹95L" },
                { "type": "3 BHK", "carpetArea": "e.g. 1050-1150 sq.ft", "priceRange": "₹1.1Cr - ₹1.3Cr" }
            ],
            "status": "New Launch" | "Under Construction" | "Ready to Move",
            "type": "Residential" | "Commercial" | "Plot",
            "possessionDate": "e.g. Dec 2027",
            "reraId": "Real RERA Number if avail, else 'Coming Soon'",
            "description": "A unique, creative, and non-repetitive marketing overview (~100 words). Focus on specific USPs of this project like architectural style, specific amenities, or view.",
            "metaDescription": "SEO-optimized description (max 160 chars) for Google Results.",
            "seoKeywords": ["keyword1", "keyword2", "keyword3"],
            "highlights": ["Why this project? Point 1", "Point 2", "Point 3"],
            "features": ["Feature 1", "Feature 2", "Feature 3"],
            "slug": "project-name-location-slug"
        }

        Do not include markdown formatting (like \`\`\`json). Just return the raw JSON string.
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
