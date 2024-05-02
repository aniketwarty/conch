import { MultiPartQuestion } from "@/app/lib/classes/question";
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

interface QuestionGeneratorChoiceButtonProps {
    value: string;
    question: MultiPartQuestion;
    questionIndex: number;
    setQuestionList: React.Dispatch<React.SetStateAction<MultiPartQuestion[]>>;
}

export const QuestionGeneratorChoiceButton = ({value, question, questionIndex, setQuestionList}: QuestionGeneratorChoiceButtonProps) => {
    return (
        <Button className="m-2 shadow-xl w-full p-2" style={{backgroundColor: question.answer === value?"gray":"lightgray"}}
        onClick={() => {
            console.log(value, question.answer)
            if(question.answer !== value) {
                setQuestionList(prevQuestionList => {
                    return [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, answer: value} : q)] as MultiPartQuestion[];
                })
            } else {
                setQuestionList(prevQuestionList => {
                    return [...prevQuestionList.map((q, index) => index === questionIndex ? {...q, answer: ""} : q)] as MultiPartQuestion[];
                })
            }
        }}>
            <p className="m-2">{value}</p>
        </Button>
    );
}