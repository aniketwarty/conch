import { useEffect, useRef, useState } from "react"
import { generateQuestionsFromTopic } from "../lib/gemini";
import { Button, IconButton, Spinner, Textarea } from "@chakra-ui/react";
import { MultiPartQuestion, Question } from "../lib/classes/question";
import { AccentColor2 } from "../colors";
import { QuestionGeneratorChoiceButton } from "../study/quiz/QuizChoiceButton";
import { QuestionGeneratorStatus } from "./page";
import { IoMdArrowBack } from "react-icons/io";

interface QuestionGeneratorProps {
    topic: string;
    useAP: boolean;
    APUnits: string;
    numQuestions: number;
    useMCQ: boolean;
    useFRQ: boolean;
    questionList: MultiPartQuestion[];
    setQuestionList: React.Dispatch<React.SetStateAction<MultiPartQuestion[]>>;
    setQuestionGeneratorStatus: React.Dispatch<React.SetStateAction<QuestionGeneratorStatus>>;
}
//TODO: handle when mcq button text is too long
export const QuestionGenerator = ({topic, useAP, APUnits, numQuestions, useMCQ, useFRQ, questionList, setQuestionList, setQuestionGeneratorStatus}: QuestionGeneratorProps) => {
    const startedQuestionGeneration = useRef(false);
    const finishedQuestionGeneration = useRef(false);
    const [regenerate, setRegenerate] = useState(false);

    useEffect(() => {
        function setQuestionHeading(questionIndex: number, heading: string) {
            setQuestionList(prevQuestionList => [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, heading: heading} : q) as MultiPartQuestion[]])
        }

        function addToQuestion(questionIndex: number, question: string) {
            setQuestionList(prevQuestionList => {
                return [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, question: q.question + question} : q) as MultiPartQuestion[]];
            })
        }

        function addQuestionPart(questionIndex: number, part: string) {
            setQuestionList(prevQuestionList => {
                return [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, parts: [...q.parts, part], answers: [...q.answers, ""]} : q) as MultiPartQuestion[]];
            })
        }

        async function generateQuestions() {
            const response = await generateQuestionsFromTopic(topic, numQuestions, useAP, APUnits, useMCQ, useFRQ);
            let responseList = response.split('\n');

            responseList = responseList.filter((x, index) => x !== "" || responseList[index - 1] !== "");

            let questionListIndex = -1;
            for (const x of responseList) {
                if (/Question \d/.test(x)) {
                    questionListIndex++;
                    setQuestionHeading(questionListIndex, x.replace(/\*/g, ''));
                } else if(/^\(\w\)/.test(x)) {
                    addQuestionPart(questionListIndex, x.replace(/\*/g, ''));
                }
                else if (x !== ""){
                    addToQuestion(questionListIndex, x.replace(/\*/g, '') + "\n");
                }
            }
            finishedQuestionGeneration.current = true;
        }

        if(!startedQuestionGeneration.current) {
            startedQuestionGeneration.current = true;
            setQuestionList(Array(numQuestions).fill(new MultiPartQuestion("", "", [])))
            generateQuestions();
        }
    }, [regenerate])

    function updateAnswer(questionIndex: number, partIndex: number, answer: string) {
        setQuestionList(prevQuestionList => {
            console.log(prevQuestionList)
            return [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, answers: q.answers.map((oldAnswer, i) => partIndex === i ? answer : oldAnswer)} : q) as MultiPartQuestion[]];
        })
    }
    //TODO: add some way to format tables into smth more readable
    return (
        <div className="flex flex-col h-full w-4/5 shadow-2xl rounded-lg mx-auto my-10 px-5 pb-5 items-center overflow-y-auto" style={{backgroundColor: AccentColor2}}>
            {finishedQuestionGeneration.current ? <>
                <div className="flex flex-row items-center w-full">
                    <IconButton mt={-10} aria-label="Back" icon={<IoMdArrowBack/>} colorScheme="blue" onClick={() => setQuestionGeneratorStatus(QuestionGeneratorStatus.INITIAL)}/>
                    <p className=" ml-auto text-4xl font-bold mx-auto my-10 text-center">Questions</p>
                </div>
                {questionList.map((question, questionIndex) => (
                    <div key={questionIndex} className="w-full text-wrap">
                        <p className="font-bold text-2xl">{question.heading}</p>
                        <pre className="whitespace-pre-wrap text-lg">{question.question}</pre>
                        <br/>
                        {question.heading.includes("Multiple Choice") ? 
                            question.parts.map((choice, choiceIndex) => (
                                <div key={choiceIndex} className="flex flex-row w-full">
                                    <QuestionGeneratorChoiceButton value={choice} question={question} questionIndex={questionIndex} setQuestionList={setQuestionList}/>
                                </div>
                            )):
                            question.parts.map((part, partIndex) => (
                                <div key={partIndex} className="mb-5">
                                    <p>{part}</p>
                                    <Textarea onChange={(e) => updateAnswer(questionIndex, partIndex, e.target.value)}/>
                                </div> 
                            ))
                        }
                        <br/>
                    </div>
                ))}
                <div className="flex flex-row w-full">
                    <Button className="w-full mr-3" colorScheme="blue" onClick={() => {
                        startedQuestionGeneration.current = false;
                        finishedQuestionGeneration.current = false;
                        setRegenerate(!regenerate);
                    }}>Regenerate</Button>
                    <Button className="w-full ml-3" colorScheme="blue" 
                    onClick={() => setQuestionGeneratorStatus(QuestionGeneratorStatus.SUBMITTED)}>Submit</Button>
                </div>
                
            </>:<div className="flex flex-col items-center m-auto"> 
                <Spinner className="p-10"/>
                <p className="text-2xl mt-8 font-bold">Generating Quiz...</p>
            </div>
            }
        </div>
    )
}