import { auth } from "../lib/firebase/auth";
import { signInWithCustomToken } from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SharedSetsPageDisplay } from "./SharedSetsPageDisplay";
import { fetchRecentlySharedSets, fetchSetsSharedWithYou } from "../lib/firebase/firestore";
import { remove } from "firebase/database";


export default async function SharedSetsPage() {
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/auth", {//PROD: change to production URL
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "Cookie": `session=${cookies().get("session")?.value ?? "unable to get client cookie"}`
        }
    })
    
    if(!response.ok) redirect("/login")
    const responseJson = await response.json();
    await signInWithCustomToken(auth, responseJson.token);
    const uid = responseJson.uid;
    const setsSharedWithYou = await fetchSetsSharedWithYou(uid);
    const setsRecentlySharedByYou = await fetchRecentlySharedSets(uid);

    return (
        <SharedSetsPageDisplay setsSharedWithYou={setsSharedWithYou} setsRecentlySharedByYou={setsRecentlySharedByYou}/>
    )
}