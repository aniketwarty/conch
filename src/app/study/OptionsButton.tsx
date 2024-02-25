import React, { useEffect } from "react";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, 
    AlertDialogOverlay, Button, Checkbox, Input, Spinner, useDisclosure } from "@chakra-ui/react"
import { getOptions, saveOptions } from "../lib/firebase/firestore";

interface OptionsButtonProps {
    uid: string;
    studyMode: string;
}

export const OptionsButton = ({ uid, studyMode }: OptionsButtonProps) => {
    const [options, setOptions] = React.useState<any>();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        getOptions(uid!, studyMode!).then((options) => {
            setOptions(options);
        });
    }, [uid, studyMode, isOpen]);

    function handleOption(key: string, value: any, optionKey: number) {
        switch (typeof value) {
            case "boolean":
                return(
                    <div key={optionKey} className="flex flex-row">
                        <p className="ml-3 mr-auto text-lg">{key}</p>
                        <Checkbox
                            defaultChecked={value} size="lg" className="mr-3"
                            onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                        >
                        </Checkbox>
                    </div>
                )
            case "number":
                <div key={optionKey} className="flex flex-row">
                    <p className="ml-3 mr-auto text-lg">{key}</p>
                    <Input
                        variant={"outline"} size="lg" className="mr-3" 
                        value={value}
                        onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
                    >
                    </Input>
                </div>
            default:
                return <p>Invalid option type</p>
        }
    }

    return (
        <>
            <Button variant="outline" className="ml-auto w-20 rounded-lg" onClick={onOpen}>Options</Button>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='3xl' fontWeight='bold'>Options</AlertDialogHeader>

                        <AlertDialogBody>
                            {!options ? <Spinner/> : Object.entries(options).map(([key, value], optionKey) => handleOption(key, value, optionKey))}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => {
                                saveOptions(options, uid, studyMode)
                                onClose()
                            }}>
                                Update
                            </Button>
                            <Button colorScheme='red' onClick={onClose} ml={3}>
                                Cancel
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}