import router from "next/router";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebase";

export const auth = getAuth(firebaseApp);

//TODO: add on auth state changed

export function signUp(signUpEmail: string, signUpPassword: string) {
    //TODO: add loading
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error #" + errorCode + ": " + errorMessage);
        });
    if (auth.currentUser) return true;
    return false;
}

export function logIn(logInEmail: string, logInPassword: string) {
    //TODO: add loading
    signInWithEmailAndPassword(auth, logInEmail, logInPassword)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error #" + errorCode + ": " + errorMessage);
        });
    if (auth.currentUser) return true;
    return false;
}
