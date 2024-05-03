"use client"
import { useState } from "react";
import { IconButton, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { NavBar } from "../ui/NavBar";
import { MdEdit } from "react-icons/md";
import { AccentColor2 } from "../colors";
import { getFormattedDate } from "../lib/util";

interface Set {
    setUid: string,
    setName: string,
    email: string,
    numTerms: number,
    shareDate: string,
}
interface SharedSetsPageDisplayProps {
    setsSharedWithYou: Set[],
    setsRecentlySharedByYou: Set[],
}

export const SharedSetsPageDisplay = ({setsSharedWithYou, setsRecentlySharedByYou}: SharedSetsPageDisplayProps) => {
    const [loading, setLoading] = useState(false);
    //TODO: prevent duplicates
    return (//TODO: cut off after 2 lines
        <div className="min-h-screen h-full w-screen flex flex-col">
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto" />
                </div>
            )}
            <NavBar/>
            {setsSharedWithYou.length > 0 ? <>
                <p className="text-3xl font-bold m-10">Shared with you</p>
                <div className="flex flex-row mb-5">
                    {setsSharedWithYou??[].length > 0 ? (
                        setsSharedWithYou!.map((set, index) => (
                            <Link key={index} href={{
                                pathname: "/study",
                                query: {
                                    setUid: set.setUid,
                                    setName: set.setName,
                                },
                            }}
                            onClick={() => {
                                setLoading(true);
                            }}>
                                <div className="flex flex-col ml-10 px-5 py-2 h-32 shadow-2xl rounded-md" style={{backgroundColor: AccentColor2}}>
                                    <div className="flex flex-row">
                                        <p className="text-2xl font-bold mt-3">{set.setName}</p>
                                        <IconButton className="ml-auto -mr-3" aria-label="edit" variant="ghost" icon={<MdEdit/>} isRound onClick={(event) => {
                                            event.preventDefault();
                                            window.location.href = "/edit?setUid=" + set.setUid + "&setName=" + set.setName;
                                        }}/>
                                    </div>
                                    <p className="">{set.numTerms} terms</p>
                                    <p className="">{"Shared by: " + set.email}</p>
                                </div>
                            </Link>
                        ))
                    ):<></>}
                </div>
            </>:<></>}
            {setsRecentlySharedByYou.length > 0 ? <>
                <p className="text-3xl font-bold m-10">Recently shared by you</p>
                <div className="flex flex-row mb-5">
                    {setsRecentlySharedByYou??[].length > 0 ? (
                        setsRecentlySharedByYou!.map((set, index) => (
                            <Link key={index} href={{
                                pathname: "/study",
                                query: {
                                    setUid: set.setUid,
                                    setName: set.setName,
                                },
                            }}
                            onClick={() => {
                                setLoading(true);
                            }}>
                                <div className="flex flex-col ml-10 px-5 py-2 h-32 shadow-2xl rounded-md" style={{backgroundColor: AccentColor2}}>
                                    <div className="flex flex-row">
                                        <p className="text-2xl font-bold mt-3">{set.setName}</p>
                                        <IconButton className="ml-auto -mr-3" aria-label="edit" variant="ghost" icon={<MdEdit/>} isRound onClick={(event) => {
                                            event.preventDefault();
                                            window.location.href = "/edit?setUid=" + set.setUid + "&setName=" + set.setName;
                                        }}/>
                                    </div>
                                    <p className="">{set.numTerms} terms</p>
                                    <p className="">{"Shared: " + getFormattedDate(new Date(set.shareDate))}</p>
                                </div>
                            </Link>
                        ))
                    ):<></>}
                </div>
            </>:<></>}
        </div>
    )
}