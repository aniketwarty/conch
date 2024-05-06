'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { StudySet } from "../lib/classes/study_set";
import { NavBar } from '../ui/NavBar';
import { IconButton, Spinner, Tooltip } from '@chakra-ui/react';
import { AccentColor2, BackgroundColor, BackgroundColorGradient } from "../colors";
import { MdEdit } from "react-icons/md";
import { getFormattedDate } from "../lib/util";

interface RecentSet {
    setUid: string;
    setName: string;
    numTerms: number;
    lastViewed: string;
}
interface HomePageProps {
    setList: string[];
    recentSetList: RecentSet[];
}
//TODO: handle overflow for your sets and recent sets
//TODO: add alert for trying to open nonexistent/deleted sets
export const HomePageDisplay = ({ setList, recentSetList }: HomePageProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen h-full w-screen flex flex-col" style={{background: BackgroundColorGradient}}>
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto" />
                </div>
            )}
            <NavBar/>
            <p className="text-3xl font-bold m-10">Your sets</p>
            <div className="flex flex-row mb-5 w-full">
                {setList.length > 0 ? (
                    setList!.map((set, index) => (
                        <Link key={index} href={{
                            pathname: "/study",
                            query: {
                                setUid: StudySet.fromString(set).uid,
                                setName: StudySet.fromString(set).name,
                            },
                        }}
                        onClick={() => {
                            setLoading(true);
                        }}>
                            <div className="flex flex-col ml-10 px-5 py-2 h-32 shadow-2xl rounded-md" style={{backgroundColor: AccentColor2}}>
                                <div className="flex flex-row">
                                    <p className="text-2xl font-bold mt-3">{StudySet.fromString(set).name}</p>
                                    <IconButton className="ml-auto -mr-3" aria-label="edit" variant="ghost" icon={<MdEdit/>} isRound onClick={(event) => {
                                        event.preventDefault();
                                        window.location.href = "/edit?setUid=" + StudySet.fromString(set).uid + "&setName=" + StudySet.fromString(set).name;
                                    }}/>
                                </div>
                                <p className="">{(StudySet.fromString(set).terms?.length ?? 0) + " terms"}</p>
                                <p className="">{"Last studied " + getFormattedDate(StudySet.fromString(set).last_studied)}</p>
                            </div>
                        </Link>
                    ))
                ):<></>}
                <Tooltip hasArrow isOpen={(setList??[]).length === 0} isDisabled={(setList??[]).length > 0} placement="right" label={<>
                    <p>It looks like you don&apos;t have any sets.</p>
                    <p>Click here to create one!</p>
                </>    
                }>
                    <Link href="/create">
                        <div className="flex h-32 w-52 ml-10 p-5 rounded-md bg-gray-300 shadow-2xl">
                            <p className="text-5xl font-bold m-auto" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>+</p>
                        </div>
                    </Link>
                </Tooltip>
            </div>
            {recentSetList.length > 0 ? (
                <>
                    <p className="text-3xl font-bold m-10">Recently viewed sets</p>
                    <div className="flex flex-row mb-5">
                        {recentSetList!.map((set, index) => (
                            <Link
                                key={index}
                                href={{
                                    pathname: "/study",
                                    query: {
                                        setUid: set.setUid,
                                        setName: set.setName,
                                    },
                                }}
                                onClick={() => {
                                    setLoading(true);
                                }}
                            >
                                <div className="flex flex-col ml-10 p-5 h-32 shadow-2xl rounded-md" style={{backgroundColor: AccentColor2}}>
                                    <p className="text-2xl font-bold">{set.setName}</p>
                                    <p className="">{set.numTerms + " terms"}</p>
                                    <p className="">{"Last viewed " + getFormattedDate(new Date(set.lastViewed))}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}