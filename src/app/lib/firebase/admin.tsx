import { auth } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';
import { firebaseAdminConfig } from './admin_config';

if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
}

export const admin = auth()

