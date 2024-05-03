import { useEffect, useRef, useState } from "react";
import { MultiPartQuestion } from "../lib/classes/question";
import { checkMultiPartQuestions } from "../lib/gemini";
import { Button, Center, CircularProgress, CircularProgressLabel, Input, Spinner, Textarea } from "@chakra-ui/react";
import { IoIosArrowDropright } from "react-icons/io";
import Link from "next/link";
import { AccentColor2, AccentColor4 } from "@/app/colors";
import { QuestionGeneratorStatus } from "./page";
import { GradedQuestionGeneratorChoiceButton, QuestionGeneratorChoiceButton } from "../study/quiz/QuizChoiceButton";

interface QuestionGraderProps {
    useAP: boolean;
    initialQuestionList: MultiPartQuestion[];
    setQuestionGeneratorStatus: React.Dispatch<React.SetStateAction<QuestionGeneratorStatus>>;
}

export const QuestionGrader = ({initialQuestionList, setQuestionGeneratorStatus}: QuestionGraderProps) => {
    const [questionList, setQuestionList] = useState<MultiPartQuestion[]>(initialQuestionList);
    const [percentCorrect, setPercentCorrect] = useState<number>(-1);
    const startedQuizGrading = useRef(false);

    useEffect(() => {
        const gradeQuestions = async () => {
            //TODO: handle gemini error
            const results = (await checkMultiPartQuestions(questionList)).split("\n").filter((line) => line !== "");
            const tempQuestionList = [...questionList];
            let numRight = 0;
            let numTotal = 0;
            let questionIndex = -1;
            let partIndex = -1;

            for(let i = 0; i < results.length; i++) {
                if (/Question \d/.test(results[i])) {
                    questionIndex++;
                    partIndex = -1;
                    numTotal++;
                } else {
                    if(/^\(\w\)/.test(results[i]) || /Part \w/.test(results[i]) || results[i].includes("Incorrect. ") || results[i].includes("Correct. ")) partIndex++;
                    console.log(results[i], questionIndex+1, partIndex+1)
                    if (results[i].includes("Correct. ")) {
                        numRight += questionList[questionIndex].heading.includes("Multiple Choice") ? 1 : 1 / questionList[questionIndex].parts.length;
                        tempQuestionList[questionIndex].numCorrect++;
                    }

                    tempQuestionList[questionIndex].results[partIndex] += results[i].replace(/\*/g, '');
                    
                }
            }
            setQuestionList(tempQuestionList);
            setPercentCorrect((numRight / numTotal) * 100);
        }

        if(!startedQuizGrading.current) {
            startedQuizGrading.current = true;
            gradeQuestions();
        }
    }, [])

    function displayGradedQuestion(question: MultiPartQuestion, index: number) {
        return (
            <div key={index} className="w-full text-wrap">
                <p className="font-bold text-2xl">{question.heading} - {question.numCorrect}/{question.results.filter((result) => result !== "").length}</p>
                <pre className="whitespace-pre-wrap text-lg">{question.question}</pre>
                <br/>
                {question.heading.includes("Multiple Choice") ? 
                    <>
                    {question.parts.map((choice, choiceIndex) => {
                        const correct = !question.results[0].includes("Incorrect. ");
                        return <GradedQuestionGeneratorChoiceButton key={choiceIndex} value={choice} color={choice===question.answer ? correct?"green":"red" : "lightgray"}/>
                    })}
                    <p className={`${question.results[0].includes("Incorrect. ")?"text-red-600":"text-green-600"}`}>{question.results[0]}</p>
                    </>:
                    question.parts.map((part, partIndex) => (
                    <div key={partIndex} className="mb-5">
                        <p>{part}</p>
                        <Textarea defaultValue={question.answers[partIndex]} disabled={true} borderColor={question.results[partIndex].includes("Incorrect. ")?"red":"green"} borderWidth="2px"/>
                        <p className={`${question.results[partIndex].includes("Incorrect. ")?"text-red-600":"text-green-600"}`}>{question.results[partIndex]}</p>
                    </div> 
                    ))
                }
                <br/>
            </div>
        )
    }

    function roundToThreeDigits(num: number) {
        if (num >= 100) {
            return Math.round(num);
        } else if (num >= 10) {
            return Number(num.toFixed(1));
        } else {
            return Number(num.toFixed(2));
        }
    }

    return (
        <div className="flex flex-col h-5/6 w-4/5 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto"style={{backgroundColor: AccentColor2}} >
            {percentCorrect>=0 ? <div className="h-full w-full">
                <div className="flex flex-row m-5 items-center">
                    <p className="text-5xl font-bold text-left ml-5 mr-auto">Great job!</p>
                    <CircularProgress className="mr-8" value={roundToThreeDigits(percentCorrect)} color="green" trackColor="red" size={"100px"}>
                        <CircularProgressLabel>{roundToThreeDigits(percentCorrect)}%</CircularProgressLabel>
                    </CircularProgress>
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

