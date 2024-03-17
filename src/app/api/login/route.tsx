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
            const cookieStore = cookies();
            const expiresIn = 60 * 60 * 24 * 30;
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

            return NextResponse.json({}, { status: 200 });
        }
        return NextResponse.json({}, { status: 401 });
    }

    
}

export async function GET(request: NextRequest) {
    let response = NextResponse.json({}, { status: 401 });
    try {
        const session = cookies().get("session")?.value || "";
        const uid = (await auth().verifySessionCookie(session)).uid;
        response = NextResponse.json({ uid: uid }, { status: 200 });
    } catch (error) {
        console.error("Error getting uid: ", error);
    }
    return response;
}