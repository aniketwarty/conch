'use client';
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useSearchParams, useRouter } from "next/navigation";
import firebase from "firebase/auth";
import { getAuthProps } from "../../lib/firebase/auth";
import { AuthLoading, useAuth } from "../../lib/firebase/auth_provider";
import { fetchStudySet, getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { StudySet } from "../../lib/classes/study_set";
import { StudyModeNavBar } from "../StudyModeNavBar";
import { Button, IconButton, Spinner } from "@chakra-ui/react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";

export default function FlashcardsPage({ user, studySet, initialOptions }:{ user: firebase.User, studySet: StudySet, initialOptions: any }) {
    const { authLoading } = useAuth();
    const [options, setOptions] = useState(initialOptions);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if(!user) router.push("/log_in")
    }, [router, user])
    if(authLoading) return <AuthLoading/>;

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden">
            {!studySet ? <Spinner className="p-5 m-auto"/> : 
            <>
                <StudyModeNavBar studyMode="flashcards" setUid={searchParams.get("setUid")!} setName={searchParams.get("setName")!} options={options} setOptions={setOptions}/>
                <div className="flex flex-col items-center h-full w-full">
                    <Button className="shadow-xl rounded-xl m-5 w-1/2" height="50%" onClick={() => {setFlipped(!flipped)}}>
                        <p>{flipped ? studySet.definitions[index]:studySet.terms[index]}</p>
                    </Button>
                    <div className="flex flex-row shadow-xl rounded-lg p-4 w-1/2 items-center">
                        <IconButton aria-label="back" variant="outline" icon={<BiArrowToLeft/>}
                        className="mr-3"
                        onClick={() => {
                            setIndex(0); 
                            setFlipped(false)
                        }}/>
                        <IconButton aria-label="back" variant="outline" icon={<MdArrowBackIos/>}
                        className="mr-auto" 
                        onClick={() => {
                            if(index > 0) setIndex(index - 1); 
                            setFlipped(false)
                        }}/>
                        <p>{index+1}/{studySet.terms.length}</p>
                        <IconButton aria-label="back" variant="outline" icon={<MdArrowForwardIos/>}
                        className="ml-auto" 
                        onClick={() => {
                            if(index < studySet.terms.length-1) setIndex(index + 1); 
                            setFlipped(false)
                        }}/>
                        <IconButton aria-label="next" variant="outline" icon={<BiArrowToRight/>} 
                        className="ml-3" 
                        onClick={() => {
                            setIndex(studySet.terms.length - 1); 
                            setFlipped(false)
                        }}/>
                    </div>
                </div>
            </>}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const set = await fetchStudySet(context.query.setUid as string, context.query.setName as string);
    const options = await getOptions('flashcards');
    //TODO: verify user has access to study set
    return {
        ...await getAuthProps(context),
        ...{
            props: {
                studySet: set,
                initialOptions: options
            }
        }
    };
}