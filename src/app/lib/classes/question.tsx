import { StudySet } from "./study_set";

export class Question {
    answer: string;

    constructor(answer: string){
        this.answer = answer;
    }
}

export class TrueFalseQuestion extends Question {
    term: string;
    definition: string;

    constructor(set: StudySet, index: number, useTerm: boolean){ //TODO: handle case where set is of length 1
        const ans = Math.random() < 0.5 ? "True":"False";
        super(ans);
        if(ans === "True") {
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
    question: string;
    choices: string[];

    constructor(set: StudySet, index: number){
        const useTerm = set.terms[index].length <= set.definitions[index].length;
        const ans = useTerm ? set.terms[index] : set.definitions[index];
        super(ans);
        this.question = useTerm ? set.definitions[index] : set.terms[index];
        this.choices = [ans];
        while(this.choices.length < Math.min(set.terms.length, 4)) {
            const choice = useTerm ? set.terms[Math.floor(Math.random() * set.terms.length)] : set.definitions[Math.floor(Math.random() * set.definitions.length)];
            if(!this.choices.includes(choice)) this.choices.push(choice);
        }
        this.choices.sort(() => Math.random() - 0.5);
    }
}