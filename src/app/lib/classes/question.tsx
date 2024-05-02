import { StudySet } from "./study_set";

export class Question {
    question: string;
    answer: string;

    constructor(question: string, answer: string){
        this.question = question;
        this.answer = answer;
    }
}

export class TrueFalseQuestion extends Question {
    term: string;
    definition: string;

    constructor(set: StudySet, index: number, useTerm: boolean){ //TODO: handle case where set is of length 1
        const answer = Math.random() < 0.5 ? "True":"False";
        console.log(answer)
        super("", answer);
        if(answer === "True") {
            this.term = set.terms[index]
            this.definition = set.definitions[index]
        } else {
            let term = useTerm ? set.terms[index]:set.terms[Math.floor(Math.random() * set.terms.length)];
            let definition = useTerm ? set.definitions[Math.floor(Math.random() * set.definitions.length)]:set.definitions[index];
            while((useTerm && definition === set.definitions[index]) || (!useTerm && term === set.terms[index])) {
                term = useTerm ? set.terms[index]:set.terms[Math.floor(Math.random() * set.terms.length)];
                definition = useTerm ? set.definitions[Math.floor(Math.random() * set.definitions.length)]:set.definitions[index];
            }
            this.term = term;
            this.definition = definition;
        }
    }
}

export class MultipleChoiceQuestion extends Question {
    choices: string[];

    constructor(question: string, answer: string, choices: string[]){
        super(question, answer);
        this.choices = choices;
    }

    static createFromSet(set: StudySet, index: number){
        const useTerm = set.terms[index].length <= set.definitions[index].length;
        const question = useTerm ? set.definitions[index] : set.terms[index];
        const answer = useTerm ? set.terms[index] : set.definitions[index];
        let choices = [answer];
        while(choices.length < Math.min(set.terms.length, 4)) {
            const choice = useTerm ? set.terms[Math.floor(Math.random() * set.terms.length)] : set.definitions[Math.floor(Math.random() * set.definitions.length)];
            if(!choices.includes(choice)) choices.push(choice);
        }
        choices.sort(() => Math.random() - 0.5);
        return new MultipleChoiceQuestion(question, answer, choices);
    }
}

export class ShortAnswerQuestion extends Question {
    constructor(set: StudySet, index: number){
        const useTerm = set.terms[index].length <= set.definitions[index].length;
        
        const question = useTerm ? set.definitions[index] : set.terms[index];
        const answer = useTerm ? set.terms[index] : set.definitions[index];
        super(question, answer);
    }
}

export class FreeResponseQuestion extends Question {
    constructor(question: string){
        super(question, "")
    }
}

export class MultiPartQuestion extends Question {
    heading: string;
    parts: string[];
    answers: string[];
    results: string[];

    constructor(heading: string, question: string, parts: string[]){
        super(question, "")
        this.heading = heading;
        this.parts = parts;
        this.answers = Array(parts.length).fill("");
        this.results = Array(parts.length).fill("");
    }

    formatPartsForPrompt() {
        let formattedQuestion = ""
        for(let i = 0; i < this.parts.length; i++) {
            formattedQuestion += this.parts[i] + ", ";
        }
        return formattedQuestion;
    }

    formatAnswersForPrompt() {
        let formattedAnswers = ""
        for(let i = 0; i < this.answers.length; i++) {
            formattedAnswers += "(" + String.fromCharCode(97+i) + ")" + this.answers[i] + ", ";
        }
        return formattedAnswers;
    }
}