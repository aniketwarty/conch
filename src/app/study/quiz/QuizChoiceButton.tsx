import { Button } from "@chakra-ui/react";

interface QuizChoiceButtonProps {
    option: string;
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
    prefix?: string;
    stretch?: boolean;
}

export const QuizChoiceButton = ({option, answers, setAnswers, index, prefix, stretch}: QuizChoiceButtonProps) => {
    return (
        <Button className={`m-2 shadow-xl ${stretch ? ' w-full' : ''}`} style={{backgroundColor: answers[index]===option?"lightgray":""}}
        onClick={() => {
            if(answers[index] === option) setAnswers({...answers, [index]: ""});
            else setAnswers({...answers, [index]: option});
        }}>
            <p>{prefix ? `${prefix}. ${option}` : option}</p>
        </Button>
    );
}