'use client';
import { useEffect, useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { StudyModeNavBar } from "../../ui/study_page/StudyModeNavBar";
import { StudySet } from "../../lib/classes/study_set";
import { AccentColor2, BackgroundColorGradient } from "@/app/colors";
import { motion } from "framer-motion";

interface FlashcardPageDisplayProps {
    uid: string;
    studySetString: string;
    initialOptions: any;
}

export const FlashcardPageDisplay = ({uid, studySetString, initialOptions}: FlashcardPageDisplayProps) => {
    const studySet = StudySet.fromString(studySetString);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [options, setOptions] = useState(initialOptions);

    function handleFlip() {
        if(!isAnimating) {
            setFlipped(!flipped);
            setIsAnimating(true);
        }
    }
    
    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden" style={{background: BackgroundColorGradient}}>
            <StudyModeNavBar uid={uid} studyMode="flashcards" studySetString={studySetString} options={options} setOptions={setOptions}/>
            <div className="flex flex-col items-center h-full w-full">
                <div className="flex mt-20 mb-5 h-1/2 w-1/2" style={{perspective: "1000px"}} onClick={handleFlip}>
                    <motion.div
                        className="h-full w-full rounded-xl shadow-xl flex"
                        style={{backgroundColor: AccentColor2, transformStyle: "preserve-3d"}}
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut"}}
                        onAnimationComplete={() => setIsAnimating(false)}
                    >
                        <div className="m-auto absolute w-full h-full flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                            <p className="text-lg text-center" >
                                {studySet.terms[index]}
                            </p>
                        </div>
                        <div className="m-auto absolute w-full h-full flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: "rotateY(180deg)" }}>
                            <p className="text-lg text-center">
                                {studySet.definitions[index]}
                            </p>
                        </div>
                    </motion.div>
                </div>
                
                <div className="flex flex-row shadow-xl rounded-lg p-4 w-1/2 items-center" style={{backgroundColor: AccentColor2}}>
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