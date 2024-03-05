import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { firebaseAdminConfig } from './admin-config';

export function initializeAdmin() {
    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}