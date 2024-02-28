import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { useAuth } from '../lib/firebase/auth_provider';

interface StudyModeButtonProps {
    text: string;
    icon: IconType;
    modePath: string;
    setUid: string;
    setName: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StudyModeButton = ({ text, icon, modePath, setUid, setName, setLoading }: StudyModeButtonProps) => {
    const user = useAuth();

    return (
        <Link href={{
            pathname: `/study/${modePath}`,
            query: { setUid: setUid, setName: setName}
        }}
        onClick={() => setLoading(true)}>  
            <button className="border-2 border-black rounded-lg p-3 m-3 items-center flex flex-row w-full">
                {React.createElement(icon, {className: "p-2 size-14"})}
                <p className="text-3xl">{text}</p>
            </button>
        </Link>
    );
};