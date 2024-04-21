'use server'
import { StudyPageDisplay } from "./StudyPageDisplay";
import { StudySet } from "../lib/classes/study_set";
import { addToRecentSets, fetchSharedEmails, fetchStudySet, updateLastStudied } from "../lib/firebase/firestore";
import { cookies } from "next/headers";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../lib/firebase/auth";
import { redirect } from "next/navigation";

export default async function StudyPage({searchParams}: {searchParams: any}) {
    const authResponse = await fetch("https://conch.netlify.app/api/auth", {//PROD: change to production URL
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "Cookie": `session=${cookies().get("session")?.value ?? "unable to get client cookie"}`
        }
    });

    const authResponseJson = await authResponse.json();
    await signInWithCustomToken(auth, authResponseJson.token);
    const uid = authResponseJson.uid;

    //TODO: add set cookies
    const setString = await fetchStudySet(searchParams.setUid, searchParams.setName, uid);
    if(setString==="") return redirect("/home");
    await updateLastStudied(StudySet.fromString(setString));
    await addToRecentSets(uid, setString);
    console.log(auth.currentUser?.uid)
    const sharedEmails = await fetchSharedEmails(searchParams.setUid, searchParams.setName);

    return (
        <StudyPageDisplay studySetString={setString}/>
    )
}