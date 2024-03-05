import { firebaseApp } from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { parseCookies, setCookie, destroyCookie } from "nookies";

export const auth = getAuth(firebaseApp);

export async function signUp(signUpEmail: string, signUpPassword: string) {
    let response = {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error logging in' }),
    } as unknown as Response;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
        const token = await userCredential.user.getIdToken();
        await fetch("/api/login", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((res) => {
            response = res;
        })
    } catch (error) {
        console.log("Error logging in: ", error);
    }
    return response;
}

export async function logIn(logInEmail: string, logInPassword: string) {
    let response = {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error logging in' }),
    } as unknown as Response;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
        const token = await userCredential.user.getIdToken();
        await fetch("/api/login", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((res) => {
            response = res;
        })
    } catch (error) {
        console.log("Error logging in: ", error);
    }
    return response;
}

export async function signInWithIdToken(idToken: string) {
    await signInWithCustomToken(auth, idToken)
        .catch((error) => {
            console.log("Error signing in with token: ", idToken);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error #" + errorCode + ": " + errorMessage);
        })
    return auth.currentUser !== null;
}

export async function logOut() {
    destroyCookie(null, "user_token");
    destroyCookie(null, "user");
    await auth.signOut();
}

export async function getUserCookie() {
    return JSON.parse(parseCookies()?.user ?? "{}");
}