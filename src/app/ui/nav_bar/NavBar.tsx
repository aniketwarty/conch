import Link from "next/link";
import Image from "next/image"
import { Divider } from '@chakra-ui/react'
import { AccountButton } from "./AccountButton";

export const NavBar = () => {
    return (
        <div>
            <div className="h-20 p-5 items-center w-full  top-0 flex">

                {/* <Image src="/logo.jpg" alt="Logo" className="m-5" height={15} width = {15}/> */}

                <Link href = {{
                    pathname: "/home",
                }}>
                    <h1 className="ml-5 text-2xl font-bold p-2">
                        Conch
                    </h1>
                </Link>

                <AccountButton/>
            </div>
            <Divider />
        </div>
    )
}   