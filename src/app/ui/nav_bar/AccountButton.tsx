'use client';
import React from 'react';
import { redirect } from 'next/navigation';
import { RiAccountCircleFill } from "react-icons/ri";

export const AccountButton = () => {
    const onClick = () => {
        //TODO: implement account menu
        redirect('/log_in');
    };

    return (
        <RiAccountCircleFill
            className="m-2 h-10 w-10"
            onClick={onClick}
        >
        </RiAccountCircleFill>
    );
};