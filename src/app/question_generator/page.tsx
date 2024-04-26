"use client"
import { BackgroundColor } from "../colors";
import { NavBar } from "../ui/NavBar";

export default function QuestionGenerator() {
    return (
        <div className="h-full w-screen flex flex-col" style={{backgroundColor: BackgroundColor}}>
            <NavBar/>
        </div>
    )
}