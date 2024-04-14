import { collection, getDocs, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { StudySet } from "../classes/study_set";
import { defaultFlashcardOptions, defaultQuizOptions } from "../../study/default_options";

export const db = getFirestore(firebaseApp);

export async function createUserDB(uid: string) {
    try {
        const userRef = doc(db, `users/${uid}`);
        await setDoc(userRef, {dateAccountCreated: new Date()});
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
        console.log(recentSets);
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

//TODO: change firebase rules to allow accessing friends study sets

export async function fetchStudySet(setUid: string, setName: string, uid: string) {
    let set = "";
    
    try {//verifying user access handled in firestore security rules
        const setRef = doc(db, `users/${setUid}/study_sets/${setName}`);
        const setSnapshot = await getDoc(setRef);
        set = (StudySet.fromFirestore(setUid, setSnapshot.id, setSnapshot.data())).toString();
    } catch (e) {
        console.log(e);
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

export async function shareSet(setUid: string, setName: string, sharedEmails: string[]) {
    await fetch("http://localhost:3000/api/study_set", {
        method: "POST",
        headers: {
            shared_emails: sharedEmails.join(","),
            setUid: setUid,
            setName: setName,
        },
    });
}

export async function shareSetWithUids(setUid: string, setName: string, sharedUids: string[]) {
    try {
        const setRef = doc(db, `users/${setUid}/study_sets/${setName}`);
        const oldSharedUids = (await getDoc(setRef)).data()?.shared_uids;
        await setDoc(setRef, {shared_uids: [...oldSharedUids, ...sharedUids]}, {merge: true});
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
