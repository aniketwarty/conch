import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase/auth";
import { fetchStudySets } from "../lib/firebase/firestore";
import { StudySet } from "../lib/classes/study_set";
import { Spinner } from "@chakra-ui/react";

interface StudySetListProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const StudySetList = ({ setLoading }: StudySetListProps) => {
    const [setList, setSetList] = useState<StudySet[]>([]);

    async function getStudySets() {
        fetchStudySets().then((sets) => setSetList(sets));
    }

    useEffect(() => {  
        getStudySets();
    }, []);
    
    return (
        <div className="flex flex-row">
            {!setList ? <Spinner className="ml-12 p-5"/> : (setList.map((set, index) => (
                    <Link
                        key={index}
                        href={{
                            pathname: "/study",
                            query: {
                                setUid: auth.currentUser?.uid ?? "unknown",
                                setName: set.name,
                            },
                        }}
                        onClick={() => setLoading(true)}
                    >
                        <div className="flex flex-col ml-10 p-5 shadow-2xl rounded-sm">
                            <p className="text-2xl font-bold">{set.name}</p>
                            <p className="">{(set.terms?.length ?? 0) + " terms"}</p>
                            <p className="">{"Last studied " + set.getFormattedLastStudied()}</p>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}