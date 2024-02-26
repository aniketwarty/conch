'use server';
import { cookies } from 'next/headers'

export async function getUserTokenCookie() {
    return cookies().get('user_token')?.value;
}

export async function setUserTokenCookie(token: string) {
    cookies().set('user_token', token, { secure: true });
}

export async function removeUserTokenCookie() {
    cookies().delete('user_token');
}