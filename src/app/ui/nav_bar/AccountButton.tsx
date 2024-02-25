'use client';
import React from 'react';
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';

export const AccountButton = () => {
    const router = useRouter();
    const onClick = () => {
        //TODO: implement account menu
        router.push('/log_in');
    };

    return (
        <RiAccountCircleFill
            className="m-2 h-10 w-10"
            onClick={onClick}
        >
        </RiAccountCircleFill>
    );
};