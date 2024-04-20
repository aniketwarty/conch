"use server"
import { redirect } from "next/navigation";

export async function getAuth() {
    const response = await fetch("http://localhost:3000/api/login", {//PROD: change to production URL
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json",
        }
    })

    if(!response.ok) redirect("/login");
    const responseJson = await response.json();
    console.log("responseJson: ", responseJson)
    return responseJson;
}