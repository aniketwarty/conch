'use client';
import { useEffect, useState } from "react";
import { QuizGenerator } from "./QuizGenerator";
import { QuizGrader } from "./QuizGrader";
import { StudyModeNavBar } from "../../ui/study_page/StudyModeNavBar";
import { Button, Checkbox, Icon, Tooltip } from "@chakra-ui/react";
import { Question } from "../../lib/classes/question";
import { saveOptions } from "@/app/lib/firebase/firestore";
import { AccentColor2, AccentColor4, BackgroundColor } from "@/app/colors";

export const questionTypes = ["True/False Questions", "Multiple Choice Questions", "Short Answer Questions", "Free Response Questions"];

export enum QuizStatus {
    INITIAL,
    STARTED,
    SUBMITTED
}
interface QuizPageDisplayProps {
    uid: string;
    studySetString: string;
    initialOptions: any;
}

export const QuizPageDisplay = ({uid, studySetString, initialOptions}: QuizPageDisplayProps) => {
    const [quizStatus, setQuizStatus] = useState(QuizStatus.INITIAL);
    const [options, setOptions] = useState(initialOptions);
    const [quizOptions, setQuizOptions] = useState(initialOptions);
    const [questionList, setQuestionList] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<string[]>(Array(options["Number of Questions"]).fill(""));
//TODO: fix cancelling options button resetting options
    useEffect(() => {
        if(quizStatus == QuizStatus.INITIAL) {
            saveOptions(uid, options, "quiz");
            setQuizOptions(options);
            setQuestionList([]);
            setAnswers(Array(options["Number of Questions"]).fill(""));
        }
    }, [options, quizStatus])

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden" style={{backgroundColor: BackgroundColor}}>
            <StudyModeNavBar uid={uid} studyMode="quiz" studySetString={studySetString} options={options} setOptions={setOptions}/>
            {quizStatus === QuizStatus.INITIAL && (
                <div className="flex flex-col h-5/6 w-2/5 shadow-2xl rounded-lg m-auto p-5 items-center" style={{backgroundColor: AccentColor2}}>
                    <p className="text-5xl font-bold m-5 self-center">Quiz</p>  
                    <p className="text-2xl m-5 self-center">
                        {options["Number of Questions"] + " questions"} 
                        {" • "}
                        {options["Time Limit (seconds)"]===-1 ? "No time limit" : `${Math.floor(options["Time Limit (seconds)"] / 60)}:${(options["Time Limit (seconds)"] % 60).toString().padStart(2, '0')} time limit`}
                    </p>
                    <div className="flex flex-row my-2">
                        <p className="ml-3 mr-3 text-2xl">True/False Questions</p>
                        <Checkbox
                            defaultChecked={options["True/False Questions"]} checked={options["True/False Questions"]} key={options["True/False Questions"]} className="mr-3" size={"lg"}
                            disabled={options["True/False Questions"] === true && options["Multiple Choice Questions"] === false && options["Free Response Questions"] === false && options["Short Answer Questions"] === false}
                            onChange={(e) => {
                                setOptions({ ...options, ["True/False Questions"]: e.target.checked });
                            }}
                        />
                    </div>
                    <div className="flex flex-row my-2">
                        <p className="ml-3 mr-3 text-2xl">Multiple Choice Questions</p>
                        <Checkbox
                            defaultChecked={options["Multiple Choice Questions"]} checked={options["Multiple Choice Questions"]} key={options["Multiple Choice Questions"]} className="mr-3" size={"lg"}
                            disabled={options["Multiple Choice Questions"] === true && options["True/False Questions"] === false && options["Free Response Questions"] === false && options["Short Answer Questions"] === false}
                            onChange={(e) => {
                                setOptions({ ...options, ["Multiple Choice Questions"]: e.target.checked });
                            }}
                        />
                    </div>
                    <div className="flex flex-row my-2">
                        <p className="ml-3 mr-3 text-2xl">Short Answer Questions</p>
                        <Checkbox
                            defaultChecked={options["Short Answer Questions"]} checked={options["Short Answer Questions"]} key={options["Short Answer Questions"]} className="mr-3" size={"lg"}
                            disabled={options["Short Answer Questions"] === true && options["True/False Questions"] === false && options["Free Response Questions"] === false && options["Multiple Choice Questions"] === false}
                            onChange={(e) => {
                                setOptions({ ...options, ["Short Answer Questions"]: e.target.checked });
                            }}
                        />
                    </div>
                    <div className="flex flex-row my-2">
                        {/* TODO: add ai logo/mention AI somewhere */}
                        <p className="ml-3 text-2xl">Free Response Questions</p>
                        <Tooltip label={
                            <>
                                Free response questions are generated and graded by AI using the entire study set.
                                <br/>
                                Note: Generating many free response questions may increase loading time.
                            </>
                        } aria-label="info-icon">
                            <span className="mr-3">
                                <Icon boxSize={3} color="gray.500" _hover={{ color: "gray.700" }} />
                            </span>
                        </Tooltip>
                        <Checkbox
                            defaultChecked={options["Free Response Questions"]} checked={options["Free Response Questions"]} key={options["Free Response Questions"]} className="mr-3" size={"lg"}
                            disabled={options["Free Response Questions"] === true && options["True/False Questions"] === false && options["Multiple Choice Questions"] === false && options["Short Answer Questions"] === false}
                            onChange={(e) => {
                                setOptions({ ...options, ["Free Response Questions"]: e.target.checked })
                            }}
                        />
                    </div>
                    <Button className="mt-auto mb-10" style={{backgroundColor: AccentColor4, color: "white"}} size="lg" onClick={() => {setQuizStatus(QuizStatus.STARTED)}}>
                        Generate quiz
                    </Button>
                </div>
            )}
            {quizStatus === QuizStatus.STARTED && (
                <QuizGenerator studySetString={studySetString} questionList={questionList}  setQuestionList={setQuestionList} 
                answers={answers} setAnswers={setAnswers} options={quizOptions} setQuizStatus={setQuizStatus}/>
            )}
            {quizStatus === QuizStatus.SUBMITTED && (
                <QuizGrader studySetString={studySetString} questionList={questionList} answers={answers} setQuizStatus={setQuizStatus}/>
            )}
        </div>
    );
}