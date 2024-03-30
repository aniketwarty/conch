import { use, useEffect, useRef, useState } from "react";
import { FreeResponseQuestion, MultipleChoiceQuestion, Question, ShortAnswerQuestion, TrueFalseQuestion } from "../../lib/classes/question";
import { StudySet } from "../../lib/classes/study_set";
import { generateFRQ } from "../../lib/gemini/gemini";
import { questionTypes } from "./QuizPageDisplay";

interface QuizGraderProps {
    studySetString: string;
    questionList: Question[];
    answers: string[];
    options: any;
}

export const QuizGrader = ({studySetString, questionList, answers, options}: QuizGraderProps) => {
    const [results, setResults] = useState<string[]>([]);
    const startedQuizGrading = useRef(false)

    useEffect(() => {
        let numFRQs = 0;

        const gradeFRQs = async (set: StudySet, numQuestions: number) => {
            
        }

        for(let i = 0; i < questionList.length; i++) {
            if(questionList[i] instanceof TrueFalseQuestion) {
                answers[i] === questionList[i].answer ? setResults([...results, "Correct"]) : setResults([...results, "Incorrect"]);
            } else if(questionList[i] instanceof MultipleChoiceQuestion) {

            } else if(questionList[i] instanceof ShortAnswerQuestion) {

            } else if(questionList[i] instanceof FreeResponseQuestion) {
                numFRQs++;
            }
            
        }
    }, [])

    return (
        <div className="flex flex-col h-5/6 w-1/2 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto">
            
        </div>
    )
}