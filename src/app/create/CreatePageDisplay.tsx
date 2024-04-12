'use client'
import { Button } from "@chakra-ui/react";
import { createStudySet } from "../lib/firebase/firestore";
import { StudySet } from "../lib/classes/study_set";

interface CreatePageDisplayProps {
    uid: string;
}

export const CreatePageDisplay = ({uid}: CreatePageDisplayProps) => {
    
    return (
        <div className="bg-slate-100 h-screen w-screen">
            <Button onClick={() => createStudySet(new StudySet("test", ["term1"], ["definition1"], new Date(), uid))}>Create</Button>
        </div>
    );
}