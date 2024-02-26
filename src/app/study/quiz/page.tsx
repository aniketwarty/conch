'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchStudySet, getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { StudySet } from "../../lib/classes/study_set";
import { Spinner } from "@chakra-ui/react";
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
            {!studySet ? <Spinner className="p-5 m-auto"/> : 
            <>
                <StudyModeNavBar studyMode="quiz" setUid={searchParams.get("setUid")!} setName={searchParams.get("setName")!} options={options} setOptions={setOptions}/>
                <div className="flex flex-col items-center h-full w-full">
                    <div className="flex flex-col h-5/6 w-1/2 shadow-2xl m-auto p-5">
                        <p className="text-2xl font-bold m-5 self-center">Quiz</p>

                    </div>
                </div>
            </>}
        </div>
    );
}