'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { NavBar } from '../ui/nav_bar/NavBar';
import { StudySetList } from './StudySetList';
import { Spinner } from '@chakra-ui/react';
import { useAuth } from '../lib/firebase/auth_provider';

export default function HomePage() {
    const { authLoading } = useAuth();
    const [loading, setLoading] = useState(false);

    console.log("authLoading: ", authLoading)

    if(authLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <Spinner className="p-5 m-auto"/>
            </div>
        );
    }

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