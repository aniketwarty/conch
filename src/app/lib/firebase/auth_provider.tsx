import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signInWithIdToken } from './auth';
import { getUserTokenCookie } from '../cookies';
import { usePathname } from 'next/navigation';
import { browserSessionPersistence, setPersistence } from 'firebase/auth';
import firebase from 'firebase/app'; // Add this line

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setPersistence(auth, browserSessionPersistence)
        const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
            if (!user) {
                getUserTokenCookie().then((user_token) => {
                    if ((user_token ?? "") !== "") {
                        signInWithIdToken(user_token!).then((success) => {
                            if(success) {
                                if(pathname === "/log_in" || pathname === "/") {
                                    router.push('/home');
                                }
                            } else {
                                router.push('/log_in');
                            }
                        })
                    } else {
                        router.push('/log_in');
                    }
                });
            } else {
                if(pathname === "/log_in" || pathname === "/") {
                    router.push('/home');
                }
            }
        })

        return () => unregisterAuthObserver();
  }, []);

  return <>{children}</>;
}