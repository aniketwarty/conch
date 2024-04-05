import React, { use, useEffect, useRef, useState } from "react";
import { StudySet } from "../../lib/classes/study_set";
import { Button, Center, Input, Spinner, Textarea } from "@chakra-ui/react";
import { FreeResponseQuestion, MultipleChoiceQuestion, Question, ShortAnswerQuestion, TrueFalseQuestion } from "../../lib/classes/question";
import { QuizChoiceButton } from "./QuizChoiceButton";
import { IoIosArrowDropright } from "react-icons/io";
import { generateFRQ } from "../../lib/gemini/gemini";
import { QuizStatus } from "./QuizPageDisplay";
import { questionTypes } from "./QuizPageDisplay";
import { set } from "firebase/database";

interface QuizGeneratorProps {
    studySetString: string;
    questionList: Question[];
    setQuestionList: React.Dispatch<React.SetStateAction<Question[]>>;
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    options: any;
    setQuizStatus: React.Dispatch<React.SetStateAction<QuizStatus>>;
}

export const QuizGenerator = ({studySetString, questionList, setQuestionList, answers, setAnswers, options, setQuizStatus}: QuizGeneratorProps) => {
    const studySet = StudySet.fromString(studySetString);
    const startedQuizGeneration = useRef(false)
    //TODO: shuffle set before making questions
    useEffect(() => {
        const enabledQuestionTypes = questionTypes.filter(type => options[type]);
        let setIndex = 0;
        
        const getFRQ = async (set: StudySet) => {
            const frq = await generateFRQ(set);
            setQuestionList(prevQuestionList => [...prevQuestionList, frq]);
        }

        if(!startedQuizGeneration.current) {
            startedQuizGeneration.current = true;
            const numQuestionsPerType = Math.floor(options["Number of Questions"] / enabledQuestionTypes.length);
            const remainder = options["Number of Questions"] % enabledQuestionTypes.length;
            //TODO: shuffle around the questions so you dont just see the order of the terms repeat every time
            for (const questionType of enabledQuestionTypes) {
                if (questionType === "True/False Questions") {
                    for (let i = 0; i < (numQuestionsPerType + (enabledQuestionTypes.indexOf("True/False Questions") < remainder?1:0)); i++) {
                        const question = new TrueFalseQuestion(studySet, setIndex, true);
                        setQuestionList(prevQuestionList => [...prevQuestionList, question]);
                        setIndex = (setIndex + 1) % studySet.terms.length;
                    }
                } else if (questionType === "Multiple Choice Questions") {
                    for (let i = 0; i < (numQuestionsPerType + (enabledQuestionTypes.indexOf("Multiple Choice Questions") < remainder?1:0)); i++) {
                        const question = new MultipleChoiceQuestion(studySet, setIndex);
                        setQuestionList(prevQuestionList => [...prevQuestionList, question]);
                        setIndex = (setIndex + 1) % studySet.terms.length;  
                    }
                } else if (questionType === "Short Answer Questions") {
                    for (let i = 0; i < (numQuestionsPerType + (enabledQuestionTypes.indexOf("Short Answer Questions") < remainder?1:0)); i++) {
                        const question = new ShortAnswerQuestion(studySet, setIndex);
                        setQuestionList(prevQuestionList => [...prevQuestionList, question]);
                        setIndex = (setIndex + 1) % studySet.terms.length;
                    }
                } else if (questionType === "Free Response Questions") {
                    for (let i = 0; i < (numQuestionsPerType + (enabledQuestionTypes.indexOf("Free Response Questions") < remainder?1:0)); i++) {
                        getFRQ(studySet);
                    }
                }
            }
        }
    }, [])

    function displayQuestion(question: Question, index: number) {
        if(question instanceof TrueFalseQuestion) {
            return(
                <div className="flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg" key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg">
                            <p className="w-1/2 m-2 text-lg font-bold">{question.term}</p>
                            <Center className="flex flex-col items-center">
                                <div className="h-1/2 min-h-5 w-px bg-black"/>
                                <IoIosArrowDropright className="my-1 grow" size={20}/>
                                <div className="h-1/2 min-h-5 w-px bg-black"/>
                            </Center>
                            <p className="w-1/2 m-2 text-lg font-bold">{question.definition}</p>
                        </div>
                        <div className="flex flex-row my-2 w-full place-items-stretch">
                            <QuizChoiceButton value="True" answers={answers} setAnswers={setAnswers} index={index} stretch={true}/>
                            <QuizChoiceButton value="False" answers={answers} setAnswers={setAnswers} index={index} stretch={true}/>
                        </div>
                    </div>
                </div>
            )
        } else if (question instanceof MultipleChoiceQuestion) {
            return (
                <div className="flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg" key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="grid grid-rows-2 grid-cols-2 my-2 justify-items-stretch">
                            {question.choices.map((choice, key) => {
                                return <QuizChoiceButton key={key} value={choice} answers={answers} setAnswers={setAnswers} index={index} prefix={String.fromCharCode(65+key)}/>
                            })}
                        </div>
                    </div>
                </div>
            )
        } else if (question instanceof ShortAnswerQuestion) {
            return (
                <div className="flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg" key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="flex my-2 justify-items-stretch">
                            <Input className="shadow-lg" bg="white" borderRadius="md" borderWidth={1.5} variant={"outline"} placeholder="Answer..."
                            value={answers[index]} onChange={(e) => {setAnswers({...answers, [index]: e.target.value})}}/>
                        </div> 
                    </div>
                </div>
            );   
        } else if (question instanceof FreeResponseQuestion) {
            return(
                <div className="flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg" key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="flex my-2 justify-items-stretch">
                            <Textarea className="shadow-lg" bg="white" borderRadius="md" borderWidth={1.5} variant={"outline"} placeholder="Answer..."
                            value={answers[index]} onChange={(e) => {setAnswers({...answers, [index]: e.target.value})}}/>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col h-5/6 w-2/5 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto">
            {questionList.length>=options["Number of Questions"] ? <div className="h-full w-full">
                <p className="text-5xl font-bold mx-auto my-5 text-center">Quiz</p>  
                {questionList.map((question, index) => displayQuestion(question, index))}
                <Center>
                    <Button className="w-full mb-5" colorScheme="blue" size="lg" onClick={() => setQuizStatus(QuizStatus.SUBMITTED)}>
                        Submit
                    </Button>
                </Center>
            </div>:
            <div className="flex flex-col items-center m-auto"> 
                <Spinner className="p-10"/>
                <p className="text-2xl mt-8 font-bold">Generating Quiz...</p>
                <p className="text-2xl font-bold">{Math.round(questionList.length/options["Number of Questions"]*100)}%</p>
            </div>}
        </div>
    )
}