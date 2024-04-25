'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { signUp, logIn, auth } from "../lib/firebase/auth";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Center, FormControl, FormLabel, Input, Spinner, useDisclosure } from "@chakra-ui/react";
import { signInWithCustomToken } from "firebase/auth";
import { LoginNavBar } from "../ui/nav_bar/NavBar";
import { AccentColor2, BackgroundColorGradient } from "../colors";

//TODO: fix random redirects - localhost issue only?
//TODO: add logo and product name and description at top, add created by/powerered by in bottom
export default function LoginPage() {
    const router = useRouter();
    const onClose = useDisclosure().onClose;
    const cancelRef = React.useRef<HTMLButtonElement | null>(null)
    const [loading, setLoading] = useState(false);
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<string>>) {
        stateSetter(event.target.value);
    }

    async function handleSignUp() {
        setLoading(true);
        const response = await signUp(signUpEmail, signUpPassword);
        if(response.status === 200) {
            await signInWithCustomToken(auth, (await response.json()).token);
            window.location.href = "/home"
        }
        else {
            setAlertMessage(`Error (${response.status}): ` + (await response.json()).error);
            setLoading(false);
        }
    }

    async function handleLogIn() {
        setLoading(true); //TODO: make an alert with the login error
        const response = await logIn(logInEmail, logInPassword);
        if(response.status === 200) {
            await signInWithCustomToken(auth, (await response.json()).token);
            window.location.href = "/home"
        }
        else {
            setAlertMessage(`Error (${response.status}): ` + (await response.json()).error);
            setLoading(false);
        }
    }

    return (
        <div className="bg-slate-100 h-screen w-screen top-0 flex items-center" style={{background: BackgroundColorGradient}}>
            <LoginNavBar/>
            <AlertDialog isOpen={alertMessage!==""} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader className="-mb-2" fontSize='3xl' fontWeight='bold'>Error</AlertDialogHeader>
                        <AlertDialogBody>{alertMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => {
                                setAlertMessage("");
                                onClose()
                            }}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>  
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            <div className="shadow-2xl rounded-lg flex flex-row m-auto p-4 w-3/5 h-1/2" style={{backgroundColor: AccentColor2}}>
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
                            onKeyDown={(event) => {if (event.key === "Enter") handleSignUp()}}/>
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
                            onKeyDown={(event) => {if (event.key === "Enter") handleLogIn()}}/>
                    </FormControl>
                    <Button colorScheme="blue" size="lg" className="mt-5 w-full" 
                    onClick={handleLogIn}>Log in</Button>
                </div>
            </div>
        </div>
    );
}