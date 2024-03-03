import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { firebaseApp } from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { redirect } from "next/dist/server/api-utils";

export const auth = getAuth(firebaseApp);

export async function signUp(signUpEmail: string, signUpPassword: string) {
    await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .then((userCredential) => {
            if (userCredential.user) {
                userCredential.user.getIdToken().then((idToken) => {
                    setCookie(null, "user_token", idToken, {}); //TODO: add http only
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
                    setCookie(null, "user_token", idToken, {}); //TODO: add http only
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
    destroyCookie(null, "user_token");
    await auth.signOut();
}

export async function getAuthProps(context: GetServerSidePropsContext) {
    const user = auth.currentUser;
    if(user) {
        console.log("logged in");
        return {
            props: {
                user: user,
            }
        }
    }

    const token = parseCookies(context).user_token;
    if(token) {
        console.log("token found")
        try {
            const user = await signInWithIdToken(token);
            return {
                user: user,
            }
        
        } catch (error) {
            console.log("Error getting user: ", error);
            return {
                user: null,
            }
        }
    }

    console.log("no user or token found");
    return {
        redirect: "/login"
    };
}