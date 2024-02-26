'use client';
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchStudySet, getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { StudySet } from "../../lib/classes/study_set";
import { StudyModeNavBar } from "../StudyModeNavBar";
import { Button, IconButton, Spinner } from "@chakra-ui/react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";

export default function FlashcardsPage() {
    const [studySet, setStudySet] = useState<StudySet>();
    const [options, setOptions] = useState<any>({});
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

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

        getOptions('flashcards').then((options: any) => {
            setOptions(options);
        });
    }, [router, searchParams]);

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