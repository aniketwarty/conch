import Link from "next/link";
import { AccountButton } from "./AccountButton";
import Image from 'next/image'
import { AccentColor1 } from "@/app/colors";

export const NavBar = () => {
    return (
        <div>
            <div className="h-20 items-center w-full top-0 flex z-0 bg-gray-100"/>
            <div className="h-20 items-center w-full fixed top-0 flex z-40 bg-gray-100 shadow-xl" style={{backgroundColor: AccentColor1}}>
                <Link href = {{
                    pathname: "/home",
                }}>
                    <Image src="/logo.png" alt="Logo" className="ml-10 mt-4" height={40} width={150}/>
                </Link>
                <AccountButton/>
            </div>
            <div className="w-full bg-gray-400 h-px"/>
        </div>
    )
}