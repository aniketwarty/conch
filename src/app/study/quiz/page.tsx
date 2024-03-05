'use server';
import { handleAuthRedirect, getUserCookie } from "../../lib/firebase/auth";
import { getOptions } from "../../lib/firebase/firestore";
import { getSetString } from "../../lib/util/study";
import { QuizPageDisplay } from "./QuizPageDisplay";

export default async function QuizPage({searchParams}: {searchParams: any}) {
    await handleAuthRedirect();

    const setString = await getSetString(searchParams);

    const user = await getUserCookie();
    const initialOptions = await getOptions(user!.uid, "flashcards");
    
    return (
        <QuizPageDisplay studySetString={setString} initialOptions={initialOptions}/>
    );
}