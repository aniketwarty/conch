'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOptions } from "../../lib/firebase/firestore";
import { getSetString } from "../../lib/util/study";
import { QuizPageDisplay } from "./QuizPageDisplay";

export default async function QuizPage({searchParams}: {searchParams: any}) {
    const setString = await getSetString(searchParams);

    const uid = cookies().get("uid")?.value;
    if(!uid) redirect("/login")

    const initialOptions = await getOptions(uid, "quiz");
    
    return (
        <QuizPageDisplay uid={uid} studySetString={setString} initialOptions={initialOptions}/>
    );
}