'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '../ui/nav_bar/NavBar';
import { StudySetList } from './StudySetList';
import { Spinner } from '@chakra-ui/react';

export default function HomePage() {
    const [loading, setLoading] = useState(false);
    // const router = useRouter();
    // useEffect(() => {
    //     if(!auth.currentUser) {
    //         router.push('/log_in');
    //     }
    // }, [router])
    
    return (
        <div className="bg-slate-100 h-screen w-screen flex flex-col">
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            <NavBar/>
            <p className="text-3xl font-bold m-10"> Your sets </p>
            <StudySetList setLoading={setLoading}/>
        </div>
    );
}