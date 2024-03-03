'use client';
import { useEffect, useState } from 'react';
import firebase from 'firebase/auth';
import { getAuthProps } from '../lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { NavBar } from '../ui/nav_bar/NavBar';
import { StudySetList } from './StudySetList';
import { Spinner } from '@chakra-ui/react';
import { AuthLoading, useAuth } from '../lib/firebase/auth_provider';

export default function HomePage({ user }:{ user: firebase.User }) {
    const { authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        if(!user) router.push("/log_in")
    }, [router, user])
    if(authLoading) return <AuthLoading/>;

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

export { getAuthProps }