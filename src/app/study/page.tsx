import { handleAuthRedirect } from "../lib/firebase/auth";
import { getSetString } from "../lib/util/study";
import { StudyPageDisplay } from "./StudyPageDisplay";

export default async function StudyPage({searchParams}: {searchParams: any}) {
    await handleAuthRedirect();
    const setString = await getSetString(searchParams);
    
    return (
        <StudyPageDisplay studySetString={setString}/>
    )
}