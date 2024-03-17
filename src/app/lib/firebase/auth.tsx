import { firebaseApp } from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { destroyCookie } from "nookies";

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

export async function logOut() {
    destroyCookie(null, "session");
    await auth.signOut();
}