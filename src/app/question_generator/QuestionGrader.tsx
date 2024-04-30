import { useEffect, useRef, useState } from "react";
import { MultiPartQuestion } from "../lib/classes/question";
import { checkMultiPartQuestion } from "../lib/gemini";
import { Button, Center, CircularProgress, CircularProgressLabel, Input, Spinner, Textarea } from "@chakra-ui/react";
import { IoIosArrowDropright } from "react-icons/io";
import Link from "next/link";
import { AccentColor2, AccentColor4 } from "@/app/colors";
import { QuestionGeneratorStatus } from "./page";

interface QuestionGraderProps {
    useAP: boolean;
    questionList: MultiPartQuestion[];
    setQuestionGeneratorStatus: React.Dispatch<React.SetStateAction<QuestionGeneratorStatus>>;
}

export const QuestionGrader = ({questionList, setQuestionGeneratorStatus}: QuestionGraderProps) => {
    const [results, setResults] = useState<string[]>([]);
    const startedQuizGrading = useRef(false);
    const [numCorrectQuestions, setNumCorrectQuestions] = useState(0);

    useEffect(() => {
        const gradeQuestion = async (index: number) => {
            const result = await checkMultiPartQuestion(questionList[index]);
            setResults(prevResults => [...prevResults, "I. " + "explanation"]);
        }

        if(!startedQuizGrading.current) {
            startedQuizGrading.current = true;
            for(let i = 0; i < questionList.length; i++) {
                gradeQuestion(i);
            }
        }
    }, [])

    function displayGradedQuestion(question: MultiPartQuestion, index: number) {
        return (
            <div key={index} className="flex flex-col w-full m-5">
                <p className="text-2xl font-bold">{question.question}</p>
                <p className="text-xl">{question.answer}</p>
                <p className="text-xl">{results[index]}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-5/6 w-2/5 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto"style={{backgroundColor: AccentColor2}} >
            {results.length >= questionList.length ? <div className="h-full w-full">
                <div className="flex flex-row m-5 items-center">
                    <p className="text-5xl font-bold text-left mr-auto">Great job!</p>
                    <CircularProgress className="mr-8" value={numCorrectQuestions/questionList.length*100} color="green" size={"100px"}>
                        <CircularProgressLabel>{Math.round(numCorrectQuestions/questionList.length*100)}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className="text-3xl">{numCorrectQuestions}/{questionList.length}</p>
                </div>
                {questionList.map((question, index) => displayGradedQuestion(question, index))}
                <div className="flex flex-row">
                    <Button className="mr-2 mb-5 w-1/2" style={{backgroundColor: AccentColor4, color: "white"}} size="lg" onClick={() => setQuestionGeneratorStatus(QuestionGeneratorStatus.INITIAL)}>Retry</Button>
                    <Link className="mr-2 mb-5 w-1/2" href="/home">
                        <Button className="w-full" style={{backgroundColor: AccentColor4, color: "white"}} size="lg">Home</Button>
                    </Link>
                </div>
            </div>: 
            <div className="flex flex-col items-center m-auto"> 
                <Spinner className="p-10"/>
                <p className="text-2xl mt-8 font-bold">Grading Quiz...</p>
                <p className="text-2xl font-bold">{Math.round(results.length/questionList.length*100)}%</p>
            </div>}
        </div>
    )
}