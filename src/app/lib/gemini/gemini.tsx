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

export async function checkFRQ(question: string, answer: string) {//TODO: tune prompt
    const prompt = "Is the following answer '" + answer + "' an appropriate response to the question '" + question + "'?" + 
    "Format your response as exactly 'C' for correct or 'I' for incorrect, followed by a period and space, followed by a short 1-2" +
    " sentence explanation that includes the correct answer if the answer is incorrect."
    const emptyAnswerPrompt = "Give a short 1-2 sentence explanation for the answer to the question '" + question + "'."
    try {
        if(answer.replace(/\s/g, "") === "") return "I. " + (await model.generateContent(emptyAnswerPrompt)).response.text();
        return (await model.generateContent(prompt)).response.text();
    } catch (e) {
        return "I. The AI was unable to determine if the answer was correct.\n(" + e + ")";
    }
}