'use server';
import { fetchRecentSets, fetchStudySets } from '../lib/firebase/firestore';
import { HomePageDisplay } from './HomePageDisplay';
import { cookies } from 'next/headers';
import { auth } from '../lib/firebase/auth';
import { signInWithCustomToken } from 'firebase/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
    const response = await fetch("http://localhost:3000/api/auth", {//PROD: change to production URL
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
    const setList = await fetchStudySets(uid);
    const recentSetList = await fetchRecentSets(uid);

    return (
        <HomePageDisplay setList={setList} recentSetList={recentSetList}/>
    );
}

