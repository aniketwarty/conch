import { auth } from '../lib/firebase/firebase';

export default function Home() {
    console.log(auth.currentUser?.uid);
    return (
        <div className="bg-slate-100 px-60 py-32">
            <div className="object-center shadow-2xl rounded-lg flex p-4">
                <div className="mx-auto flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold object-center m-5"> Welcome to the home page! </p>
                </div>
            </div>
        </div>
    );
}