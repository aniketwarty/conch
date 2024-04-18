import { collection, getDocs, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { StudySet } from "../classes/study_set";
import { defaultFlashcardOptions, defaultQuizOptions } from "../../study/default_options";
import { auth } from "./auth";

export const db = getFirestore(firebaseApp);

export async function createUserDB(uid: string) {
    try {
        const userRef = doc(db, `users/${uid}`);
        await setDoc(userRef, {dateAccountCreated: new Date(), recentSets: []});
    } catch (e) {
        console.log(e);
    }
}

export async function addToRecentSets(uid: string, studySet: string) {
    try {
        const userRef = doc(db, `users/${uid}/`);
        const userSnapshot = await getDoc(userRef);
        let recentSets = userSnapshot.data()?.recentSets;
        
        for(let i = 0; i < recentSets.length; i++) {
            if(StudySet.fromString(recentSets[i]).compare(StudySet.fromString(studySet))) {
                recentSets.splice(i, 1);
                i--;
            }
        }
        if(recentSets.length >= 5) {
            recentSets.pop();
        }
        recentSets.unshift(studySet);
        await setDoc(userRef, {recentSets: recentSets}, {merge: true});
    } catch (e) {
        console.log(e);
    }

}

export async function fetchRecentSets(uid: string) {
    try {
        const userRef = doc(db, `users/${uid}/`);
        const userSnapshot = await getDoc(userRef);
        return userSnapshot.data()?.recentSets ?? [];
    } catch (e) {
        console.log(e);
    }
    return []
}

export async function createStudySet(studySet: StudySet) {
    try {
        const setRef = doc(db, `users/${studySet.uid}/study_sets/${studySet.name}`);
        await setDoc(setRef, {terms: studySet.terms, definitions: studySet.definitions, last_studied: new Date(), shared_uids: [studySet.uid]});
    } catch (e) {
        console.log(e);
    }
}

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

export async function fetchStudySet(setUid: string, setName: string, uid: string) {
    let set = "";
    
    try {//verifying user access handled in firestore security rules
        const setRef = doc(db, `users/${setUid}/study_sets/${setName}`);
        const setSnapshot = await getDoc(setRef);
        set = (StudySet.fromFirestore(setUid, setSnapshot.id, setSnapshot.data())).toString();
    } catch (e) {
        console.log(e)
    }
    
    return set;
};

export async function updateLastStudied(studySet: StudySet) {
    try {
        const setRef = doc(db, `users/${studySet.uid}/study_sets/${studySet.name}`);
        await setDoc(setRef, {last_studied: new Date()}, {merge: true});
    } catch (e) {
        console.log(e);
    }

}

export async function fetchSharedEmails(setUid: string, setName: string) {
    const response = await fetch("http://conch.netlify.app/api/study_set/share", {
        method: "GET",
        headers: {
            setUid: setUid,
            setName: setName,
        },
    });
    return (await response.json()).shared_emails ?? [];

}

export async function shareSet(setUid: string, setName: string, sharedEmails: string[]) {
    await fetch("http://conch.netlify.app/api/study_set/share", {
        method: "POST",
        headers: {
            shared_emails: sharedEmails.join(","),
            setUid: setUid,
            setName: setName,
        },
    });
}

export async function getOptions(uid: string, studyMode: string) {
    let options: any = [];
    try {
        const optionsRef = doc(db, `users/${uid}/study_mode_options/${studyMode}`);
        const optionsSnapshot = await getDoc(optionsRef);
        options = optionsSnapshot.data();
    } catch (e) {
        console.log(e);
        switch(studyMode) {
            case "flashcards":
                options = defaultFlashcardOptions;
            case "quiz":
                options = defaultQuizOptions;
        }
    }

    if(options??[].length === 0) {
        switch(studyMode) {
            case "flashcards":
                options = defaultFlashcardOptions;
            case "quiz":
                options = defaultQuizOptions;
        }
    }
    
    return options;
}

export async function saveOptions(uid: string, options: any, studyMode: string) {
    try {
        const optionsRef = doc(db, `users/${uid}/study_mode_options/${studyMode}`);
        await setDoc(optionsRef, options);
    } catch (e) {
        console.log(e);
    }
}
