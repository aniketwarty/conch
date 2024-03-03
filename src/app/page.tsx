'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import firebase from 'firebase/auth';
import { getAuthProps } from './lib/firebase/auth';
import { Spinner } from '@chakra-ui/react';

export default function Main({ user }: { user: firebase.User }) {
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push("/log_in")
        } else {
            router.push("/home")
        }
    }, [router, user])
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Spinner className="p-5 m-auto"/>
        </main>
    );
};

export { getAuthProps }
