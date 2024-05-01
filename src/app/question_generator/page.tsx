"use client"
import { SetStateAction, useState } from "react";
import { Button, Checkbox, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { AccentColor1, AccentColor2, BackgroundColor } from "../colors";
import { NavBar } from "../ui/NavBar";
import { QuestionGenerator } from "./QuestionGenerator";
import { MultiPartQuestion } from "../lib/classes/question";
import { QuestionGrader } from "./QuestionGrader";

export enum QuestionGeneratorStatus {
    INITIAL,
    STARTED,
    SUBMITTED
}
//TODO: figure out how to do auth
export default function QuestionGeneratorPage() {
    const [questionGeneratorStatus, setQuestionGeneratorStatus] = useState<QuestionGeneratorStatus>(QuestionGeneratorStatus.INITIAL);
    const [topic, setTopic] = useState<string>("");
    const [useAP, setUseAP] = useState<boolean>(false);
    const [APUnits, setAPUnits] = useState<string>("");
    const [numQuestions, setNumQuestions] = useState<number>(4);
    const [useMCQ, setUseMCQ] = useState<boolean>(true);
    const [useFRQ, setUseFRQ] = useState<boolean>(true);
    const [questionList, setQuestionList] = useState<MultiPartQuestion[]>(Array(numQuestions).fill(new MultiPartQuestion("", "", [])));

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden" style={{backgroundColor: BackgroundColor}}>
            <NavBar/>
            {questionGeneratorStatus===QuestionGeneratorStatus.INITIAL && (
                <div className="flex flex-col h-5/6 w-2/5 shadow-2xl rounded-lg m-auto px-7 items-center overflow-auto" style={{backgroundColor: AccentColor2}}>
                    <p className="text-4xl font-bold mx-auto my-10 text-center">Question Generator</p>
                    <FormControl>
                        <FormLabel fontSize="sm">Topic (eg. Biology, US History, etc.)</FormLabel>
                        <Input variant={"outline"} onChange={(e) => setTopic(e.target.value)}/>
                    </FormControl>
                    <div className="flex flex-row items-center my-10 w-full">
                        <Checkbox className="mt-5 mr-4 flex-none" size={"lg"}
                        isChecked={useAP} onChange={(e) => setUseAP(e.target.checked)}>
                            AP Questions
                        </Checkbox>
                        <FormControl className="w-full">
                        <FormLabel fontSize="sm" style={{ color: useAP ? 'black' : 'gray' }}>AP Units (eg. 1-4)</FormLabel>
                            <Input variant={"outline"} placeholder="Leave empty for all units" onChange={(e) => setAPUnits(e.target.value)} disabled={!useAP}/>
                        </FormControl>
                    </div>
                    <div className="flex flex-row items-center my-5 w-full">
                        <FormControl className="">
                            <FormLabel fontSize="sm"># of Questions</FormLabel>
                            <NumberInput
                                variant={"outline"} width={"80px"} 
                                defaultValue={numQuestions} min={0} max={10}//TODO: test what the gemini max is
                                onChange={(e) => setNumQuestions(Number(e))}
                            >
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>                    
                        </FormControl>
                        <Checkbox className="mt-5 mr-10 flex-none" size={"lg"}
                        isChecked={useMCQ} onChange={(e) => setUseMCQ(e.target.checked)}
                        disabled={useMCQ && !useFRQ}>
                            Multiple Choice
                        </Checkbox>
                        <Checkbox className="mt-5 mr-6 flex-none" size={"lg"}
                        isChecked={useFRQ} onChange={(e) => setUseFRQ(e.target.checked)}
                        disabled={!useMCQ && useFRQ}>
                            Free Response
                        </Checkbox>
                    </div>
                    <Button className="mt-auto mb-5 w-full" colorScheme="blue" onClick={() => setQuestionGeneratorStatus(QuestionGeneratorStatus.STARTED)}>
                        Generate Questions
                    </Button>
                </div>
            )}
            {questionGeneratorStatus===QuestionGeneratorStatus.STARTED && (
                <QuestionGenerator topic={topic} useAP={useAP} APUnits={APUnits} numQuestions={numQuestions} useMCQ={useMCQ} useFRQ={useFRQ} 
                questionList={questionList} setQuestionList={setQuestionList} setQuestionGeneratorStatus={setQuestionGeneratorStatus}/>
            )}
            {questionGeneratorStatus===QuestionGeneratorStatus.SUBMITTED && (
                <QuestionGrader useAP={useAP} questionList={questionList} setQuestionGeneratorStatus={setQuestionGeneratorStatus}/>
            )}
        </div>
    )
}