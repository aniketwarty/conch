import { useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";

interface FlashcardDisplayProps {
    terms: string[];
    definitions: string[];
}

export const FlashcardDisplay = ({ terms, definitions }: FlashcardDisplayProps) => {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    
    return (
        <div className="flex flex-col items-center h-full w-full">
            <Button className="shadow-xl rounded-xl m-5 w-1/2" height="50%" onClick={() => {setFlipped(!flipped)}}>
                <p>{flipped ? definitions[index]:terms[index]}</p>
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
                <p>{index+1}/{terms.length}</p>
                <IconButton aria-label="back" variant="outline" icon={<MdArrowForwardIos/>}
                className="ml-auto" 
                onClick={() => {
                    if(index < terms.length-1) setIndex(index + 1); 
                    setFlipped(false)
                }}/>
                <IconButton aria-label="next" variant="outline" icon={<BiArrowToRight/>} 
                className="ml-3" 
                onClick={() => {
                    setIndex(terms.length - 1); 
                    setFlipped(false)
                }}/>
            </div>
        </div>
    )
}
