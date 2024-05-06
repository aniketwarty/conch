import { admin } from "../../lib/firebase/admin";
import { addToRecentSets, db, fetchStudySet, updateLastStudied } from "../../lib/firebase/firestore";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { StudySet } from "@/app/lib/classes/study_set";

export async function GET(request: NextRequest) {
    //TODO: move set verification here
    const cookieStore = cookies();
    const headerStore = headers();
    const setCookie = cookieStore.get("set")?.value || "";
    const uid = headerStore.get("uid") ?? ""
    const setUid = headerStore.get("setUid") ?? ""
    const setName = headerStore.get("setName") ?? ""

    if(setCookie!=="") return NextResponse.json({setString: decodeURIComponent(setCookie)}, {status: 200});

    if(setUid==="" || setName==="") return NextResponse.redirect(new URL("/home", request.url)) //TODO: change to json response

    const setString = await fetchStudySet(setUid, setName, uid);
    if(setString!=="") {
        cookieStore.set({//TODO: fix this (cookie getting set on server side but not visible client side)
            name: "set",
            value: "value",
            maxAge: 1000 * 60 * 60 * 24 * 14,
        });

        await updateLastStudied(StudySet.fromString(setString));
        await addToRecentSets(uid, StudySet.fromString(setString));
        return NextResponse.json({setString: setString}, {status: 200});
    }

    return NextResponse.redirect(new URL("/home", request.url))
}