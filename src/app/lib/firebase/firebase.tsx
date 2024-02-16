import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { StudySet } from '../classes/study_set';
  
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


