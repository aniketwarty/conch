'use server';
import { fetchRecentSets, fetchStudySets } from '../lib/firebase/firestore';
import { HomePageDisplay } from './HomePageDisplay';
import { cookies } from 'next/headers';
import { auth } from '../lib/firebase/auth';
import { signInWithCustomToken } from 'firebase/auth';
import { redirect } from 'next/navigation';

export default async function Home() {//TODO: fix this caching
    const sessionCookie = cookies().get("session")?.value;
    const headers: { [key: string]: string } = {
        "Accept": "application/json"
    };

    if (sessionCookie) {
        headers["Cookie"] = `session=${sessionCookie}`;
    }

    const response = await fetch("http://conch.netlify.app/api/login", {
        method: "GET",
        credentials: "include",
        headers
    });
    
    if(response.redirected) redirect("/login")
    const responseJson = await response.json();
    console.log("responseJson", responseJson)
    await signInWithCustomToken(auth, responseJson.token);
    const uid = responseJson.uid;
    const setList = await fetchStudySets(uid);
    const recentSetList = await fetchRecentSets(uid);

    return (
        <HomePageDisplay setList={setList} recentSetList={recentSetList}/>
    );
}

