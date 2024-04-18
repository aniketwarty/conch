'use server';
import { addToRecentSets, fetchStudySet, getOptions, updateLastStudied } from "../../lib/firebase/firestore";
import { FlashcardPageDisplay } from "./FlashcardPageDisplay";
import { redirect } from "next/navigation";
import { StudySet } from "../../lib/classes/study_set";
import { cookies } from "next/headers";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../lib/firebase/auth";

export default async function FlashcardsPage({searchParams}: {searchParams: any}) {
    const authResponse = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        headers: {
            Cookie: `session=${cookies().get("session")?.value}`,
        },
    })

    const authResponseJson = await authResponse.json();
    if(auth.currentUser===null) await signInWithCustomToken(auth, authResponseJson.token);
    const uid = authResponseJson.uid;
    const initialOptions = await getOptions(uid, "flashcards");

    const setString = await fetchStudySet(searchParams.setUid, searchParams.setName, uid);
    if(setString==="") return redirect("/home");
    await updateLastStudied(StudySet.fromString(setString));
    await addToRecentSets(uid, setString);

    return (
        <FlashcardPageDisplay uid={uid} studySetString={setString} initialOptions={initialOptions}/>
    );
}