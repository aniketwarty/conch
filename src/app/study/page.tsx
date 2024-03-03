'use client';
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import firebase from "firebase/auth";
import { getAuthProps } from "../lib/firebase/auth";
import { fetchStudySet } from "../lib/firebase/firestore";
import { StudySet } from "../lib/classes/study_set";
import { AuthLoading, useAuth } from "../lib/firebase/auth_provider";
import { NavBar } from "../ui/nav_bar/NavBar";
import { StudyModeButton } from "./StudyModeButton";
import { Spinner } from "@chakra-ui/react";
import { BsCardText } from "react-icons/bs";
import { FaGamepad } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { IoChatboxSharp } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";

export default function StudyPage({ user, studySet }:{ user: firebase.User, studySet: StudySet }) {
    const { authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();


    useEffect(() => {
        if(!user) router.push("/log_in")
    }, [router, user])
    if(authLoading) return <AuthLoading/>;

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen">
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            {!studySet ? <Spinner className="p-5 m-auto"/> : <div>
                <NavBar/>
                <div className="flex flex-row mt-5 mx-10">
                    <p className="text-3xl font-bold">{studySet.name}</p> 
                    <button className="ml-auto  px-4 py-2 flex items-center bg-blue-500 text-white rounded-md">
                        Share
                        <RiShareForwardLine className="ml-2" />
                    </button>
                </div>
                
                <div className="flex flex-row h-5/6 w-full mb-5">
                    <div className="flex flex-col m-5 w-1/4 justify-between">
                        <StudyModeButton text="Flashcards" icon={BsCardText} modePath="flashcards" setUid={searchParams.get("setUid") ?? "unknown"} setName={studySet.name} setLoading={setLoading}/>
                        <StudyModeButton text="Quiz" icon={MdOutlineQuiz} modePath="quiz" setUid={searchParams.get("setUid") ?? "unknown"} setName={studySet.name} setLoading={setLoading}/>
                        <StudyModeButton text="Game 1" icon={FaGamepad} modePath="game1" setUid={searchParams.get("setUid") ?? "unknown"} setName={studySet.name} setLoading={setLoading}/>
                        <StudyModeButton text="Game 2" icon={FaGamepad} modePath="game2" setUid={searchParams.get("setUid") ?? "unknown"} setName={studySet.name} setLoading={setLoading}/>
                        <StudyModeButton text="Chat" icon={IoChatboxSharp} modePath="chat" setUid={searchParams.get("setUid") ?? "unknown"} setName={studySet.name} setLoading={setLoading}/>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const set = await fetchStudySet(context.query.setUid as string, context.query.setName as string);
    //TODO: verify user has access to study set
    return {
        ...await getAuthProps(context),
        ...{
            props: {
                studySet: set,
            }
        }
    };
}