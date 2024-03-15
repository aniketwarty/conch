import { SetStateAction, useEffect, useState } from "react";
import { StudySet } from "../../lib/classes/study_set";
import { Button, Center, Spinner, Stack } from "@chakra-ui/react";
import { MultipleChoiceQuestion, Question, TrueFalseQuestion } from "../../lib/classes/question";
import { QuizOptionButton } from "./QuizOptionButton";
import { IoIosArrowDropright } from "react-icons/io";

interface QuizGeneratorProps {
    studySetString: string;
    options: any;
}

export const QuizGenerator = ({studySetString, options}: QuizGeneratorProps) => {
    const studySet = StudySet.fromString(studySetString);
    const [generatedQuiz, setGeneratedQuiz] = useState(false);
    const [questionList, setQuestionList] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<string[]>(Array(options["Number of Questions"]).fill(""));

    useEffect(() => {
        const allQuestionTypes = ["True/False Questions", "Multiple Choice Questions", "Free Response Questions"];
        const enabledQuestionTypes = allQuestionTypes.filter(type => options[type]);
        let setIndex = 0;    

        if(questionList.length === 0) {
            //TODO: shuffle around the questions so you dont just see the order of the terms repeat every time
            for (const questionType of enabledQuestionTypes) {
                if (questionType === "True/False Questions") {
                    for (let i = 0; i < options["Number of Questions"]/enabledQuestionTypes.length + options["Number of Questions"]%enabledQuestionTypes.length; i++) {
                        questionList.push(new TrueFalseQuestion(studySet, setIndex, true));
                        setIndex = (setIndex + 1) % studySet.terms.length;
                    }
                } else if (questionType === "Multiple Choice Questions") {
                    for (let i = 0; i < options["Number of Questions"]/enabledQuestionTypes.length; i++) {
                        questionList.push(new MultipleChoiceQuestion(studySet, setIndex));
                        setIndex = (setIndex + 1) % studySet.terms.length;
                    }
                } else if (questionType === "Free Response Questions") {
                }
            }
            setGeneratedQuiz(true);
        }
    }, [])

    function createQuestion(question: Question, index: number) {
        if(question instanceof TrueFalseQuestion) {
            return(
                <div className="flex flex-row mt-2" key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5 mb-10">
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
                            <QuizOptionButton option="True" answers={answers} setAnswers={setAnswers} index={index} stretch={true}/>
                            <QuizOptionButton option="False" answers={answers} setAnswers={setAnswers} index={index} stretch={true}/>
                        </div>
                    </div>
                </div>
            )
        } else if (question instanceof MultipleChoiceQuestion) {
            return (
                <div className="flex flex-row mt-2" key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5 mb-10">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="grid grid-rows-2 grid-cols-2 my-2 justify-items-stretch">
                            {question.choices.map((choice, key) => {
                                return <QuizOptionButton key={key} option={choice} answers={answers} setAnswers={setAnswers} index={index} prefix={String.fromCharCode(65+key)}/>
                            })}
                        </div>
                    </div>
                </div>
            )
        } //else if (question instanceof FreeResponseQuestion) {
        //     return(
                
        //     )
        // }
    }

    return (
        <div className="flex flex-col h-5/6 w-1/2 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto">
            {generatedQuiz ? <div className="h-full w-full">
                <p className="text-5xl font-bold mx-auto my-5 text-center">Quiz</p>  
                {questionList.map((question, index) => createQuestion(question, index))}
            </div>:
            <div className="flex flex-col items-center m-auto"> 
                <Spinner className="p-10"/>
                <p className="text-2xl m-8 font-bold">Generating Quiz...</p>
            </div>}
        </div>
    )
}