'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { signUp, logIn, auth } from "../lib/firebase/auth";
import { Button, Center, FormControl, FormLabel, Input, Spinner } from "@chakra-ui/react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<string>>) {
        stateSetter(event.target.value);
    }

    async function handleSignUp() {
        console.log(auth.currentUser)
        setLoading(true);
        const success = await signUp(signUpEmail, signUpPassword);
        if(success) router.push("/home");
        setLoading(false);
    }

    async function handleLogIn() {
        setLoading(true);
        const success = await logIn(logInEmail, logInPassword);
        console.log(success);
        if (success) router.push("/home");
        setLoading(false);
    }

    return (
        <div className="bg-slate-100 h-screen w-screen top-0 flex items-center">
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            <div className="shadow-2xl rounded-lg flex flex-row m-auto p-4 w-3/5 h-1/2">
                <div className="flex flex-col w-full items-center m-5 justify-between">
                    <p className="text-5xl font-bold object-center m-5"> Sign up </p>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Enter your email"
                            value={signUpEmail} onChange={(event) => handleInputChange(event, setSignUpEmail)}/>
                    </FormControl>
                    <FormControl className="mt-5">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="Enter your password"
                            value={signUpPassword} onChange={(event) => handleInputChange(event, setSignUpPassword)} 
                            onKeyDown={(event) => {if (event.key === "Enter") {handleLogIn()}}}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" 
                    onClick={handleSignUp}>Sign up</Button>
                </div>
                <Center className="flex flex-col items-stretch"> 
                    <div className="grow h-max w-px bg-black"/>
                    <p> OR </p>
                    <div className="grow h-max w-px bg-black"/>
                </Center>
                <div className="flex flex-col w-full items-center m-5 justify-between">
                    <p className="text-5xl font-bold object-center m-5"> Log in </p>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Enter your email"
                            value={logInEmail} onChange={(event) => handleInputChange(event, setLogInEmail)}/>
                    </FormControl>
                    <FormControl className="mt-5">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="Enter your password"
                            value={logInPassword} onChange={(event) => handleInputChange(event, setLogInPassword)} 
                            onKeyDown={(event) => {if (event.key === "Enter") {handleLogIn()}}}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" 
                    onClick={handleLogIn}>Log in</Button>
                </div>
            </div>
        </div>
    );
}