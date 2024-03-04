'use server';
import { redirect, useSearchParams } from "next/navigation";
import { cookies } from "next/headers";
import { fetchStudySet, getOptions } from "../../lib/firebase/firestore";
import { FlashcardPageDisplay } from "./FlashcardPageDisplay";

export default async function FlashcardsPage() {
    const cookieStore = cookies()
    const token = cookieStore.get('user_token')?.value
    if(!token) redirect("/log_in");

    let setString = cookieStore.get("study_set")?.value ?? null;
    const searchParams = useSearchParams();
    const setUid = searchParams.get("setUid") as string;
    const setName = searchParams.get("setName") as string;

    if(!setString && (!setUid || !setName)) redirect("/home");
    else if (!setString) {
        setString = await fetchStudySet(setUid, setName);
        if(setString) cookieStore.set("study_set", setString);
        else redirect("/home");
    }

    const user = JSON.parse((cookieStore.get("user")?.value) ?? "{}" as string);
    const initialOptions = await getOptions(user!.uid, "flashcards");
    //TODO: store options in cookie
    return (
        <FlashcardPageDisplay studySetString={setString} initialOptions={initialOptions}/>
    );
}