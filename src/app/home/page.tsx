'use server';
import { fetchRecentSets, fetchStudySets } from '../lib/firebase/firestore';
import { HomePageDisplay } from './HomePageDisplay';
import { cookies } from 'next/headers';
import { auth } from '../lib/firebase/auth';
import { signInWithCustomToken } from 'firebase/auth';

export default async function Home() {//TODO: fix this caching
    console.log("home")
    const response = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        headers: {
            Cookie: `session=${cookies().get("session")?.value}`,
        },
    })
    
    const responseJson = await response.json();
    await signInWithCustomToken(auth, responseJson.token);
    const uid = responseJson.uid;
    const setList = await fetchStudySets(uid);
    const recentSetList = await fetchRecentSets(uid);

    return (
        <HomePageDisplay setList={setList} recentSetList={recentSetList}/>
    );
}

