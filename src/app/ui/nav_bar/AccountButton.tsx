'use client';
import React from 'react';
import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { logOut } from '../../lib/firebase/auth';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Button, Box, Divider } from '@chakra-ui/react';

export const AccountButton = () => {
    const router = useRouter();
    const onClick = () => {
        logOut().then(() => {
            router.push('/login');
        })
    };

    return (
        <div className="ml-auto mr-2">
            <Popover placement="bottom">
                <PopoverTrigger>
                    <div>
                        <RiAccountCircleFill className="h-10 w-10"/>
                    </div>
                </PopoverTrigger>
                <PopoverContent py={0.5} px={0} _focus={{ boxShadow: "none" }} border="1px" borderColor="gray.400" width="250px">
                    <PopoverBody p={0}>
                        <Button className="w-full" onClick={onClick} borderRadius="0">
                            Profile
                        </Button>
                        <div className="w-full bg-gray-300 h-px"/>
                        <Button className="w-full" onClick={onClick} borderRadius="0">
                            Log out
                        </Button>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </div>
    );
};