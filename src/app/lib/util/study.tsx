import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { fetchStudySet } from "../firebase/firestore";

export async function getSetString(searchParams: any) {
    const cookieStore = cookies()
    let setString = cookieStore.get("study_set")?.value ?? null;
    const setUid = searchParams.get("setUid") as string;
    const setName = searchParams.get("setName") as string;

    if(!setString && (!setUid || !setName)) redirect("/home");
    else if (!setString) {
        setString = await fetchStudySet(setUid, setName);
        if(setString) cookieStore.set("study_set", setString);
        else redirect("/home");
    }
    return setString;
}