import { collection, getDocs, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { auth } from "./auth";
import { StudySet } from "../classes/study_set";

export const db = getFirestore(firebaseApp);

export async function fetchStudySets() {
    const setList: StudySet[] = [];
    const setsRef = collection(db, `users/${auth.currentUser?.uid}/study_sets`);
    try {
        const setsSnapshot = await getDocs(setsRef);
        setsSnapshot.forEach((doc) => {
            const set = StudySet.fromFirestore(auth.currentUser!.uid, doc.id, doc.data());
            setList.push(set);
        });
    } catch (e) {
        console.log(e)
    }

    return setList;
};

//TODO: change firebase rules to allow accessing friends study sets

export async function fetchStudySet(uid: string, setName: string) {
    let set: StudySet | null = null;
    
    try {
        const setRef = doc(db, `users/${uid}/study_sets/${setName}`);
        const setSnapshot = await getDoc(setRef);
        set = StudySet.fromFirestore(uid, setSnapshot.id, setSnapshot.data());
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
                return {
                    "flip_animation": true,
                };
            case "quiz":
                return {
                    "true_false": true,
                    "mcq": true,
                    "frq": false,
                    "num_questions": -1,
                }
        }
    }
}

export async function saveOptions(options: any, uid: string, studyMode: string) {
    try {
        const optionsRef = doc(db, `users/${uid}/study_mode_options/${studyMode}`);
        await setDoc(optionsRef, options);
    } catch (e) {
        console.log(e);
    }
}
