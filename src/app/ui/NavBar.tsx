import Link from "next/link";
import Image from 'next/image'
import { AccentColor1 } from "@/app/colors";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Button, IconButton } from "@chakra-ui/react";
import { RiAccountCircleFill } from "react-icons/ri";
import { logOut } from "@/app/lib/firebase/auth";

export const NavBar = () => {
    const router = useRouter();
    
    return (
        <div>
            <div className="h-20 w-full top-0 flex z-0 bg-gray-100"/>
            <div className="h-20 w-full fixed top-0 flex z-40 bg-gray-100 shadow-xl" style={{backgroundColor: AccentColor1}}>
                {/* TODO: add back button if not on home page */}
                <img src="/logo.png" alt="Logo" className="ml-10 mr-5 my-auto" height={40} width={150} onClick={() => window.location.href = "/home"}/>


                <Button className="mx-5 my-auto" variant={"link"} _hover={{ textDecoration: "underline", textDecorationColor: "black" }}
                onClick={() => window.location.href = "/home"}>
                    <p className="text-black font-bold text-2xl mt-px">Home</p>
                </Button>

                <Button className="mx-5 my-auto" variant={"link"} _hover={{ textDecoration: "underline", textDecorationColor: "black" }}
                onClick={() => window.location.href = "/shared_sets"}>
                    <p className="text-black font-bold text-2xl mt-px">Shared sets</p>
                </Button>

                <Button className="mx-5 my-auto" variant={"link"} _hover={{ textDecoration: "underline", textDecorationColor: "black" }}
                onClick={() => window.location.href = "/question_generator"}>
                    <p className="text-black font-bold text-2xl mt-px">Question Generator</p>
                </Button>

                <div className="ml-auto mr-5 my-auto">
                    <Popover placement="bottom">
                        <PopoverTrigger>
                            <IconButton icon={<RiAccountCircleFill className="h-10 w-10"/>} aria-label="Account button"
                            style={{backgroundColor: AccentColor1}}/>
                        </PopoverTrigger>
                        <PopoverContent py={0.5} px={0} _focus={{ boxShadow: "none" }} border="1px" borderColor="gray.400" width="250px">
                            <PopoverBody p={0}>
                                <Button className="w-full" onClick={()=>{
                                    logOut().then(() => {
                                        window.location.href = "/login"
                                    })
                                }} borderRadius="0">
                                    Log out
                                </Button>
                                <div className="w-full bg-gray-300 h-px"/>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="w-full bg-gray-400 h-px"/>
        </div>
    )
}

export const LoginNavBar = () => {
    return (
        <div>
            <div className="h-20 items-center w-full top-0 flex z-0 bg-gray-100"/>
            <div className="h-20 items-center w-full fixed top-0 flex z-40 bg-gray-100 shadow-xl" style={{backgroundColor: AccentColor1}}>
                <div className="ml-10 mr-5 my-auto">
                    <img src="/logo.png" alt="Logo" height={40} width={150}/>
                </div>
            </div>
            <div className="w-full bg-gray-400 h-px"/>
        </div>
    )
}