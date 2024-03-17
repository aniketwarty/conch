import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiApiKey } from "./config";
import { StudySet } from "../classes/study_set";
import { FreeResponseQuestion } from "../classes/question";

const gemini = new GoogleGenerativeAI(geminiApiKey);
export const model = gemini.getGenerativeModel({model: "gemini-pro"})

export async function generateFRQ(set: StudySet) {
    const prompt = "Generate a 1-2 sentence question using the terms " + set.terms.join(", ") + //TODO: tune prompt + generate all FRQs in 1 prompt
                    " and their definitions " + set.definitions.join(", ") + ", respectively.";
    const question = (await model.generateContent(prompt)).response.text()
    return new FreeResponseQuestion(question);
}