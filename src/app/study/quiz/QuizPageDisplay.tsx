'use client';
import { useEffect, useState } from "react";
import { StudySet } from "../../lib/classes/study_set";
import { QuizGenerator } from "./QuizGenerator";
import { StudyModeNavBar } from "../../ui/study_page/StudyModeNavBar";
import { Button, Checkbox } from "@chakra-ui/react";

interface QuizPageDisplayProps {
    uid: string;
    studySetString: string;
    initialOptions: any;
}

export const QuizPageDisplay = ({uid, studySetString, initialOptions}: QuizPageDisplayProps) => {
    const studySet = StudySet.fromString(studySetString);
    const [options, setOptions] = useState(initialOptions);
    const [quizOptions, setQuizOptions] = useState(initialOptions);
    const [generatedQuiz, setGeneratedQuiz] = useState(false);

    useEffect(() => {
        if(!generatedQuiz) setQuizOptions(options);
    }, [generatedQuiz, options, uid])

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden">
            <StudyModeNavBar uid={uid} studyMode="quiz" studySetString={studySetString} options={options} setOptions={setOptions}/>
            {generatedQuiz ? <QuizGenerator studySetString={studySetString} options={quizOptions}/>:
                <div className="flex flex-col h-5/6 w-1/2 shadow-2xl m-auto p-5 items-center">
                    <p className="text-5xl font-bold m-5 self-center">Quiz</p>  
                    <p className="text-2xl m-5 self-center">
                        {options["Number of Questions"]===-1 ? (studySet.terms.length + " questions"):(options["Number of Questions"] + " questions")} 
                        {" • "}
                        {options["Time Limit"]===-1 ? "No time limit" : `${Math.floor(options["Time Limit"] / 60)}:${(options["Time Limit"] % 60).toString().padStart(2, '0')} time limit`}
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
                            defaultChecked={options["Short Answer Questions"]} checked={options["Short Answer Questions"]} key={options["Multiple Choice Questions"]} className="mr-3" size={"lg"}
                            disabled={options["Short Answer Questions"] === true && options["True/False Questions"] === false && options["Free Response Questions"] === false && options["Multiple Choice Questions"] === false}
                            onChange={(e) => {
                                setOptions({ ...options, ["Short Answer Questions"]: e.target.checked });
                            }}
                        />
                    </div>
                    <div className="flex flex-row my-2">
                        <p className="ml-3 mr-3 text-2xl">Free Response Questions</p>
                        <Checkbox
                            defaultChecked={options["Free Response Questions"]} checked={options["Free Response Questions"]} key={options["Free Response Questions"]} className="mr-3" size={"lg"}
                            disabled={options["Free Response Questions"] === true && options["True/False Questions"] === false && options["Multiple Choice Questions"] === false && options["Short Answer Questions"] === false}
                            onChange={(e) => {
                                setOptions({ ...options, ["Free Response Questions"]: e.target.checked })
                            }}
                        />
                    </div>
                    <Button className="mt-auto mb-10" colorScheme="blue" size="lg" onClick={() => setGeneratedQuiz(true)}>
                        Generate quiz
                    </Button>
                </div>
            }
        </div>
    );
}