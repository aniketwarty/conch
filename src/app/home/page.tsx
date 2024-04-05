'use server';
import { redirect } from 'next/navigation';
import { fetchStudySets } from '../lib/firebase/firestore';
import { HomePageDisplay } from './HomePageDisplay';
import { cookies } from 'next/headers';

export default async function Home() {
    const response = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        headers: {
            Cookie: `session=${cookies().get("session")?.value}`,
        },
    })

    if (response.status !== 200) {
        console.log("Error getting uid")
        redirect("/login");
    }

    const uid = (await response.json()).uid;
    const setList = await fetchStudySets(uid);

    return (
        <HomePageDisplay setList={setList}/>
    );
}

