import admin from "firebase-admin"
import { cert } from "firebase-admin/app"

export const firebaseAdminConfig = {
    credential: cert({
        type: "service_account",
        project_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
        private_key_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY,
        client_email: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
        universe_domain: "googleapis.com"
    } as admin.ServiceAccount)
}