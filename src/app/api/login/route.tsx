import { admin } from "../../lib/firebase/admin";
import { cookies, headers } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextApiRequest, response: NextApiResponse) {
    const authorization = request.headers.authorization;
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
                httpOnly: true,
                // secure: true,
            });

            response.setHeader('Set-Cookie', `session=${sessionCookie}; Max-Age=${expiresIn}; HttpOnly; Path=/;`);
            return response.status(200).json({token: await admin.createCustomToken(decodedToken.uid)});
        }
        return response.status(401).json({});
    }

    
}

export async function GET(request: NextRequest) {
    const s = cookies().get("session")?.value || "";
    try {
        const session = cookies().get("session")?.value || "";
        console.log("session", session)
        const uid = (await admin.verifySessionCookie(session)).uid;
        const token = await admin.createCustomToken(uid)
        console.log("success")
        return NextResponse.json({ token: token, uid: uid }, { status: 200 });
    } catch (error) {
        console.error("session", s, "Error getting uid: ", error);
    }
    return NextResponse.redirect(new URL("/login", request.url));//TODO: fix this (same issue as study)
}