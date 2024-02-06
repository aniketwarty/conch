'use client';
import { use, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Center, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { auth } from "../lib/firebase/firebase";

export default function LoginPage() {
    const router = useRouter();
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<string>>) {
        stateSetter(event.target.value);
    }

    function signUp() {
        createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error #" + errorCode + ": " + errorMessage);
            });
        if (auth.currentUser) {
            router.push('/home');
        }
    }

    function logIn() {
        signInWithEmailAndPassword(auth, logInEmail, logInPassword)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error #" + errorCode + ": " + errorMessage);
            });
        if (auth.currentUser) {
            router.push('/home');
        }
    }

    return (
        <div className="bg-slate-100 place-content-center p-32">
            <div className="object-center shadow-2xl rounded-lg flex place-content-around p-4 grow">
                <div className="flex flex-col w-full items-center m-5">
                    <p className="text-5xl font-bold object-center m-5"> Sign up </p>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Enter your email"
                            value={signUpEmail} onChange={(event) => handleInputChange(event, setSignUpEmail)}/>
                    </FormControl>
                    <FormControl className="mt-5">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="Enter your password"
                            value={signUpPassword} onChange={(event) => handleInputChange(event, setSignUpPassword)}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" onClick={signUp}>Sign up</Button>
                </div>
                <Center className="flex flex-col items-stretch"> 
                    <div className="grow h-max w-px bg-black"/>
                    <p> OR </p>
                    <div className="grow h-max w-px bg-black"/>
                </Center>
                <div className="flex flex-col w-full items-center m-5">
                    <p className="text-5xl font-bold object-center m-5"> Log in </p>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Enter your email"
                            value={logInEmail} onChange={(event) => handleInputChange(event, setLogInEmail)}/>
                    </FormControl>
                    <FormControl className="mt-5">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="Enter your password"
                            value={logInPassword} onChange={(event) => handleInputChange(event, setLogInPassword)}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" onClick={logIn}>Log in</Button>
                </div>
            </div>
        </div>
    );
}