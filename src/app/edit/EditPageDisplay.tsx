"use client"
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, FormControl, FormLabel, IconButton, Input, InputGroup, InputRightElement, Spinner, useDisclosure } from "@chakra-ui/react";
import { StudySet } from "../lib/classes/study_set";
import { NavBar } from "../ui/NavBar";
import React, { useState, useEffect } from "react";
import { FaPlus, FaRegCopy, FaTrash, FaUserPlus } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BackgroundColor, AccentColor1, AccentColor2 } from "../colors";
import { deleteSet, fetchSharedEmails, shareSet, updateSet } from "../lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { set, update } from "firebase/database";

interface EditPageDisplayProps {
    uid: string;
    studySetString: string;
}

export const EditPageDisplay = ({uid, studySetString}: EditPageDisplayProps) => {
    const router = useRouter();
    const [studySet, setStudySet] = useState(StudySet.fromString(studySetString));
    const [loading, setLoading] = useState(false);
    const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
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
        async function getSharedEmails() {
            const sharedEmails = await fetchSharedEmails(studySet.uid, studySet.name);
            setSharedEmails(sharedEmails)
        }
        linkRef.current = window.location.href.replace("edit", "study");
        getSharedEmails();
    }, [])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [studySet]);

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden" style={{backgroundColor: BackgroundColor}}>
            {loading && (
                <div className="fixed h-screen w-screen z-50 bg-gray-500 opacity-50 flex place-content-center">
                    <Spinner className="p-5 m-auto"/>
                </div>
            )}
            <NavBar/>
            {!studySet ? <Spinner className="p-5 m-auto"/> : <div className="flex flex-col">
                <div className="flex flex-row my-5 mx-10">
                    <p className="my-auto">
                        <span className=" text-3xl font-bold">{studySet.name}</span>
                        <span className="mx-2 text-2xl">•</span>
                        <span className="text-2xl">{studySet.terms.length} terms</span>
                    </p> 
                    {/* TODO: add terms and some other info separated by dots */}
                    <FaUserPlus className="ml-auto mr-3" size={"25px"} onClick={onOpenShare}/>
                    <AlertDialog isOpen={isOpenShare} leastDestructiveRef={cancelRef} onClose={onCloseShare}>
                        <AlertDialogOverlay>
                            <AlertDialogContent backgroundColor={AccentColor2}>
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
                                            return index>0?<div key={index} className="flex flex-row bg-slate-200 w-fit rounded-md items-center my-2 mr-2 px-3 py-2">
                                                <p className="mr-1">{email}</p>
                                                <button onClick={() => {setSharedEmails(prevSharedEmails => prevSharedEmails.filter(e => e !== email))}}>
                                                    <IoMdClose/>
                                                </button>
                                            </div>:<div key={index}></div>;
                                        }):<></>}
                                    </div>
                                    <p className="text-sm mt-10">Shareable link:</p>
                                    <div className="flex flex-row border-2 border-slate-700 rounded-md px-2 py-px w-full items-center" 
                                    onClick={() => navigator.clipboard.writeText(linkRef.current)}>
                                        <p className="truncate mr-2">{linkRef.current}</p>
                                        <FaRegCopy size={30}/>
                                    </div>
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button style={{ backgroundColor: '#E0E7FF' }} 
                                    ref={cancelRef} onClick={() => {
                                        if(addEmail()) shareSet(studySet.uid, studySet.name, [...sharedEmails, currentEmail]);
                                        else shareSet(studySet.uid, studySet.name, sharedEmails);
                                        onCloseShare()
                                    }}>
                                        Share
                                    </Button>
                                    <Button colorScheme='red' ml={3} onClick={onCloseShare}>
                                        Cancel
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                    <FaTrash className="mx-3" size={"23px"} onClick={onOpenDelete}/>
                    <AlertDialog isOpen={isOpenDelete} leastDestructiveRef={cancelRef} onClose={onCloseDelete}>
                        <AlertDialogOverlay>
                            <AlertDialogContent backgroundColor={AccentColor2}>
                                <AlertDialogHeader className="-mb-2" fontSize='3xl' fontWeight='bold'>Are you sure?</AlertDialogHeader>

                                <AlertDialogBody justifyContent={"space-between"}>
                                    <p className="text-lg">Are you sure you want to delete this set? This action is irreversible.</p>                                    
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button style={{ backgroundColor: '#E0E7FF' }} 
                                    ref={cancelRef} onClick={() => {
                                        deleteSet(studySet.uid, studySet.name);
                                        onCloseDelete()
                                        setLoading(true);
                                        router.push("/home");
                                    }}>
                                        Delete
                                    </Button>
                                    <Button colorScheme='red' ml={3} onClick={onCloseDelete}>
                                        Cancel
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                    <FaRegCheckCircle className="mx-3" size={"25px"} onClick={onOpenEdit}/>
                    <AlertDialog isOpen={isOpenEdit} leastDestructiveRef={cancelRef} onClose={onCloseEdit}>
                        <AlertDialogOverlay>
                            <AlertDialogContent backgroundColor={AccentColor2}>
                                <AlertDialogHeader className="-mb-2" fontSize='3xl' fontWeight='bold'>Are you sure?</AlertDialogHeader>

                                <AlertDialogBody justifyContent={"space-between"}>
                                    <p className="text-lg">Are you sure you want to apply these edits? This action is irreversible.</p>                                    
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button style={{ backgroundColor: '#E0E7FF' }} 
                                    ref={cancelRef} onClick={() => {
                                        updateSet(studySet.removeEmptyTerms());
                                        onCloseEdit()
                                        setLoading(true);
                                        router.push("/home");
                                    }}>
                                        Edit
                                    </Button>
                                    <Button colorScheme='red' ml={3} onClick={onCloseEdit}>
                                        Cancel
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </div>
                <div className="overflow-y-auto h-[80vh] px-14">
                    {studySet.terms.map((term, index) => {
                        return (
                            <div key={index} className="flex flex-row mb-10 px-5 py-7 rounded-xl shadow-xl" style={{backgroundColor: AccentColor2}}>
                                <p className="font-bold text-xl mr-3">{index+1}.</p>
                                <FormControl>
                                    <FormLabel fontSize="sm">Term</FormLabel>
                                    <div className="text-wrap min-height-20 rounded-md p-2 overflow-auto resize-none" 
                                    style={{border: '1px solid black', overflowWrap: 'anywhere'}}
                                    contentEditable suppressContentEditableWarning
                                    onInput={(e) => {
                                        const text = e.currentTarget.innerText;
                                        studySet.changeTerm(index, text);
                                    }}>{term}</div>
                                </FormControl>
                                <div className="mx-4"/>
                                <FormControl>
                                    <FormLabel fontSize="sm">Definition</FormLabel>
                                    <div className="text-wrap min-height-20 rounded-md p-2 overflow-auto resize-none" 
                                    style={{border: '1px solid black', overflowWrap: 'anywhere'}}
                                    contentEditable suppressContentEditableWarning
                                    onInput={(e) => {
                                        const text = e.currentTarget.innerText;
                                        studySet.changeDefinition(index, text);
                                    }}>{studySet.definitions[index]}</div>
                                </FormControl>
                                <IconButton className="ml-auto -mt-3 -mr-2" aria-label="delete" variant="ghost" icon={<FaTrash/>} isRound={true}
                                onClick={() => setStudySet(prevStudySet => prevStudySet.remove(index))}/>
                            </div>
                        )
                    })}
                    <Button className="w-full shadow-xl mb-10" height={59} backgroundColor={"gray.50"} onClick={() => {
                        setStudySet(prevStudySet => prevStudySet.add("", ""));
                    }}>+</Button>
                    <div ref={bottomRef}/>
                </div>
            </div>}
        </div>
    )
}