'use client';
import { useState } from "react";
import { StudySet } from "../../lib/classes/study_set";
import { StudyModeNavBar } from "../../ui/study_page/StudyModeNavBar";
import { Spinner, Checkbox } from "@chakra-ui/react";

interface QuizPageDisplayProps {
    studySetString: string;
    initialOptions: any;
}

export const QuizPageDisplay = ({studySetString, initialOptions}: QuizPageDisplayProps) => {
    const studySet = StudySet.fromString(studySetString);
    const [options, setOptions] = useState(initialOptions);

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden">
            {!studySet ? <Spinner className="p-5 m-auto"/> : <>
                <StudyModeNavBar studyMode="quiz" studySetString={studySetString} options={options} setOptions={setOptions}/>
                <div className="flex flex-col h-5/6 w-1/2 shadow-2xl m-auto p-5 items-center">
                    <p className="text-5xl font-bold m-5 self-center">Quiz</p>
                    {!options ? <Spinner className="p-5 m-auto"/> : <>
                        <p className="text-2xl m-5 self-center">
                            {options.num_questions===-1 ? (studySet.terms.length + " questions"):(Math.max(studySet.terms.length, options.num_questions) + " questions")} 
                            {" • "}
                            {options.time_limit===-1 ? "No time limit" : `${Math.floor(options.time_limit / 60)}:${(options.time_limit % 60).toString().padStart(2, '0')} time limit`}
                        </p>
                        <div className="flex flex-row my-2">
                            <p className="ml-3 mr-3 text-2xl">True/False</p>
                            <Checkbox
                                defaultChecked={options.true_false} className="mr-3" size={"lg"}
                                onChange={(e) => setOptions({ ...options, ["true_false"]: e.target.checked })}
                            />
                        </div>
                        <div className="flex flex-row my-2">
                            <p className="ml-3 mr-3 text-2xl">Multiple Choice</p>
                            <Checkbox
                                defaultChecked={options.mcq} className="mr-3" size={"lg"}
                                onChange={(e) => setOptions({ ...options, ["mcq"]: e.target.checked })}
                            />
                        </div>
                        <div className="flex flex-row my-2">
                            <p className="ml-3 mr-3 text-2xl">Free Response</p>
                            <Checkbox
                                defaultChecked={options.frq} className="mr-3" size={"lg"}
                                onChange={(e) => setOptions({ ...options, ["frq"]: e.target.checked })}
                            />
                        </div>
                    </>}
                </div>
            </>}
        </div>
    );
}