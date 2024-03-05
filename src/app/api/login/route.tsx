import { auth } from "firebase-admin";
import { initializeAdmin } from "../../lib/firebase/admin";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

initializeAdmin();

export async function POST(request: NextRequest, response: NextResponse) {
    const authorization = headers().get("Authorization");
    if (authorization?.startsWith("Bearer ")) {
        const idToken = authorization.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(idToken);

        if (decodedToken) {
            //Generate session cookie
            const cookieStore = cookies();
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            const sessionCookie = await auth().createSessionCookie(idToken, {
                expiresIn,
            });
            cookieStore.set({
                name: "session",
                value: sessionCookie,
                maxAge: expiresIn,
                // TODO: change httpOnly: true,
                // secure: true,
            });

            const uid = decodedToken.uid
            cookieStore.set({
                name: "uid",
                value: uid,
                maxAge: expiresIn,
            });
        }
    }

    return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const session = cookieStore.get("session")?.value || "";
    const uid = cookieStore.get("uid")?.value || "";

    //Validate if the cookie exist in the request
    if (!session) {
        return NextResponse.json({ uid: "" }, { status: 401 });
    }
  
    //Use Firebase Admin to validate the session cookie
    const decodedClaims = await auth().verifySessionCookie(session, true);
  
    if (!decodedClaims) {
        return NextResponse.json({ uid: "" }, { status: 401 });
    }

    return NextResponse.json({ uid: uid }, { status: 200 });
  }