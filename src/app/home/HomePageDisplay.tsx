'use client';
import { useState } from "react";
import Link from "next/link";
import { StudySet } from "../lib/classes/study_set";
import { NavBar } from '../ui/nav_bar/NavBar';
import { Spinner } from '@chakra-ui/react';

interface HomePageProps {
    setList: string[] | null;
}

export const HomePageDisplay = ({ setList } : HomePageProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="bg-slate-100 h-screen w-screen flex flex-col">
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            <NavBar/>
            <p className="text-3xl font-bold m-10"> Your sets </p>
            <div className="flex flex-row">
            {(setList ?? []).length===0  ? <Spinner className="ml-12 p-5"/> : (setList?.map((set, index) => (
                <Link
                    key={index}
                    href={{
                        pathname: "/study",
                        query: {
                            setUid: StudySet.fromString(set).uid,
                            setName: StudySet.fromString(set).name,
                        },
                    }}
                    onClick={() => setLoading(true)}
                >
                    <div className="flex flex-col ml-10 p-5 shadow-2xl rounded-sm">
                        <p className="text-2xl font-bold">{StudySet.fromString(set).name}</p>
                        <p className="">{(StudySet.fromString(set).terms?.length ?? 0) + " terms"}</p>
                        <p className="">{"Last studied " + StudySet.fromString(set).getFormattedLastStudied()}</p>
                    </div>
                </Link>
            )))}
        </div>
        </div>
    );
}