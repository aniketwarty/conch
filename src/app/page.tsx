'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { auth, signInWithIdToken } from './lib/firebase/auth';
import { getUserTokenCookie } from './lib/cookies';
import { Spinner } from '@chakra-ui/react';
import path from 'path';
import { User } from 'firebase/auth';

export default function Main()  {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Spinner className="p-5 m-auto"/>
        </main>
    );
};
