import { useEffect, useRef, useState } from "react";
import { FreeResponseQuestion, MultipleChoiceQuestion, Question, ShortAnswerQuestion, TrueFalseQuestion } from "../../lib/classes/question";
import { checkFRQ } from "../../lib/gemini/gemini";
import { Spinner } from "@chakra-ui/react";

interface QuizGraderProps {
    studySetString: string;
    questionList: Question[];
    answers: string[];
    options: any;
}

export const QuizGrader = ({studySetString, questionList, answers, options}: QuizGraderProps) => {
    const [results, setResults] = useState<string[]>([]);
    const startedQuizGrading = useRef(false);

    useEffect(() => {
        const gradeFRQ = async (index: number) => {
            const result = await checkFRQ(questionList[index].question, answers[index]);
            console.log(result)
            setResults(prevResults => [...prevResults, result]);
        }

        if(!startedQuizGrading.current) {
            startedQuizGrading.current = true;
            for(let i = 0; i < questionList.length; i++) {
                if(questionList[i] instanceof TrueFalseQuestion) {
                    answers[i] === questionList[i].answer ? setResults(prevResults => [...prevResults, "Correct"]) : setResults(prevResults => [...prevResults, "Incorrect"]);
                } else if(questionList[i] instanceof MultipleChoiceQuestion) {
                    answers[i] === questionList[i].answer ? setResults(prevResults => [...prevResults, "Correct"]) : setResults(prevResults => [...prevResults, "Incorrect"]);
                } else if(questionList[i] instanceof ShortAnswerQuestion) {
                    answers[i] === questionList[i].answer ? setResults(prevResults => [...prevResults, "Correct"]) : setResults(prevResults => [...prevResults, "Incorrect"]);
                } else if(questionList[i] instanceof FreeResponseQuestion) {
                    gradeFRQ(i);
                }
            }
            console.log(results)
        }
    }, [])

    return (
        <div className="flex flex-col h-5/6 w-1/2 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto">
            {results.length >= questionList.length ? <div className="h-full w-full">
                reesults
            </div>: 
            <div className="flex flex-col items-center m-auto"> 
                <Spinner className="p-10"/>
                <p className="text-2xl mt-8 font-bold">Grading Quiz...</p>
                <p className="text-2xl font-bold">{Math.round(results.length/questionList.length*100)}%</p>
            </div>}
        </div>
    )
}