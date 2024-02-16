import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface StudyModeButtonProps {
    text: string;
    icon: IconType;
    modePath: string;
}

export const StudyModeButton = ({ text, icon, modePath }: StudyModeButtonProps) => {
    return (
        <Link href={`/study/${modePath}`}>
            <button className="border-2 border-black rounded-lg p-3 m-3 items-center flex flex-row w-full">
                {React.createElement(icon, {className: "p-2 size-14"})}
                <p className="text-3xl">{text}</p>
            </button>
        </Link>
    );
};