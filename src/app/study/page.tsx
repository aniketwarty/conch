'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchStudySet } from "../lib/firebase/firestore";
import { StudySet } from "../lib/classes/study_set";
import { NavBar } from "../ui/nav_bar/NavBar";
import { StudyModeButton } from "./StudyModeButton";
import { BsCardText } from "react-icons/bs";
import { FaGamepad } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { IoChatboxSharp } from "react-icons/io5";
import { Spinner } from "@chakra-ui/react";
import { auth } from "../lib/firebase/auth";

export default function StudyPage() {
    const [studySet, setStudySet] = useState<StudySet>();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const setUid = searchParams.get("setUid");
        const setName = searchParams.get("setName");
        if(!setUid || !setName) router.push("/home");
        fetchStudySet(setUid!, setName!).then((set) => {
            if(set) { //TODO: add check if user has access to study set/is user logged in
                setStudySet(set);
            } else {
                router.push("/home");
            }
        });
    }, [router, searchParams]);

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen">
            {!studySet ? <Spinner className="p-5 m-auto"/> : <div>
                <NavBar/>
                <p className="text-3xl font-bold mt-5 ml-10">{studySet.name}</p>
                <div className="flex flex-row h-5/6 w-full mb-5">
                    <div className="flex flex-col m-5 w-1/4 justify-between">
                        {/* study modes - add not scrolling*/}
                        <StudyModeButton text="Flashcards" icon={BsCardText} modePath="flashcards" setName={studySet.name}/>
                        <StudyModeButton text="Quiz" icon={MdOutlineQuiz} modePath="quiz" setName={studySet.name}/>
                        <StudyModeButton text="Game 1" icon={FaGamepad} modePath="game1" setName={studySet.name}/>
                        <StudyModeButton text="Game 2" icon={FaGamepad} modePath="game2" setName={studySet.name}/>
                        <StudyModeButton text="Chat" icon={IoChatboxSharp} modePath="chat" setName={studySet.name}/>
                    </div>
                    <div className="ml-5 mb-5 w-px bg-black"/>
                    <div className="flex flex-col h-full w-3/4 px-8 pb-14 overflow-y-auto">
                        {studySet.terms.map((term, index) => {
                            return (
                                <div key={index} className="flex flex-row mt-5 p-5 w-full shadow-2xl rounded-lg">
                                    <p className="text-lg m-3 w-1/2">{term}</p>
                                    <div className="h-full w-px bg-black"/>
                                    <p className="text-lg m-3 w-1/2">{studySet.definitions[index]}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>}
        </div>
        
    );
}