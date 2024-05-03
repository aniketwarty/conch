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
        async function generateQuestions() {
            const response = await generateQuestionsFromTopic(topic, numQuestions, useAP, APUnits, useMCQ, useFRQ);
            let responseList = response.split('\n');
            responseList = responseList.filter((x, index) => x !== "" || responseList[index - 1] !== "");
            const tempQuestionList = [];
            let questionPart = 0;
            for (const x of responseList) {
                if (/Question \d/.test(x)) {
                    tempQuestionList.push(new MultiPartQuestion(x.replace(/\*/g, ''), ""));
                    questionPart = 1;
                } else if(/\(\w\)/.test(x) || /Part \w/.test(x) || questionPart === 2) {
                    questionPart = 2;
                    if(/\(\w\)/.test(x) || /Part \w/.test(x)) {
                        tempQuestionList[tempQuestionList.length-1].parts.push(x.replace(/\*/g, ''));
                        tempQuestionList[tempQuestionList.length-1].answers.push("");
                        tempQuestionList[tempQuestionList.length-1].results.push("");
                    } else {
                        tempQuestionList[tempQuestionList.length-1].parts[tempQuestionList[tempQuestionList.length-1].parts.length-1] += "\n" + x.replace(/\*/g, '');
                    }
                }
                else if (x !== "" && questionPart === 1){
                    tempQuestionList[tempQuestionList.length-1].question += x.replace(/\*/g, '') + "\n";
                }
            }
            setQuestionList(tempQuestionList);
            finishedQuestionGeneration.current = true;
        }

        if(!startedQuestionGeneration.current) {
            startedQuestionGeneration.current = true;
            generateQuestions();
        }
    }, [regenerate])

    function updateAnswer(questionIndex: number, partIndex: number, answer: string) {
        setQuestionList(prevQuestionList => {
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
                                <QuestionGeneratorChoiceButton key={choiceIndex} value={choice} question={question} questionIndex={questionIndex} setQuestionList={setQuestionList}/>
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
                <div className="flex flex-row w-full mt-10">
                    <Button className="w-full mr-2" colorScheme="blue" onClick={() => {
                        startedQuestionGeneration.current = false;
                        finishedQuestionGeneration.current = false;
                        setRegenerate(!regenerate);
                    }}>Regenerate</Button>
                    <Button className="w-full ml-2" colorScheme="blue" 
                    onClick={() => {setQuestionGeneratorStatus(QuestionGeneratorStatus.SUBMITTED)}}>Submit</Button>
                </div>
                
            </>:<div className="flex flex-col items-center m-auto"> 
                <Spinner className="p-10"/>
                <p className="text-2xl mt-8 font-bold">Generating Quiz...</p>
            </div>
            }
        </div>
    )
}