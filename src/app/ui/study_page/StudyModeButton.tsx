import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { StudySet } from '../../lib/classes/study_set';

interface StudyModeButtonProps {
    text: string;
    icon: IconType;
    modePath: string;
    studySetString: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StudyModeButton = ({ text, icon, modePath, studySetString, setLoading }: StudyModeButtonProps) => {
    const studySet = StudySet.fromString(studySetString);

    return (
        <Link href={{
            pathname: `/study/${modePath}`,
            query: { setUid: studySet.uid, setName: studySet.name}
        }}
        onClick={() => setLoading(true)}>  
            <button className="border-2 border-black rounded-lg p-3 m-3 items-center flex flex-row w-full">
                {React.createElement(icon, {className: "p-2 size-14"})}
                <p className="text-3xl">{text}</p>
            </button>
        </Link>
    );
};