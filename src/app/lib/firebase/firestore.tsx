import { collection, getDocs, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import firebase from "firebase/auth";
import { StudySet } from "../classes/study_set";
import { defaultFlashcardOptions, defaultQuizOptions } from "../../study/default_options";

export const db = getFirestore(firebaseApp);

export async function fetchStudySets(uid: string) {
    const setList: string[] = [];
    const setsRef = collection(db, `users/${uid}/study_sets`);
    try {
        const setsSnapshot = await getDocs(setsRef);
        setsSnapshot.forEach((doc) => {
            const set = StudySet.fromFirestore(uid, doc.id, doc.data()).toString();
            setList.push(set);
        });
    } catch (e) {
        console.log(e)
    }

    return setList;
};

//TODO: change firebase rules to allow accessing friends study sets

export async function fetchStudySet(uid: string, setName: string) {
    let set: string | null = null;
    
    try {
        const setRef = doc(db, `users/${uid}/study_sets/${setName}`);
        const setSnapshot = await getDoc(setRef);
        set = StudySet.fromFirestore(uid, setSnapshot.id, setSnapshot.data()).toString();
    } catch (e) {
        console.log(e);
    }
    
    return set;
};

export async function updateLastStudied(uid: string, studySet: StudySet) {
    try {
        const setRef = doc(db, `users/${uid}/study_sets/${studySet.name}`);
        await setDoc(setRef, {terms: studySet.terms, definitions: studySet.definitions, last_studied: new Date()});
    } catch (e) {
        console.log(e);
    }

}

export async function getOptions(uid: string, studyMode: string) {
    let options: any = [];

    try {
        const optionsRef = doc(db, `users/${uid}/study_mode_options/${studyMode}`);
        const optionsSnapshot = await getDoc(optionsRef);
        options = optionsSnapshot.data();
    } catch (e) {
        console.log(e);
    }

    if(options) {
        return options;
    } else {
        switch(studyMode) {
            case "flashcards":
                return defaultFlashcardOptions;
            case "quiz":
                return defaultQuizOptions;
        }
    }
}

export async function saveOptions(user: firebase.User, options: any, studyMode: string) {
    try {
        const optionsRef = doc(db, `users/${user.uid}/study_mode_options/${studyMode}`);
        await setDoc(optionsRef, options);
    } catch (e) {
        console.log(e);
    }
}
