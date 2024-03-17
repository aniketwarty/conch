import { initializeApp, getApps } from 'firebase-admin/app';
import { firebaseAdminConfig } from './admin_config';

export function initializeAdmin() {
    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}