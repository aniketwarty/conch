import { firebaseApp } from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { destroyCookie } from "nookies";
import { FirebaseError } from "firebase/app";
import { createUserDB } from "./firestore";

export const auth = getAuth(firebaseApp);

export async function signUp(signUpEmail: string, signUpPassword: string) {
    let response = new Response(JSON.stringify({ error: 'Error signing up' }), { status: 500 });
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
        const token = await userCredential.user.getIdToken();
        await createUserDB(userCredential.user.uid);
        await fetch("/api/login", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((res) => {
            response = res;
        })
    } catch (error) {
        console.log(error)
        if(error instanceof FirebaseError) {
            response = new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
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
        console.log(error)
        if(error instanceof FirebaseError) {
            response = new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
    }
    return response;
}

export async function logOut() {
    destroyCookie(null, "session");
    await auth.signOut();
}