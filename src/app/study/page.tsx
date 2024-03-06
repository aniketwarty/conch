import nookies from "nookies";
import { getSetString } from "../lib/util/study";
import { StudyPageDisplay } from "./StudyPageDisplay";

export default async function StudyPage({searchParams}: {searchParams: any}) {
    const setString = await getSetString(searchParams);

    return (
        <StudyPageDisplay studySetString={setString}/>
    )
}