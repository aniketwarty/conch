import { admin } from "@/app/lib/firebase/admin";
import { db } from "@/app/lib/firebase/firestore";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const headerStore = headers();
    const setUid = headerStore.get("setUid") || "";
    const setName = headerStore.get("setName") || "";
    const uid = headerStore.get("uid") || "";
    const numTerms = headerStore.get("numTerms") || 0;
    const shared_emails = headerStore.get("shared_emails")?.split(",") || [];
    const sharedUids = [];
    for (const email of shared_emails) {
        try {
            if(email !== "") sharedUids.push((await admin.getUserByEmail(email)).uid);
        } catch (error) {
            console.log(`Failed to get user with email ${email}: ${error}`);
        }
    }

    try {
        const setRef = doc(db, `users/${setUid}/study_sets/${setName}`);
        await setDoc(setRef, {shared_uids: sharedUids}, {merge: true});

        const email = (await admin.getUser(uid)).email;
        const set = {setUid: setUid, setName: setName, email: email, numTerms: numTerms, shareDate: new Date().toISOString()}
        for (const sharedUid of sharedUids) {
            const sharedUserRef = doc(db, `users/${sharedUid}/`);
            if(sharedUid !== uid) await setDoc(sharedUserRef, {setsSharedWithYou: arrayUnion(set)}, {merge: true});
        }

        const userRef = doc(db, `users/${uid}/`);
        await setDoc(userRef, {recentlySharedSets: arrayUnion(set)}, {merge: true});

        return NextResponse.json({}, { status: 200 });
    } catch (e) {
        console.log(e);
    }
    return NextResponse.json({}, { status: 500 });
}

export async function GET(request: NextRequest) {
    const headerStore = headers();
    const setUid = headerStore.get("setUid") || "";
    const setName = headerStore.get("setName") || "";
    try {
        const setRef = doc(db, `users/${setUid}/study_sets/${setName}`);
        const sharedUids = (await getDoc(setRef)).data()?.shared_uids || [];
        const sharedEmails = [];
        for (const uid of sharedUids) {
            try {
                sharedEmails.push((await admin.getUser(uid)).email);
            } catch (error) {
                console.log(`Failed to get user with uid ${uid}: ${error}`);
            }
        }
        return NextResponse.json({shared_emails: sharedEmails}, { status: 200 });
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({}, { status: 500 });
}