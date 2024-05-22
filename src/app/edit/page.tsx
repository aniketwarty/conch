import { signInWithCustomToken } from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StudySet } from "../lib/classes/study_set";
import { fetchStudySet, updateLastStudied, addToRecentSets } from "../lib/firebase/firestore";
import { auth } from "../lib/firebase/auth";
import { EditPageDisplay } from "./EditPageDisplay";

export default async function Edit({searchParams}: {searchParams: any}) {
    const authResponse = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/auth", {//PROD: change to production URL
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "Cookie": `session=${cookies().get("session")?.value ?? "unable to get client cookie"}`
        }
    })

    if(!authResponse.ok) redirect("/login")
    const authResponseJson = await authResponse.json();
    await signInWithCustomToken(auth, authResponseJson.token);
    const uid = authResponseJson.uid;

    //TODO: add set cookies
    const setString = await fetchStudySet(searchParams.setUid, searchParams.setName, uid);
    if(setString==="") return redirect("/home");
    await updateLastStudied(StudySet.fromString(setString));
    await addToRecentSets(uid, StudySet.fromString(setString));

    return (
        <EditPageDisplay initialStudySetString={setString} uid={uid}/>
    );
}