'use server';
import { redirect } from 'next/navigation';
import { fetchStudySets } from '../lib/firebase/firestore';
import { HomePageDisplay } from './HomePageDisplay';
import { cookies } from 'next/headers';

export default async function Home() {
    const uid = cookies().get("uid")?.value;

    if(uid) {
        const setList = await fetchStudySets(uid);
        return (
            <HomePageDisplay setList={setList}/>
        );
    } else {
        redirect("/login");
    }
}

