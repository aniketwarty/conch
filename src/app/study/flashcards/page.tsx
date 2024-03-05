'use server';
import { getUserCookie, handleAuthRedirect } from "../../lib/firebase/auth";
import { getOptions } from "../../lib/firebase/firestore";
import { FlashcardPageDisplay } from "./FlashcardPageDisplay";
import { getSetString } from "@/app/lib/util/study";

export default async function FlashcardsPage({searchParams}: {searchParams: any}) {
    await handleAuthRedirect();

    const setString = await getSetString(searchParams);

    const user = await getUserCookie();
    const initialOptions = await getOptions(user!.uid, "flashcards");
    //TODO: store options in cookie

    return (
        <FlashcardPageDisplay studySetString={setString} initialOptions={initialOptions}/>
    );
}