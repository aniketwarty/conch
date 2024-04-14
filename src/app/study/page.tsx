'use server'
import { StudyPageDisplay } from "./StudyPageDisplay";
import { StudySet } from "../lib/classes/study_set";
import { updateLastStudied } from "../lib/firebase/firestore";
import { cookies } from "next/headers";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../lib/firebase/auth";
import { redirect } from "next/navigation";

export default async function StudyPage({searchParams}: {searchParams: any}) {
    const authResponse = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        headers: {
            Cookie: `session=${cookies().get("session")?.value}`,
        },
    })


    const authResponseJson = await authResponse.json();
    await signInWithCustomToken(auth, authResponseJson.token);
    const uid = authResponseJson.uid;

    const setResponse = await fetch("http://localhost:3000/api/study_set", {//PROD: change to production URL
        method: "GET",
        headers: {
            uid: uid,
            setUid: searchParams.setUid,
            setName: searchParams.setName,
        },
    })

    if(setResponse.redirected) {
        return redirect("/home");
    }
    const setResponseJson = !setResponse.redirected?await setResponse.json():{setString: ""};
    const setString = setResponseJson.setString;

    return (
        <StudyPageDisplay studySetString={setString}/>
    )
}