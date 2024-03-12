import { StudySet } from "./study_set";

export class Question {
    answer: string;

    constructor(answer: string){
        this.answer = answer;
    }

    static createTrueFalse(set: StudySet, index: number, useTerm: boolean) {
        const answer = Math.random() < 0.5 ? "True":"False";
        if(answer === "True") {
            return new TrueFalseQuestion(set.terms[index], set.definitions[index], answer)
        } else {
            let term = useTerm ? set.terms[index]:set.terms[Math.floor(Math.random() * set.terms.length)];
            let definition = useTerm ? set.definitions[Math.floor(Math.random() * set.definitions.length)]:set.definitions[index];
            while((useTerm && definition === set.definitions[index]) || (!useTerm && term === set.terms[index])) {
                term = useTerm ? set.terms[index]:set.terms[Math.floor(Math.random() * set.terms.length)];
                definition = useTerm ? set.definitions[Math.floor(Math.random() * set.definitions.length)]:set.definitions[index];
            }
            return new TrueFalseQuestion(term, definition, answer)
        }
    }
}

export class TrueFalseQuestion extends Question {
    term: string;
    definition: string;

    constructor(term: string, definition: string, answer: string){
        super(answer);
        this.term = term;
        this.definition = definition;
    }
}