'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addToRecentSets, fetchStudySet, getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { QuizPageDisplay } from "./QuizPageDisplay";
import { StudySet } from "../../lib/classes/study_set";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../lib/firebase/auth";

export default async function QuizPage({searchParams}: {searchParams: any}) {
    const authResponse = await fetch("https://conch.netlify.app/api/auth", {//PROD: change to production URL
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "Cookie": `session=${cookies().get("session")?.value ?? "unable to get client cookie"}`
        }
    })

    const authResponseJson = await authResponse.json();
    if(auth.currentUser===null) await signInWithCustomToken(auth, authResponseJson.token);
    const uid = authResponseJson.uid;
    const initialOptions = await getOptions(uid, "quiz");

    const setString = await fetchStudySet(searchParams.setUid, searchParams.setName, uid);
    if(setString==="") return redirect("/home");
    await updateLastStudied(StudySet.fromString(setString));
    await addToRecentSets(uid, setString);
    
    return (
        <QuizPageDisplay uid={uid} studySetString={setString} initialOptions={initialOptions}/>
    );
}