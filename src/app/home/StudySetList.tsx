import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase/auth";
import { fetchStudySets } from "../lib/firebase/firestore";
import { StudySet } from "../lib/classes/study_set";

export const StudySetList = () => {
    const [setList, setSetList] = useState<StudySet[]>([]);

    useEffect(() => {
        async function getStudySets() {
            const sets = await fetchStudySets();
            setSetList(sets);
        }
        getStudySets();
    }, [setList, setSetList]);

    //TODO: add loading state

    return (
        <div className="flex flex-row">
            {setList.map((set, index) => {
                return <Link key={index} href={{
                    pathname: "/study",
                    query: { 
                        uid: auth.currentUser!.uid,
                        setName: set.name,
                    }
                }}>
                    <div className="flex flex-col ml-10 p-5 shadow-2xl rounded-sm"> 
                        <p className="text-2xl font-bold">{set.name}</p>
                        <p className="">{set.terms.length + " terms"}</p>
                        <p className="">{"Last studied " + set.getFormattedLastStudied()}</p>
                    </div>;
                </Link>
            })}
        </div>
    );
}