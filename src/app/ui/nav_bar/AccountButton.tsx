'use client';
import React from 'react';
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { logOut } from '../../lib/firebase/auth';

export const AccountButton = () => {
    const router = useRouter();
    const onClick = () => {
        logOut().then(() => {
            router.push('/login');
        })
    };

    return (
        <RiAccountCircleFill
            className="ml-auto mr-2 h-10 w-10"
            onClick={onClick}
        >
        </RiAccountCircleFill>
    );
};