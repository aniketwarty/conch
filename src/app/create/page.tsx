import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreatePageDisplay } from "./CreatePageDisplay";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../lib/firebase/auth";

export default async function Create() {
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

    const responseJson = await response.json();
    if(auth.currentUser===null) await signInWithCustomToken(auth, responseJson.token);
    const uid = responseJson.uid;
    
    return (
       <CreatePageDisplay uid={uid}/> 
    );
}