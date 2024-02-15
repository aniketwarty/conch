import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { StudySet } from '../classes/study_set';
  
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default async function fetchStudySets() {
    const setList: StudySet[] = [];
    const studySetsRef = collection(db, `users/${auth.currentUser?.uid}/study_sets`);
    try {
        const studySetsSnapshot = await getDocs(studySetsRef);
        studySetsSnapshot.forEach((doc) => {
            const studySet = StudySet.fromFirestore(doc.id, doc.data());
            setList.push(studySet);
        });
    } catch (e) {
        console.log(e)
    }

    return setList;
};
//TODO: add on auth state changed
