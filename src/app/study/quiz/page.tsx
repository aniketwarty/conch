'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchStudySet, getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { StudySet } from "../../lib/classes/study_set";
import { Checkbox, Spinner } from "@chakra-ui/react";
import { StudyModeNavBar } from "../StudyModeNavBar";

export default function QuizPage() {
    const [studySet, setStudySet] = useState<StudySet>();
    const [options, setOptions] = useState<any>({});
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const setUid = searchParams.get("setUid");
        const setName = searchParams.get("setName");
        if(!setUid || !setName) router.push("/home");
        fetchStudySet(setUid!, setName!).then((set) => {
            if(set) { //TODO: add check if user has access to study set/is user logged in
                set.updateLaststudied();
                setStudySet(set);
                updateLastStudied(setUid!, set)
            } else {
                router.push("/home");
            }
        });

        getOptions('quiz').then((options: any) => {
            setOptions(options);
        });
    }, [router, searchParams]);

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden">
            {!studySet ? <Spinner className="p-5 m-auto"/> : <>
                <StudyModeNavBar studyMode="quiz" setUid={searchParams.get("setUid")!} setName={searchParams.get("setName")!} options={options} setOptions={setOptions}/>
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