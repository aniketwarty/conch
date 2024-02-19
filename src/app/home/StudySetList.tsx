import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase/auth";
import { fetchStudySets } from "../lib/firebase/firestore";
import { StudySet } from "../lib/classes/study_set";
import { Spinner } from "@chakra-ui/react";

export const StudySetList = () => {
    const [setList, setSetList] = useState<StudySet[]>([]);

    useEffect(() => {
        async function getStudySets() {
            const sets = fetchStudySets().then((sets) => setSetList(sets));
        }
        getStudySets();
    });

    return (
        <div className="flex flex-row">
            {setList.length==0 ? <Spinner className="ml-12 p-5"/> : setList.map((set, index) => (
                <Link key={index} href={{
                    pathname: "/study",
                    query: { 
                        setUid: auth.currentUser?.uid ?? "unknown",
                        setName: set.name,
                    }
                }}>
                    <div className="flex flex-col ml-10 p-5 shadow-2xl rounded-sm"> 
                        <p className="text-2xl font-bold">{set.name}</p>
                        <p className="">{set.terms.length + " terms"}</p>
                        <p className="">{"Last studied " + set.getFormattedLastStudied()}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}