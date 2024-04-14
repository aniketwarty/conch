'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { getSetString } from "../../lib/util/study";
import { QuizPageDisplay } from "./QuizPageDisplay";
import { StudySet } from "../../lib/classes/study_set";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../lib/firebase/auth";

export default async function QuizPage({searchParams}: {searchParams: any}) {
    const authResponse = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        headers: {
            Cookie: `session=${cookies().get("session")?.value}`,
        },
    })

    const authResponseJson = await authResponse.json();
    if(auth.currentUser===null) await signInWithCustomToken(auth, authResponseJson.token);
    const uid = authResponseJson.uid;
    const initialOptions = await getOptions(uid, "quiz");

    const setResponse = await fetch("http://localhost:3000/api/study_set", {//PROD: change to production URL
        method: "GET",
        headers: {
            uid: uid,
            setUid: searchParams.setUid,
            setName: searchParams.setName,
        }
    })

    if(setResponse.redirected) return redirect("/home");
    const setResponseJson = await setResponse.json();
    const setString = setResponseJson.setString;
    
    return (
        <QuizPageDisplay uid={uid} studySetString={setString} initialOptions={initialOptions}/>
    );
}