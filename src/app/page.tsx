'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { auth, signInWithIdToken } from './lib/firebase/auth';
import { getUserTokenCookie } from './lib/cookies';
import { Spinner } from '@chakra-ui/react';
import path from 'path';

export default function Main() {
    // const router = useRouter();
    // const pathname = usePathname();

    // useEffect(() => {
    //     auth.onAuthStateChanged((user) => {
    //         console.log("onAuthStateChanged");
    //         if (!user) {
    //             getUserTokenCookie().then((user_token) => {
    //                 if ((user_token ?? "") !== "") {
    //                     signInWithIdToken(user_token!).then((success) => {
    //                         if(success) {
    //                             if(pathname === "/log_in" || pathname === "/") {
    //                                 router.push('/home');
    //                             }
    //                         } else {
    //                             router.push('/log_in');
    //                         }
    //                     })
    //                 } else {
    //                     router.push('/log_in');
    //                 }
    //             });
    //         } else {
    //             if(pathname === "/log_in" || pathname === "/") {
    //                 router.push('/home');
    //             }
    //         }
    //     })
    // })

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Spinner className="p-5 m-auto"/>
        </main>
    );
};