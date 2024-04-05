import { redirect } from 'next/navigation';

export default async function Main() {
    redirect("/home");
};

//TODO: move server fetching to useEffect and replace with blank data to make page load faster?