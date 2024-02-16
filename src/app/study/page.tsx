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

export default function StudyPage() {
    const [studySet, setStudySet] = useState<StudySet>();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const uid = searchParams.get("uid");
        const setName = searchParams.get("setName");
        if(!uid || !setName) router.push("/home");
        fetchStudySet(uid!, setName!).then((set) => {
            if(set) {
                setStudySet(set);
            } else {
                router.push("/home");
            }
        });
    }, [studySet, setStudySet, searchParams, router]);

    return (
        <div className="flex flex-col bg-slate-100 h-lvh w-screen">
            <NavBar/>
            <p className="text-3xl font-bold mt-5 ml-10">{studySet?.name}</p>
            <div className="flex flex-row h-full w-screen mb-5">
                <div className="flex flex-col m-5 justify-between w-1/4">
                    {/* study modes - add not scrolling*/}
                    <StudyModeButton text="Flashcards" icon={BsCardText} modePath="flashcards"/>
                    <StudyModeButton text="Quiz" icon={MdOutlineQuiz} modePath="quiz"/>
                    <StudyModeButton text="Game 1" icon={FaGamepad} modePath="game1"/>
                    <StudyModeButton text="Game 2" icon={FaGamepad} modePath="game2"/>
                    <StudyModeButton text="Chat" icon={IoChatboxSharp} modePath="chat"/>
                </div>
                <div className="mx-5 h-full w-px bg-black"/>
                <div className="flex flex-col ml-3 mr-5 w-2/3">
                    {/* terms - add scrolling*/}
                    {studySet?.terms.map((term, index) => {
                        return (
                            <div key={index} className="flex flex-row mt-5 p-5 w-full shadow-2xl rounded-lg">
                                <p className="text-lg m-3 w-1/2">{term}</p>
                                <div className="h-full w-px bg-black"/>
                                <p className="text-lg m-3 w-1/2">{studySet!.definitions[index]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}