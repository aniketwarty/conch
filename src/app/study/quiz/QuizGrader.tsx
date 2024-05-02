import { useEffect, useRef, useState } from "react";
import { FreeResponseQuestion, MultipleChoiceQuestion, Question, ShortAnswerQuestion, TrueFalseQuestion } from "../../lib/classes/question";
import { checkFRQ } from "../../lib/gemini";
import { Button, Center, CircularProgress, CircularProgressLabel, Input, Spinner, Textarea } from "@chakra-ui/react";
import { IoIosArrowDropright } from "react-icons/io";
import { GradedQuizChoiceButton } from "./QuizChoiceButton";
import Link from "next/link";
import { StudySet } from "../../lib/classes/study_set";
import { QuizStatus } from "./QuizPageDisplay";
import { AccentColor2, AccentColor4 } from "@/app/colors";

interface QuizGraderProps {
    studySetString: string;
    questionList: Question[];
    answers: string[];
    setQuizStatus: React.Dispatch<React.SetStateAction<QuizStatus>>;
}

export const QuizGrader = ({studySetString, questionList, answers, setQuizStatus}: QuizGraderProps) => {
    const [results, setResults] = useState<string[]>([]);
    const startedQuizGrading = useRef(false);
    const [numCorrectQuestions, setNumCorrectQuestions] = useState(0);

    useEffect(() => {
        const gradeFRQ = async (index: number) => {
            const result = await checkFRQ(questionList[index].question, answers[index]);
            setResults(prevResults => [...prevResults, result]);
            if(result.charAt(0) === "C") setNumCorrectQuestions(prevNumCorrectQuestions => prevNumCorrectQuestions+1);
        }

        if(!startedQuizGrading.current) {
            startedQuizGrading.current = true;
            for(let i = 0; i < questionList.length; i++) {
                if(questionList[i] instanceof TrueFalseQuestion) {
                    if(answers[i] === questionList[i].answer) {
                        setNumCorrectQuestions(prevNumCorrectQuestions => prevNumCorrectQuestions+1);
                        setResults(prevResults => [...prevResults, "Correct"])
                    } else setResults(prevResults => [...prevResults, "Incorrect"]);
                } else if(questionList[i] instanceof MultipleChoiceQuestion) {
                    if(answers[i] === questionList[i].answer) {
                        setNumCorrectQuestions(prevNumCorrectQuestions => prevNumCorrectQuestions+1);
                        setResults(prevResults => [...prevResults, "Correct"]);
                    } else setResults(prevResults => [...prevResults, "Incorrect"]);
                } else if(questionList[i] instanceof ShortAnswerQuestion) {
                    if(answers[i].toLowerCase() === questionList[i].answer.toLowerCase()) {
                        setNumCorrectQuestions(prevNumCorrectQuestions => prevNumCorrectQuestions+1);
                        setResults(prevResults => [...prevResults, "Correct"]);
                    } else setResults(prevResults => [...prevResults, "Incorrect"]);
                } else if(questionList[i] instanceof FreeResponseQuestion) {
                    gradeFRQ(i);
                }
            }
        }
    }, [])

    function displayGradedQuestion(question: Question, index: number) {
        if(question instanceof TrueFalseQuestion) {
            return(
                <div className={`flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg border-4 ${results[index]==="Correct"?"border-green-600":"border-red-600"}`} key={index}>
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
                            {results[index] === "Correct" ? (
                                <>
                                    <GradedQuizChoiceButton value="True" color={"True"===answers[index]?"green":"lightgray"} stretch={true}/>
                                    <GradedQuizChoiceButton value="False" color={"False"===answers[index]?"green":"lightgray"} stretch={true}/>
                                </>
                            ) : (answers[index] !== "" ? (
                                <>
                                    <GradedQuizChoiceButton value="True" color={"True"===question.answer?"green":"red"} stretch={true}/>
                                    <GradedQuizChoiceButton value="False" color={"False"===question.answer?"green":"red"} stretch={true}/>
                                </>
                            ) : (
                                <>
                                    <GradedQuizChoiceButton value="True" color={"True"===question.answer?"green":"lightgray"} stretch={true}/>
                                    <GradedQuizChoiceButton value="False" color={"False"===question.answer?"green":"lightgray"} stretch={true}/>
                                </>
                            ))}
                        </div>
                    </div>
                    <p className="text-xl">{results[index] === "Correct" ? "1/1" : "0/1"}</p>
                </div>
            )
        } else if (question instanceof MultipleChoiceQuestion) {
            return (
                <div className={`flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg border-4 ${results[index]==="Correct"?"border-green-600":"border-red-600"}`} key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="grid grid-rows-2 grid-cols-2 my-2 justify-items-stretch">
                            {question.choices.map((choice, index) => {
                                let color = "lightgray";
                                if(choice === answers[index]) color = "red";
                                if(choice === question.answer) color = "green";
                                return <GradedQuizChoiceButton key={index} value={choice} color={color} prefix={String.fromCharCode(65+index)}/>
                            })}
                        </div>
                    </div>
                    <p className="text-xl">{results[index] === "Correct" ? "1/1" : "0/1"}</p>
                </div>
            )
        } else if (question instanceof ShortAnswerQuestion) {
            return (
                <div className={`flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg border-4 ${results[index]==="Correct"?"border-green-600":"border-red-600"}`} key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="flex flex-col my-2 justify-items-stretch">
                            <Input className="shadow-lg" bg="white" borderRadius="md" borderWidth={1.5} variant={"outline"} isDisabled={true}
                            value={answers[index]!==""?answers[index]:"No answer provided"}/>
                            {results[index]==="Incorrect"?<p className="text-red-600 mx-px">The correct answer is {question.answer}</p>:<></>}
                        </div> 
                    </div>
                    <p className="text-xl">{results[index] === "Correct" ? "1/1" : "0/1"}</p>
                </div>
            );   
        } else if (question instanceof FreeResponseQuestion) {
            return(
                <div className={`flex flex-row mt-2 p-5 bg-white rounded-lg mb-10 shadow-lg border-4 ${results[index].charAt(0)==="C"?"border-green-600":"border-red-600"}`} key={index}>
                    <p className="text-xl">{index+1}.</p>
                    <div className="flex flex-col w-full mx-5">
                        <div className="flex flex-row w-full p-2 items-center shadow-2xl rounded-lg min-h-20">
                            <p className="m-auto text-lg font-bold">{question.question}</p>
                        </div>
                        <div className="flex flex-col my-2 justify-items-stretch">
                            <Textarea className="shadow-lg" bg="white" borderRadius="md" borderWidth={1.5} variant={"outline"} isDisabled={true}
                            value={answers[index]!==""?answers[index]:"No answer provided"}/>
                            {results[index].charAt(0)==="I" ? <p className="text-red-600 mx-px">{results[index].substring(3)}</p>:<></>}
                        </div>
                    </div>
                    <p className="text-xl">{results[index].charAt(0)==="C" ? "1/1" : "0/1"}</p>
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col h-5/6 w-2/5 shadow-2xl rounded-lg m-auto p-5 items-center overflow-auto"style={{backgroundColor: AccentColor2}} >
            {results.length >= questionList.length ? <div className="h-full w-full">
                <div className="flex flex-row m-5 items-center">
                    <p className="text-5xl font-bold text-left mr-auto">Great job!</p>
                    <CircularProgress className="mr-8" value={numCorrectQuestions/questionList.length*100} color="green" trackColor="red" size={"100px"}>
                        <CircularProgressLabel>{Math.round(numCorrectQuestions/questionList.length*100)}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className="text-3xl">{numCorrectQuestions}/{questionList.length}</p>
                </div>
                {questionList.map((question, index) => displayGradedQuestion(question, index))}
                <div className="flex flex-row">
                    <Button className="mr-2 mb-5 w-1/2" style={{backgroundColor: AccentColor4, color: "white"}} size="lg" onClick={() => setQuizStatus(QuizStatus.INITIAL)}>Retry</Button>
                    <Link className="mr-2 mb-5 w-1/2" href={{
                        pathname: "/study",
                        query: {
                            setUid: StudySet.fromString(studySetString).uid,
                            setName: StudySet.fromString(studySetString).name,
                        },
                    }}>
                        <Button className="w-full" style={{backgroundColor: AccentColor4, color: "white"}} size="lg">Done</Button>
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