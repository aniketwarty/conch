'use client';
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "../../lib/firebase/auth";
import { fetchStudySet } from "../../lib/firebase/firestore";
import { StudySet } from "../../lib/classes/study_set";
import { StudyModeNavBar } from "../StudyModeNavBar";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { Spinner } from "@chakra-ui/react";

export default function FlashcardsPage() {
    const [studySet, setStudySet] = useState<StudySet>();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const setUid = searchParams.get("setUid");
        const setName = searchParams.get("setName");
        if(!setUid || !setName) router.push("/home");
        fetchStudySet(setUid!, setName!).then((set) => {
            if(set && auth.currentUser) {
                setStudySet(set);
            } else {
                router.push("/home");
            }
        });
    });

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen">
            {!studySet ? <Spinner className="p-5 m-auto"/> : 
            <div className="h-full w-full">
                <StudyModeNavBar studyMode="flashcards" setUid={searchParams.get("setUid")!} setName={searchParams.get("setName")!}/>
                <FlashcardDisplay terms={studySet.terms} definitions={studySet.definitions}/>
            </div>
            }
        </div>
    );
}