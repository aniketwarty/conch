// 'use server';
// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import { fetchStudySet } from "../lib/firebase/firestore";
// import { StudyPageDisplay } from "./StudyPageDisplay";


// export default async function StudyPage() {
//     const cookieStore = cookies()
//     const token = cookieStore.get('user_token')
//     if(!token) redirect("/log_in");

//     let setString = cookieStore.get("study_set")?.value ?? null;
//     const searchParams = new URLSearchParams(window.location.search);
//     const setUid = searchParams.get("setUid");
//     const setName = searchParams.get("setName");

//     if(!setString && (!setUid || !setName)) redirect("/home");
//     else if (!setString) {
//         setString = await fetchStudySet(setUid, setName);
//         if(setString) cookieStore.set("study_set", setString);
//         else redirect("/home");
//     }
    
//     return (
//         <StudyPageDisplay studySetString={setString}/>
//     )
// }