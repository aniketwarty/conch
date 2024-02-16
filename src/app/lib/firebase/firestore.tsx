import { collection, getDocs, doc, getDoc, getFirestore } from "firebase/firestore";
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
            const set = StudySet.fromFirestore(doc.id, doc.data());
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
        if (setSnapshot.exists()) {
            set = StudySet.fromFirestore(setSnapshot.id, setSnapshot.data());
        }
    } catch (e) {
        console.log(e);
    }
    
    return set;
};
