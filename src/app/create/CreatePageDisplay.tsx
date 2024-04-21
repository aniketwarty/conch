'use client'
import { StudySet } from "../lib/classes/study_set";
import { NavBar } from "../ui/nav_bar/NavBar";
import React, { use, useEffect, useState } from 'react';
import { FaPlus, FaRegCopy, FaUserPlus } from "react-icons/fa6";
import { Box, Button, FormControl, FormLabel, Input, VStack, HStack, IconButton, Textarea, useColorModeValue, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, InputGroup, InputRightElement, useDisclosure } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { createStudySet } from "../lib/firebase/firestore";
import { useRouter } from "next/navigation";


interface CreatePageDisplayProps {
    uid: string;
}

export const CreatePageDisplay = ({uid}: CreatePageDisplayProps) => {
    const router = useRouter();
    const [studySet, setStudySet] = useState<StudySet>(new StudySet("", ["", "", "", "", ""], ["", "", "", "", ""], new Date(), uid));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement | null>(null)
    const [currentEmail, setCurrentEmail] = useState<string>("");
    const [sharedEmails, setSharedEmails] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const linkRef = React.useRef<string>("");
    const bottomRef = React.useRef<HTMLDivElement>(null);

    function addEmail() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(currentEmail==="") {
            setSharedEmails(prevSharedEmails => prevSharedEmails)
            return false
        } else if (!regex.test(currentEmail)) {
            setErrorMessage("Please enter a valid email")
            setSharedEmails(prevSharedEmails => prevSharedEmails)
            return false;
        } else if(sharedEmails.includes(currentEmail)){
            setErrorMessage("That email is already included")
            setSharedEmails(prevSharedEmails => prevSharedEmails)
            return false;
        } else {
            setErrorMessage("")
            setCurrentEmail("")
            setSharedEmails(prevSharedEmails => [...prevSharedEmails, currentEmail]);
            return true;
        }
    }

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [studySet]);

    return (
        <div className="bg-gray-100 h-full w-screen flex flex-col">
            <NavBar/>
            {/* <Button onClick={() => createStudySet(new StudySet("test2", ["term1"], ["definition1"], new Date(), uid))}>Create</Button> */}
            <div className="bg-slate-200 my-10 mx-40 rounded-2xl h-full shadow-lg px-10 flex flex-col">
                <div className="flex flex-row items-center">
                    <p className="text-3xl font-bold my-8">Create set</p>
                    <FaUserPlus className="ml-auto mr-3" size={"25px"} onClick={onOpen}/>
                    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader className="-mb-2" fontSize='3xl' fontWeight='bold'>Share</AlertDialogHeader>

                                <AlertDialogBody justifyContent={"space-between"}>
                                    {/* TODO: add window that displays valid emails as the user is typing */}
                                    <InputGroup>
                                        <Input variant="outline" placeholder="Enter emails..."
                                        borderColor={errorMessage===""?"gray.300":"red.300"}
                                        focusBorderColor={errorMessage===""?"blue.300":"red.300"}
                                        _hover={{borderColor: errorMessage===""?"gray.300":"red.300"}}
                                        value={currentEmail} onChange={(e) => {
                                            if(errorMessage!=="") setErrorMessage("")
                                            setCurrentEmail(e.target.value)
                                        }} 
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addEmail();
                                            }
                                        }}
                                        />
                                        <InputRightElement>
                                            <Button className="m-5" size={"sm"} onClick={addEmail}>
                                                <FaPlus/>
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    {errorMessage!==""?<p className="text-red-600 text-sm">{errorMessage}</p>:<></>}
                                    {/* TODO: allow sharing with anyone with the link */}
                                    <div className="flex flex-wrap">
                                        {sharedEmails??[].length>0?sharedEmails!.map((email, index) => {
                                            return index>0?<div key={index} className="flex flex-row bg-slate-100 w-fit rounded-md items-center my-2 mr-2 px-3 py-2">
                                                <p className="mr-1">{email}</p>
                                                <button onClick={() => {setSharedEmails(prevSharedEmails => prevSharedEmails.filter(e => e !== email))}}>
                                                    <IoMdClose/>
                                                </button>
                                            </div>:<></>;
                                        }):<></>}
                                    </div>
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={() => {
                                        onClose()
                                    }}>
                                        Add
                                    </Button>
                                    <Button colorScheme='red' ml={3} onClick={onClose}>
                                        Cancel
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </div>
                
                <FormControl>
                    <p className="font-bold">Name</p>
                    <Input variant={"outline"} borderColor="black" _hover={{ outline: "black" }}
                    onChange={(e) => setStudySet(prevStudySet => prevStudySet.changeName(e.target.value))}/>
                </FormControl>
                <p className="font-bold mt-8">Terms/Definitions</p>
                {studySet.terms.map((term, index) => {
                    return (<div key={index} className="flex flex-row mt-2 p-5 w-full shadow-lg rounded-md bg-gray-100">
                        <p className="font-bold text-lg -mt-2 mr-4">{index+1}.</p>
                        <FormControl>
                            <FormLabel fontSize="sm">Term</FormLabel>
                            <div className="text-wrap min-height-20 rounded-md p-2 overflow-auto resize-none" 
                            style={{border: '1px solid black', overflowWrap: 'anywhere'}}
                            contentEditable suppressContentEditableWarning
                            onInput={(e) => {
                                const text = e.currentTarget.innerText;
                                setStudySet(prevStudySet => prevStudySet.changeTerm(index, text));
                            }}/>

                        </FormControl>
                        <div className="mx-4"/>
                        <FormControl>
                            <FormLabel fontSize="sm">Definition</FormLabel>
                            <div className="text-wrap min-height-20 rounded-md p-2 overflow-auto resize-none" 
                            style={{border: '1px solid black', overflowWrap: 'anywhere'}}
                            contentEditable suppressContentEditableWarning
                            onInput={(e) => {
                                const text = e.currentTarget.innerText;
                                console.log(text)
                                setStudySet(prevStudySet => prevStudySet.changeDefinition(index, text));
                                console.log(studySet)
                            }}/>
                        </FormControl>
                        {/* TODO: add removing terms */}
                    </div>)
                })}
                <Button className="w-full mt-4" backgroundColor={"gray.50"} onClick={() => {
                    setStudySet(prevStudySet => prevStudySet.add("", ""));
                }}>+</Button>
                <Button className="w-full my-4" backgroundColor={"gray.50"} onClick={() => {
                    createStudySet(studySet.removeEmptyTerms())
                    //TODO: fix sharing not working on this navigation
                    router.push(`/study/?setUid=${studySet.uid}&setName=${studySet.name}`)
                    //TODO: prevent empty set creation
                }}>Create</Button>
                <div ref={bottomRef}/>
            </div>
        </div>
    );
}