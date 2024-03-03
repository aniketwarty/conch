import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './auth';
import { inMemoryPersistence, setPersistence } from 'firebase/auth';
import firebase from 'firebase/auth';
import { Spinner } from '@chakra-ui/react';

interface AuthContextValue {
    user: firebase.User | null;
    authLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({user: null, authLoading: true});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {   
        setPersistence(auth, inMemoryPersistence)
        const unregisterAuthObserver = auth.onAuthStateChanged(async (user) => {
            if(user) {
                setUser(user);
            } else {
                setUser(null);
            }

            setAuthLoading(false);
        })

        return () => unregisterAuthObserver();
  }, []);

    return (
        <AuthContext.Provider value={{user, authLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthLoading = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <Spinner className="p-5 m-auto"/>
            <p className="text-2xl">Logging in...</p>
        </div>
    )
}