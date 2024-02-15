'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase/firebase';
import { NavBar } from '../ui/nav_bar/NavBar';
import { StudySetList } from './StudySetList';
import { StudySet } from '../lib/classes/study_set';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        if(!auth.currentUser) {
            router.push('/log_in');
        }
    })
    
    return (
        <div className="bg-slate-100 h-screen w-screen flex flex-col">
            <NavBar/>
            <p className="text-3xl m-10"> Your sets </p>
            <StudySetList/>
        </div>
    );
}