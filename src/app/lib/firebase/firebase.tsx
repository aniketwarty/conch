import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from "./config";
  
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


