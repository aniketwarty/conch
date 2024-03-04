'use server';
import { redirect } from 'next/navigation';
import { fetchStudySets } from '../lib/firebase/firestore';
import { HomePageDisplay } from './HomePageDisplay';
import { getAuthCookies } from '../lib/cookies';

export default async function Home() {
    const {user, token} = await getAuthCookies();
    if(!token) redirect("/log_in");

    const setList = await fetchStudySets(user!.uid);

    return (
        <HomePageDisplay setList={setList}/>
    );
}

