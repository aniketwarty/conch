import { getSetString } from "../lib/util/study";
import { StudyPageDisplay } from "./StudyPageDisplay";
import { StudySet } from "../lib/classes/study_set";
import { updateLastStudied } from "../lib/firebase/firestore";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../lib/firebase/auth";

export default async function StudyPage({searchParams}: {searchParams: any}) {
    const setString = await getSetString(searchParams);
    const set = StudySet.fromString(setString);
    await updateLastStudied(set);

    const response = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        headers: {
            Cookie: `session=${cookies().get("session")?.value}`,
        },
    })

    if (response.status !== 200) {
        console.log("Error getting uid")
        redirect("/login");
    }

    const responseJson = await response.json();
    if(auth.currentUser===null) await signInWithCustomToken(auth, responseJson.token);
    const uid = responseJson.uid;

    return (
        <StudyPageDisplay studySetString={setString}/>
    )
}