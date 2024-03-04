import { cookies } from "next/headers";

export async function getAuthCookies() {
    const cookieStore = cookies()
    const user = JSON.parse(cookieStore.get('user')?.value ?? "{}" as string)
    const token = cookieStore.get('user_token')?.value
    return { user, token };
}

export async function getStudySetCookie() {
    return cookies().get('study_set');
}

export async function setStudySetCookie(set: string) {
    cookies().set('study_set', set);
}