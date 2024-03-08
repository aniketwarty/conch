'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOptions } from "../../lib/firebase/firestore";
import { FlashcardPageDisplay } from "./FlashcardPageDisplay";
import { getSetString } from "@/app/lib/util/study";

export default async function FlashcardsPage({searchParams}: {searchParams: any}) {
    const setString = await getSetString(searchParams);

    const uid = cookies().get("uid")?.value;
    if(!uid) redirect("/login")

    const initialOptions = await getOptions(uid, "flashcards");

    return (
        <FlashcardPageDisplay uid={uid} studySetString={setString} initialOptions={initialOptions}/>
    );
}