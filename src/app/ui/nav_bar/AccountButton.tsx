'use client';
import React from 'react';
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { logOut } from '../../lib/firebase/auth';

export const AccountButton = () => {
    const router = useRouter();
    const onClick = () => {
        logOut().then(() => {
            router.push('/log_in');
        })
    };

    return (
        <RiAccountCircleFill
            className="m-2 h-10 w-10"
            onClick={onClick}
        >
        </RiAccountCircleFill>
    );
};