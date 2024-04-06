'use server';
import { getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { FlashcardPageDisplay } from "./FlashcardPageDisplay";
import { redirect } from "next/navigation";
import { getSetString } from "../../lib/util/study";
import { StudySet } from "../../lib/classes/study_set";
import { cookies } from "next/headers";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../lib/firebase/auth";

export default async function FlashcardsPage({searchParams}: {searchParams: any}) {
    const setString = await getSetString(searchParams);
    const set = StudySet.fromString(setString);
    await updateLastStudied(set);

    const response = await fetch("http://localhost:3000/api/login", {//TODO: change to production URL
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
    const initialOptions = await getOptions(uid, "flashcards");

    return (
        <FlashcardPageDisplay uid={uid} studySetString={setString} initialOptions={initialOptions}/>
    );
}