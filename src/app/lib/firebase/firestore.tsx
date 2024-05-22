import { collection, getDocs, doc, getDoc, getFirestore, setDoc, deleteDoc } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { StudySet } from "../classes/study_set";
import { defaultFlashcardOptions, defaultQuizOptions } from "../../study/default_options";
import { SharedSet } from "@/app/shared_sets/SharedSetsPageDisplay";

export const db = getFirestore(firebaseApp);

// Creating users
export async function createUserDB(uid: string) {
    try {
        const userRef = doc(db, `users/${uid}`);
        await setDoc(userRef, {dateAccountCreated: new Date(), recentSets: []});
    } catch (e) {
        console.log(e);
    }
}

// Modifying sets
export async function createStudySet(studySet: StudySet) {
    try {
        const setRef = doc(db, `users/${studySet.uid}/study_sets/${studySet.name}`);
        await setDoc(setRef, {terms: studySet.terms, definitions: studySet.definitions, last_studied: new Date(), shared_uids: [studySet.uid]});
    } catch (e) {
        console.log(e);
    }
}

export async function updateSet(studySet: StudySet) {
    try {
        const setRef = doc(db, `users/${studySet.uid}/study_sets/${studySet.name}`);
        await setDoc(setRef, {terms: studySet.terms, definitions: studySet.definitions}, {merge: true});
    } catch (e) {
        console.log(e);
    }

}

export async function deleteSet(setUid: string, setName: string) {
    try {
        const setRef = doc(db, `users/${setUid}/study_sets/${setName}`);
        await deleteDoc(setRef);
    } catch (e) {
        console.log(e);
    }

}

export async function updateLastStudied(studySet: StudySet) {
    try {
        const setRef = doc(db, `users/${studySet.uid}/study_sets/${studySet.name}`);
        await setDoc(setRef, {last_studied: new Date()}, {merge: true});
    } catch (e) {
        console.log(e);
    }

}

// Fetching sets
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

// Recent sets
export async function addToRecentSets(uid: string, studySet: StudySet) {
    try {//TODO: fic dupes
        const userRef = doc(db, `users/${uid}/`);
        const userSnapshot = await getDoc(userRef);
        const seen = new Set();
        let recentSets = userSnapshot.data()?.recentSets??[]
        recentSets.unshift({setUid: studySet.uid, setName: studySet.name, numTerms: (studySet.terms??[]).length, lastViewed: new Date().toISOString()});
        recentSets = recentSets.filter((item: SharedSet) => {
            const key = `${item.setUid}-${item.setName}`;
            console.log(key)
            const isDupe = seen.has(key);
            seen.add(key);
            return !isDupe;
        });
        
        if(recentSets.length >= 5) {
            recentSets.pop();
        }
        console.log(recentSets)
        await setDoc(userRef, {recentSets: recentSets}, {merge: true});
    } catch (e) {
        console.log(e);
    }

}
//TODO: make recent set storage based on setUid and name
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

// Sharing sets
export async function shareSet(setUid: string, setName: string, uid: string, sharedEmails: string[], numTerms: number) {
    await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/study_set/share", {
        method: "POST",
        headers: {
            shared_emails: sharedEmails.join(","),
            setUid: setUid,
            setName: setName,
            uid: uid,
            numTerms: numTerms.toString(),
        },
    });
}

export async function fetchSharedEmails(setUid: string, setName: string) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/study_set/share", {
        method: "GET",
        headers: {
            setUid: setUid,
            setName: setName,
        },
    });
    return (await response.json()).shared_emails ?? [];

}

// Fetching shared sets
export async function fetchSetsSharedWithYou(uid: string) {
    try {
        const userRef = doc(db, `users/${uid}/`);
        const userSnapshot = await getDoc(userRef);
        const seen = new Set();
        const setsSharedWithYou = (userSnapshot.data()?.setsSharedWithYou ?? []).filter((item: SharedSet) => {
            const key = `${item.setUid}-${item.setName}`;
            const isDupe = seen.has(key);
            seen.add(key);
            return !isDupe;
        });
        await setDoc(userRef, {setsSharedWithYou: setsSharedWithYou}, {merge: true});
        return setsSharedWithYou;
    } catch (e) {
        console.log(e);
    }
    return []
}

export async function fetchRecentlySharedSets(uid: string) {
    try {
        const userRef = doc(db, `users/${uid}/`);
        const userSnapshot = await getDoc(userRef);
        const seen = new Set();
        const recentlySharedSets = (userSnapshot.data()?.recentlySharedSets ?? []).filter((item: SharedSet) => {
            const key = `${item.setUid}-${item.setName}`;
            const isDupe = seen.has(key);
            seen.add(key);
            return !isDupe;
        });
        await setDoc(userRef, {recentlySharedSets: recentlySharedSets}, {merge: true});
        return recentlySharedSets;
    } catch (e) {
        console.log(e);
    }
    return []
}

// Study mode options
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
