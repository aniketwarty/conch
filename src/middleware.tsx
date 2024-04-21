import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
    const session = cookies().get("session");
    if (!session) {
        console.log("No session cookie found")
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await fetch(new URL("/api/login", request.url), {
            method: "GET",
            headers: {
                Cookie: `session=${session?.value}`,
            },
        });
    } catch (error) {
        console.error('Error validating session:', error);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("middleware over")
    return NextResponse.next();
}
 
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|login).*)'
};