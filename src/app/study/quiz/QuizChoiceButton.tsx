import { Box, Button } from "@chakra-ui/react";

interface QuizChoiceButtonProps {
    value: string;
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
    prefix?: string;
    stretch?: boolean;
}

export const QuizChoiceButton = ({value, answers, setAnswers, index, prefix, stretch}: QuizChoiceButtonProps) => {
    return (
        <Button key={index} className={`m-2 shadow-xl ${stretch ? ' w-full' : ''}`} style={{backgroundColor: answers[index]===value?"lightgray":""}}
        onClick={() => {
            if(answers[index] === value) setAnswers({...answers, [index]: ""});
            else setAnswers({...answers, [index]: value});
        }}>
            <p>{prefix ? `${prefix}. ${value}` : value}</p>
        </Button>
    );
}

interface GradedQuizChoiceButtonProps {
    value: string;
    color: string;
    prefix?: string;
    stretch?: boolean;
}

export const GradedQuizChoiceButton = ({value, color, prefix, stretch}: GradedQuizChoiceButtonProps) => {
    return (
        <Box className={`bg-slate-200 m-2 p-2 border-2 rounded-md shadow-xl ${stretch ? ' w-full' : ''}`} borderColor={color}> 
            <p className="text-center font-semibold">{prefix ? `${prefix}. ${value}` : value}</p>
        </Box>
    );
}