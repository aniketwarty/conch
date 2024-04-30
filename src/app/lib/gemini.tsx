import { GoogleGenerativeAI } from "@google/generative-ai";
import { StudySet } from "./classes/study_set";
import { FreeResponseQuestion, MultiPartQuestion } from "./classes/question";

const gemini = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY??"");
export const model = gemini.getGenerativeModel({model: "gemini-1.0-pro"})

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

export async function generateQuestionsFromTopic(topic: string, numQuestions: number, useAP: boolean, APUnits: string, useMCQ: boolean, useFRQ: boolean) {
    let prompt = useAP ? "Using only past AP " + topic + " exams, generate " + numQuestions + " AP-style questions solely on AP " + topic + (APUnits!==""?" unit(s) " + APUnits:"") + " that could appear on the AP test.":
    "Generate " + numQuestions + " questions on the topic " + topic + "."
    if(useMCQ && useFRQ) prompt += `Include both multiple choice and multi-paragraph multi-part free response word problems that both ask about applications of concepts in a specific scenario, mirroring past AP exams.
    Make sure every question and part isn't general and is answerable using only the information provided.
    Do not include any images or graphs. Format the question exactly like with no other non-question text: 
    Question 1 (Free Response)
    Question text 
    (a) Part 1 
    (b) Part 2 
    (c) Part 3 
    (d) Part 4`
    else if(useMCQ) prompt += ` Include only multiple choice questions about applications of concepts in a specific scenario, mirroring past AP exams. 
    Make sure each part isn't a general question and is answerable using only the information provided. 
    Do not include any images or graphs. Format the question exactly like this with no other non-question text: 
    Question 1 (Multiple Choice)
    Question text 
    (a) Part 1 
    (b) Part 2 
    (c) Part 3 
    (d) Part 4`
    else if(useFRQ) prompt += ` Include only multi-paragraph multi-part free response word problems about applications of concepts in a specific scenario, mirroring past AP exams. 
    Make sure each part isn't a general question and is answerable using only the information provided. 
    Do not include any images or graphs. Format the question exactly like this with no other non-question text: 
    Question 1 (Free Response)
    Question text 
    (a) Part 1 
    (b) Part 2 
    (c) Part 3 
    (d) Part 4` 
    console.log(prompt)
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export async function checkMultiPartQuestion(questionList: MultiPartQuestion[]) {
    let prompt = `I will give you a series of questions that are either multiple choice or free response.
    Free response example:
    Question 1 (Free Response)
    Question text
    (a) Part 1
    (b) Part 2
    (c) Part 3
    (d) Part 4
    Answers:
    (a) Answer 1
    (b) Answer 2
    (c) Answer 3
    (d) Answer 4
    Multiple choice example:
    Question 1 (Multiple Choice)
    Question text
    (a) Choice 1
    (b) Choice 2
    (c) Choice 3
    (d) Choice 4
    Answer: (a) Choice 1
    For each free response question, determine if the answers are correct for each part of the question and give 1-2 sentences of feedback, even if they are correct. 
    For each multiple choice question, determine if the answer is the best answer.
    Format free response questions like this example for a 4-part question, with C for correct or I for incorrect:
    Question 1 (Free Response)
    (a) C. Although the answer is correct, it would have been better to include ...
    (b) I. The answer is incorrect because ...
    (c) C. 
    (d) I. The answer is incorrect because ...
    Format multiple choice questions like this example for a correct response:
    C. 
    Or this example for an incorrect response:
    I. The answer is incorrect because ...`
    for(const question of questionList) {
        prompt += question.heading + "\n";
        prompt += question.question + "\n";
        for(let i = 0; i < question.parts.length; i++) {
            prompt += "(" + String.fromCharCode(97 + i) + ") " + question.parts[i] + "\n";
        }
        prompt += "Answer: " + question.answer + "\n";
    }
    try {
        return (await model.generateContent(prompt)).response.text();
    } catch (e) {
        return ["The AI was unable to determine if the answers were correct.\n(" + e + ")"];
    }
}