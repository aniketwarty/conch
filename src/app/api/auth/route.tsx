import { admin } from "../../lib/firebase/admin";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "nookies";

export async function POST(request: NextRequest, response: NextResponse) {
    const authorization = headers().get("Authorization");
    if (authorization?.startsWith("Bearer ")) {
        const idToken = authorization.split("Bearer ")[1];
        const decodedToken = await admin.verifyIdToken(idToken);

        if (decodedToken) {
            const cookieStore = cookies();
            const expiresIn = 1000 * 60 * 60 * 24 * 14;
            const sessionCookie = await admin.createSessionCookie(idToken, {
                expiresIn,
            });

            cookieStore.set({
                name: "session",
                value: sessionCookie,
                maxAge: expiresIn,
                // PROD: change httpOnly: true,
                // secure: true,
            });

            return NextResponse.json({token: await admin.createCustomToken(decodedToken.uid)}, {status: 200});
        }
        return NextResponse.json({}, { status: 401 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = cookies().get("session")?.value || "none";
        console.log("session", session)
        const uid = (await admin.verifySessionCookie(session)).uid;
        const token = await admin.createCustomToken(uid)
        return NextResponse.json({ token: token, uid: uid }, { status: 200 });
    } catch (error) {
        console.error("Error getting uid: ", error);
    }
    return NextResponse.json({}, {status: 500});//TODO: fix this (same issue as study)
}