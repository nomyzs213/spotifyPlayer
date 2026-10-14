import {GoogleGenAI} from "@google/genai";
import {throwError} from "./errorManager";


class GeminiAI{
    constructor() {
        this.gemini = new GoogleGenAI({
            enterprise: false,
            apiVersion: "v1",
            apiKey: process.env.GEMINI_API_KEY
        })
    }

    async evaluateTrackTags(artistName, songName){
        const prompt = `
           wygeneruj mi na podstwie this.MOOD_MAPPING = {

        energetic: ['workout', 'banger', 'party', 'energetic', 'rock', 'fast'],
        
        chill: ['chill', 'relax', 'lo-fi', 'ambient', 'calm', 'sleep'],
        
        sad: ['sad', 'melancholy', 'heartbreak', 'depressing', 'cry'],
        
        happy: ['happy', 'fun', 'upbeat', 'summer', 'feel good']

    }; tagi opisujacę dana piosenkę, wybierz 4 
    tagi które dokładnie mi opiszą dana piosenkę. Jako odpowiedź chce uzyskać tylko sformatowaną w json tablicę tych tagów . Nazwa artysty: ${artistName} , tytuł utworu: ${songName}`;
        const response = await this.gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: ""
        }).catch(err => throwError("problem with gemini ai", 500));

        return JSON.parse(response.text);
    }
}

const gemini = new GeminiAI();

export default gemini;