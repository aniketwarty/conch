export class StudySet{
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
        this.terms.push(term);
        this.definitions.push(definition);
    }

    updateLaststudied(){
        this.last_studied = new Date(Date.now());
    }

    getFormattedLastStudied(): string {
        const now = new Date();
        const diff = now.getTime() - this.last_studied.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 30) {
            return `${days} days ago`;
        } else if (months < 12) {
            return `${months} months ago`;
        } else {
            return `${years} years ago`;
        }
    }

    static fromFirestore(uid: string, name: string, data: any){
        return new StudySet(name, data.terms, data.definitions, data.last_studied.toDate(), uid);
    }

    toFirestore(){
        return {
            name: this.name,
            terms: this.terms,
            definitions: this.definitions,
            last_studied: this.last_studied
        }
    }
}