import Link from "next/link";
import { auth } from "../../lib/firebase/auth";
import { Button, Divider, IconButton } from "@chakra-ui/react";
import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import { OptionsButton } from "./OptionsButton";
import { StudySet } from "../../lib/classes/study_set";

interface StudyModeNavBarProps {
    studyMode: string;
    studySetString: string;
    options: any;
    setOptions: React.Dispatch<React.SetStateAction<any>>;
}

export const StudyModeNavBar = ({ studyMode, studySetString, options, setOptions }: StudyModeNavBarProps) => {
    const studySet = StudySet.fromString(studySetString);

    return (
        <div>
            <div className="h-20 p-5 items-center w-full top-0 flex flex-row">
                <Link href={{
                    pathname: "/study",
                    query: { 
                        setUid: studySet.uid,
                        setName: studySet.name,
                    }
                }}>
                    <IconButton variant="outline" aria-label="back" icon={<IoMdArrowRoundBack/>}
                    className="mr-3 outline-4"/>
                </Link>
                <p>{studyMode}</p>
                <OptionsButton options={options} setOptions={setOptions} studyMode={studyMode}/>
                <Link href="/home">
                    <IconButton variant="outline" aria-label="back" icon={<IoMdClose/>}
                    className="ml-3 outline-4"/>
                </Link>
            </div>
            <Divider />
        </div>
    )
}