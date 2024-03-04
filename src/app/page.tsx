import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Main() {
    const token = cookies().get('user_token');

    if(token) redirect("/home");
    else redirect("/log_in");
};