import { get } from "http";
import { getFormattedDate } from "../util";

export class StudySet {
    name: string;
    terms: string[];
    definitions: string[];
    last_studied: Date;
    uid: string;

    constructor(name: string, terms: string[], definitions: string[], last_studied: Date, uid: string){
        this.name = name;
        this.terms = terms;
        this.definitions = definitions;
        this.last_studied = last_studied;
        this.uid = uid;
    }

    add(term: string, definition: string){
        return new StudySet(this.name, [...this.terms, term], [...this.definitions, definition], this.last_studied, this.uid);
    }

    changeName(newName: string){
        this.name = newName;
        return this;
    }

    changeTerm(index: number, newTerm: string) {
        this.terms[index] = newTerm;
        return this;
    }

    changeDefinition(index: number, newDefinition: string) {
        this.definitions[index] = newDefinition;
        return this;
    }

    remove(index: number) {
        return new StudySet(this.name, this.terms.filter((_, i) => i !== index), this.definitions.filter((_, i) => i !== index), this.last_studied, this.uid);
    }

    removeEmptyTerms() {
        for (let i = this.terms.length - 1; i >= 0; i--) {
            if (this.terms[i] === "" || this.definitions[i] === "") {
                this.terms.splice(i, 1);
                this.definitions.splice(i, 1);
            }
        }
        return this;
    }
    

    updateLaststudied() {
        this.last_studied = new Date(Date.now());
        return this;
    }

    shuffle() {
        const shuffledTerms = [...this.terms];
        const shuffledDefinitions = [...this.definitions];

        for (let i = shuffledTerms.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTerms[i], shuffledTerms[j]] = [shuffledTerms[j], shuffledTerms[i]];
            [shuffledDefinitions[i], shuffledDefinitions[j]] = [shuffledDefinitions[j], shuffledDefinitions[i]];
        }

        return new StudySet(this.name, shuffledTerms, shuffledDefinitions, this.last_studied, this.uid);
    }

    compare(other: StudySet) {
        return this.name === other.name && this.uid === other.uid;
    }

    static fromFirestore(uid: string, name: string, data: any){
        return new StudySet(name, data.terms, data.definitions, data.last_studied.toDate(), uid);
    }

    static fromString(str: string){
        try {
            const data = JSON.parse(str);
            return new StudySet(data.name, data.terms, data.definitions, new Date(data.last_studied), data.uid);
        } catch(e){
            console.log(e);
            return new StudySet("", [], [], new Date(), "");
        }
    }

    toString(){
        return JSON.stringify({
            name: this.name,
            terms: this.terms,
            definitions: this.definitions,
            last_studied: this.last_studied,
            uid: this.uid,
        });
    }
}