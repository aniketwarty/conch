import { StudySet } from "../../lib/classes/study_set";

interface QuizGeneratorProps {
    studySetString: string;
    options: any;
}

export const QuizGenerator = ({studySetString, options}: QuizGeneratorProps) => {
    const studySet = StudySet.fromString(studySetString);
}