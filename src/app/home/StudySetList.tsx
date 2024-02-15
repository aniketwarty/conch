import { useEffect, useMemo, useState } from "react";
import fetchStudySets from "../lib/firebase/firebase";
import { StudySet } from "../lib/classes/study_set";

export const StudySetList = () => {
    const [setList, setSetList] = useState<StudySet[]>([]);

    useEffect(() => {
        async function getStudySets() {
            const sets = await fetchStudySets();
            setSetList(sets);
        }
        getStudySets();
    }, []);

    console.log(setList[0]?.last_studied.toString());

    return (
        <div className="flex flex-row m-5">
            {setList.map((set, index) => {
                return <div key={index} className="flex flex-col ml-10 p-5 shadow-2xl rounded-sm"> 
                    <p>{set.name}</p>
                    <p>{set.terms.length + " terms"}</p>
                    <p>{"Last Studied: " + set.getFormattedLastStudied()}</p>
                </div>;
            })}
        </div>
    );
}