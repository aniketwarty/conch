import { firebaseApp } from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { setCookie, destroyCookie } from "nookies";

export const auth = getAuth(firebaseApp);

export async function signUp(signUpEmail: string, signUpPassword: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
        const token = await userCredential.user.getIdToken();
        setCookie(null, "user_token", token, {
            expires: new Date("9999-12-31T23:59:59")
        }); //TODO: secure this
        setCookie(null, "user", JSON.stringify(userCredential.user.toJSON()), {
            expires: new Date("9999-12-31T23:59:59")
        });
        return true;
    } catch (error) {
        console.log("Error signing up: ", error);
    }
    return false;
}

export async function logIn(logInEmail: string, logInPassword: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
        const token = await userCredential.user.getIdToken();
        setCookie(null, "user_token", token, {
            expires: new Date("9999-12-31T23:59:59")
        }); //TODO: secure this
        setCookie(null, "user", JSON.stringify(userCredential.user.toJSON()), {
            expires: new Date("9999-12-31T23:59:59")
        });
        return true;
    } catch (error) {
        console.log("Error logging in: ", error);
    }
    return false;
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