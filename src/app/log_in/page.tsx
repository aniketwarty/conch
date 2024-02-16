'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Center, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { signUp, logIn } from "../lib/firebase/auth";

export default function LoginPage() {
    const router = useRouter();
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<string>>) {
        stateSetter(event.target.value);
    }

    function handleSignUp() {
        const success = signUp(signUpEmail, signUpPassword);
        if(success) router.push("/home");
    }

    function handleLogIn() {
        const success = logIn(logInEmail, logInPassword);
        if(success) router.push("/home");
    }

    return (
        <div className="bg-slate-100 place-content-center px-40 py-32 h-screen w-screen">
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
                            value={signUpPassword} onChange={(event) => handleInputChange(event, setSignUpPassword)} 
                            onSubmit={handleSignUp}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" 
                    onClick={handleSignUp}>Sign up</Button>
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
                            value={logInPassword} onChange={(event) => handleInputChange(event, setLogInPassword)} 
                            onSubmit={handleLogIn}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" 
                    onClick={handleLogIn}>Log in</Button>
                </div>
            </div>
        </div>
    );
}