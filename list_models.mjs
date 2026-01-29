
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function main() {
    // Read API Key from .env.local manually
    let apiKey = '';
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match && match[1]) {
            apiKey = match[1].trim();
        }
    } catch (e) {
        console.error("Could not read .env.local", e);
        return;
    }

    if (!apiKey) {
        console.error("API Key not found in .env.local");
        return;
    }

    console.log("Using API Key:", apiKey.slice(0, 5) + "...");

    const client = new GoogleGenAI({ apiKey });

    try {
        console.log("Fetching models...");
        const models = await client.models.list();
        // The list method returns a Pager, we need to iterate or get page
        // Based on SDK types, let's try to just log the response structure first
        // or iterate if it's async iterable

        for await (const model of models) {
            console.log(`Model: ${model.name}`);
            if (model.supportedGenerationMethods) {
                console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
            }
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

main();
