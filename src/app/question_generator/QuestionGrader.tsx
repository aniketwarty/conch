import { useEffect, useRef, useState } from "react";
import { MultiPartQuestion } from "../lib/classes/question";
import { checkMultiPartQuestions } from "../lib/gemini";
import { Button, Center, CircularProgress, CircularProgressLabel, Input, Spinner, Textarea } from "@chakra-ui/react";
import { IoIosArrowDropright } from "react-icons/io";
import Link from "next/link";
import { AccentColor2, AccentColor4 } from "@/app/colors";
import { QuestionGeneratorStatus } from "./page";

interface QuestionGraderProps {
    useAP: boolean;
    initialQuestionList: MultiPartQuestion[];
    setQuestionGeneratorStatus: React.Dispatch<React.SetStateAction<QuestionGeneratorStatus>>;
}

export const QuestionGrader = ({initialQuestionList, setQuestionGeneratorStatus}: QuestionGraderProps) => {
    const [questionList, setQuestionList] = useState<MultiPartQuestion[]>(initialQuestionList);
    const startedQuizGrading = useRef(false);
    const finishedQuizGrading = useRef(false);

    useEffect(() => {
        const gradeQuestions = async () => {
            //TODO: handle gemini error
            const results = (await checkMultiPartQuestions(questionList)).split("\n").filter((line) => line !== "");
            let questionIndex = -1;
            let partIndex = -1;
            for(let i = 0; i < results.length; i++) {
                if (/Question \d/.test(results[i])) {
                    questionIndex++;
                    partIndex = -1;
                } else if (results[i].startsWith("Correct. ") || results[i].startsWith("Incorrect. ")) {
                    partIndex++;
                    setQuestionList(prevQuestionList => [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, results: [...q.results.slice(0, partIndex), results[i], ...q.answers.slice(partIndex + 1)]} : q) as MultiPartQuestion[]])
                }
            }
        }

        if(!startedQuizGrading.current) {
            startedQuizGrading.current = true;
            gradeQuestions();
        }
    }, [])

    function displayGradedQuestion(question: MultiPartQuestion, index: number) {
        return (
            <div key={index} className="flex flex-col w-full m-5">
                <p className="text-2xl font-bold">{question.question}</p>
                <p className="text-xl">{question.answer}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-5/6 w-2/5 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto"style={{backgroundColor: AccentColor2}} >
            {finishedQuizGrading.current ? <div className="h-full w-full">
                <div className="flex flex-row m-5 items-center">
                    <p className="text-5xl font-bold text-left mr-auto">Great job!</p>
                    <CircularProgress className="mr-8"  color="green" size={"100px"}>
                        <CircularProgressLabel>Grading questions</CircularProgressLabel>
                    </CircularProgress>
                    <p className="text-3xl">100/100</p>
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
            </div>}
        </div>
    )
}

