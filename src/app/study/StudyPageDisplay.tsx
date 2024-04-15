'use client';
import React, { useEffect, useState } from "react";
import { NavBar } from "../ui/nav_bar/NavBar";
import { StudyModeButton } from "../ui/study_page/StudyModeButton";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Input, InputGroup, InputRightAddon, InputRightElement, Spinner, useDisclosure, useEditable } from "@chakra-ui/react";
import { BsCardText } from "react-icons/bs";
import { FaGamepad, FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoChatboxSharp } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegCopy } from "react-icons/fa6";
import { StudySet } from "../lib/classes/study_set";
import { shareSet } from "../lib/firebase/firestore";

interface StudyPageDisplayProps {
    studySetString: string;
}
//TODO: add unsharing
export const StudyPageDisplay = ({studySetString}: StudyPageDisplayProps) => {
    const studySet = StudySet.fromString(studySetString);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement | null>(null)
    const [currentEmail, setCurrentEmail] = useState<string>("");
    const [sharedEmails, setSharedEmails] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const linkRef = React.useRef<string>("");

    useEffect(() => {
        linkRef.current = window.location.href;
    }, [])

    function addEmail() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setSharedEmails(prevSharedEmails => {
            if(currentEmail==="") {
                return prevSharedEmails
            } else if (!regex.test(currentEmail)) {
                setErrorMessage("Please enter a valid email")
                return prevSharedEmails;
            } else if(prevSharedEmails.includes(currentEmail)){
                setErrorMessage("That email is already included")
                return prevSharedEmails;
            } else {
                setErrorMessage("")
                return [...prevSharedEmails, currentEmail];
            }
        })
        setCurrentEmail("")
    }

    return (
        <div className="flex flex-col bg-slate-100 h-screen w-screen">
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            {!studySet ? <Spinner className="p-5 m-auto"/> : <div>
                <NavBar/>
                <div className="flex flex-row mt-5 mx-10">
                    <p className="text-3xl font-bold">{studySet.name}</p> 
                    <button className="ml-auto  px-4 py-2 flex items-center bg-blue-500 text-white rounded-md"
                    onClick={() => {
                        setCurrentEmail("")
                        setSharedEmails([])
                        setErrorMessage("")
                        onOpen()
                    }}>
                        Share
                        <RiShareForwardLine className="ml-2" />
                    </button>
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
                                        {sharedEmails.map((email, index) => {
                                            return (
                                                <div key={index} className="flex flex-row bg-slate-100 w-fit rounded-md items-center my-2 mr-2 px-3 py-2">
                                                    <p className="mr-1">{email}</p>
                                                    <button onClick={() => {setSharedEmails(prevSharedEmails => prevSharedEmails.filter(e => e !== email))}}>
                                                        <IoMdClose/>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-sm mt-10">Shareable link:</p>
                                    <div className="flex flex-row border-2 border-slate-700 rounded-md px-2 py-px w-full items-center" 
                                    onClick={() => navigator.clipboard.writeText(linkRef.current)}>
                                        <p className="truncate mr-2">{linkRef.current}</p>
                                        <FaRegCopy size={30}/>
                                    </div>
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={() => {
                                        shareSet(studySet.uid, studySet.name, [...sharedEmails, currentEmail])
                                        onClose()
                                    }}>
                                        Share
                                    </Button>
                                    <Button colorScheme='red' ml={3} onClick={onClose}>
                                        Cancel
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </div>
                
                <div className="flex flex-row h-5/6 w-full mb-5">
                    <div className="flex flex-col m-5 w-1/4 justify-between">
                        {/* TODO: disable game1 and game 2 and chat */}
                        <StudyModeButton text="Flashcards" icon={BsCardText} modePath="flashcards" studySetString={studySetString} setLoading={setLoading}/>
                        <StudyModeButton text="Quiz" icon={MdOutlineQuiz} modePath="quiz" studySetString={studySetString} setLoading={setLoading}/>
                        <StudyModeButton text="Game 1" icon={FaGamepad} modePath="game1" studySetString={studySetString} setLoading={setLoading}/>
                        <StudyModeButton text="Game 2" icon={FaGamepad} modePath="game2" studySetString={studySetString} setLoading={setLoading}/>
                        <StudyModeButton text="Chat" icon={IoChatboxSharp} modePath="chat" studySetString={studySetString} setLoading={setLoading}/>
                    </div>
                    <div className="ml-5 mb-5 w-px bg-black"/>
                    <div className="flex flex-col h-full w-3/4 px-8 pb-14 overflow-y-auto">
                        {studySet.terms.map((term, index) => {
                            return (
                                <div key={index} className="flex flex-row mt-5 p-5 w-full shadow-2xl rounded-lg">
                                    <p className="text-lg m-3 w-1/2">{term}</p>
                                    <div className="h-full w-px bg-black"/>
                                    <p className="text-lg m-3 w-1/2">{studySet.definitions[index]}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>}
        </div>
        
    );
}