'use client';
import { useEffect, useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { StudyModeNavBar } from "../../ui/study_page/StudyModeNavBar";
import { StudySet } from "../../lib/classes/study_set";

interface FlashcardPageDisplayProps {
    uid: string;
    studySetString: string;
    initialOptions: any;
}

export const FlashcardPageDisplay = ({uid, studySetString, initialOptions}: FlashcardPageDisplayProps) => {
    const studySet = StudySet.fromString(studySetString);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [options, setOptions] = useState(initialOptions);
    
    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden">
            <StudyModeNavBar uid={uid} studyMode="flashcards" studySetString={studySetString} options={options} setOptions={setOptions}/>
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
        </div>
    );
}