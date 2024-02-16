'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, logIn } from '../lib/firebase/auth';
import { NavBar } from '../ui/nav_bar/NavBar';
import { StudySetList } from './StudySetList';

export default function HomePage() {
    const router = useRouter();
    useEffect(() => {
        if(!auth.currentUser) {
            // router.push('/log_in');
            //TODO: uncomment
            logIn("aniket.warty06@gmail.com", "password");
        }
    }, [router])
    
    return (
        <div className="bg-slate-100 h-screen w-screen flex flex-col">
            <NavBar/>
            <p className="text-3xl font-bold m-10"> Your sets </p>
            <StudySetList/>
        </div>
    );
}