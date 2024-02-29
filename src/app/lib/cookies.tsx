'use server';
import { cookies } from 'next/headers'

const cookieStore = cookies();

export async function getUserTokenCookie() {
    return cookieStore.get('user_token')?.value;
}

export async function setUserTokenCookie(token: string) {
    await cookieStore.set('user_token', token);
}

export async function removeUserTokenCookie() {
    cookieStore.delete('user_token');
}

//TODO: encrypt the token