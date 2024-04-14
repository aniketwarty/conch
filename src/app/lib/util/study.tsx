import { redirect } from "next/navigation";
import { parseCookies, setCookie } from "nookies";
import { fetchStudySet } from "../firebase/firestore";

export async function getSetString(searchParams: any) {
    let setString = parseCookies().study_set ?? "";
    const setUid = searchParams.setUid as string;
    const setName = searchParams.setName as string;

    if(setString==="" && (!setUid || !setName)) redirect("/home");
    else if (setString==="") {
        setString = await fetchStudySet(setUid, setName) ?? "";
        if(setString!=="") {
            setCookie(null, "study_set", setString); //TODO: fix this (not running) to avoid fetching set every time
        }
        else {
            console.log("no set found")
            redirect("/home");
        }
    }
    return setString;
}