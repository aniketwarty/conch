import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { auth } from '../lib/firebase/auth';

interface StudyModeButtonProps {
    text: string;
    icon: IconType;
    modePath: string;
    setName: string;
}

export const StudyModeButton = ({ text, icon, modePath, setName }: StudyModeButtonProps) => {
    return (
        <Link href={{
            pathname: `/study/${modePath}`,
            query: { setUid: auth.currentUser?.uid, setName: setName}
        }}>  
            <button className="border-2 border-black rounded-lg p-3 m-3 items-center flex flex-row w-full">
                {React.createElement(icon, {className: "p-2 size-14"})}
                <p className="text-3xl">{text}</p>
            </button>
        </Link>
    );
};