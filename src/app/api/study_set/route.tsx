import { StudySet } from "@/app/lib/classes/study_set";
import { admin } from "../../lib/firebase/admin";
import { addToRecentSets, fetchStudySet, shareSet, shareSetWithUids, updateLastStudied } from "../../lib/firebase/firestore";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const headerStore = headers();
    const setUid = headerStore.get("setUid") || "";
    const setName = headerStore.get("setName") || "";
    const shared_emails = headerStore.get("shared_emails")?.split(",") || [];
    console.log("shared emails", shared_emails)
    const shared_uids = [];
    for (const email of shared_emails) {
        try {
            if(email !== "") shared_uids.push((await admin.getUserByEmail(email)).uid);
        } catch (error) {
            console.log(`Failed to get user with email ${email}: ${error}`);
        }
    }

    try {
        await shareSetWithUids(setUid, setName, shared_uids);
        return NextResponse.json({}, { status: 200 });
    } catch (e) {
        console.log(e);
    }
    return NextResponse.json({}, { status: 500 });
}

export async function GET(request: NextRequest) {
    //TODO: move set verification here
    const cookieStore = cookies();
    const headerStore = headers();
    const setCookie = cookieStore.get("set")?.value || "";
    const uid = headerStore.get("uid") ?? ""
    const setUid = headerStore.get("setUid") ?? ""
    const setName = headerStore.get("setName") ?? ""

    if(setCookie!=="") return NextResponse.json({setString: decodeURIComponent(setCookie)}, {status: 200});

    if(setUid==="" || setName==="") return NextResponse.redirect(new URL("/home", request.url))

    const setString = await fetchStudySet(setUid, setName, uid);
    if(setString!=="") {
        cookieStore.set({//TODO: fix this (cookie getting set on server side but not visible client side)
            name: "set",
            value: "value",
            maxAge: 1000 * 60 * 60 * 24 * 14,
            // PROD: change httpOnly: true,
            // secure: true,
        });

        await updateLastStudied(StudySet.fromString(setString));
        await addToRecentSets(uid, setString);
        return NextResponse.json({setString: setString}, {status: 200});
    }

    return NextResponse.redirect(new URL("/home", request.url))
}