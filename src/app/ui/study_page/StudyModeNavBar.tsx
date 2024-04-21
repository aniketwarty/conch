import Link from "next/link";
import { IconButton } from "@chakra-ui/react";
import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import { OptionsButton } from "./OptionsButton";
import { StudySet } from "../../lib/classes/study_set";
import { AccentColor3, AccentColor4 } from "@/app/colors";

interface StudyModeNavBarProps {
    uid: string;
    studyMode: string;
    studySetString: string;
    options: any;
    setOptions: React.Dispatch<React.SetStateAction<any>>;
}

export const StudyModeNavBar = ({ uid, studyMode, studySetString, options, setOptions }: StudyModeNavBarProps) => {
    const studySet = StudySet.fromString(studySetString);

    return (
        <div>
            <div className="h-20 p-5 items-center w-full top-0 flex flex-row shadow-xl" style={{backgroundColor: AccentColor3}}>
                <Link href={{
                    pathname: "/study",
                    query: { 
                        setUid: studySet.uid,
                        setName: studySet.name,
                    }
                }}>
                    <IconButton icon={<IoMdArrowRoundBack/>} className="mr-3 outline-4 shadow-md" style={{backgroundColor: AccentColor4, color: "white"}} aria-label="back"/>
                </Link>
                <p>{studyMode.charAt(0).toUpperCase() + studyMode.slice(1)}</p>
                <OptionsButton uid={uid} options={options} setOptions={setOptions} studyMode={studyMode}/>
                <Link href="/home">
                    <IconButton className="ml-3 outline-4 shadow-md" aria-label="home" icon={<IoMdClose/>}
                    style={{backgroundColor: AccentColor4, color: "white"}}/>
                </Link>
            </div>
            <div className="w-full bg-gray-400 h-px"/>
        </div>
    )
}