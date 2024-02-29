import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebase";
import { setUserTokenCookie, removeUserTokenCookie, getUserTokenCookie,  } from "../cookies";

export const auth = getAuth(firebaseApp);

export async function signUp(signUpEmail: string, signUpPassword: string) {
    await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .then((userCredential) => {
            if (userCredential.user) {
                userCredential.user.getIdToken().then((idToken) => {
                    setUserTokenCookie(idToken)
                });
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error #" + errorCode + ": " + errorMessage);
        });
        return auth.currentUser !== null;
}

export async function logIn(logInEmail: string, logInPassword: string) {
    await signInWithEmailAndPassword(auth, logInEmail, logInPassword)
        .then((userCredential) => {
            if (userCredential.user) {
                userCredential.user.getIdToken().then((idToken) => {
                    console.log("user id token: ", idToken);
                    setUserTokenCookie(idToken);
                });
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error #" + errorCode + ": " + errorMessage);
        });
    return auth.currentUser !== null;
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
    await removeUserTokenCookie();
    await auth.signOut();
}