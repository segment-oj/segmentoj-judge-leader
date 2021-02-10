export class Task {
    constructor(data) {
        this.id = data.id;
        this.code = data.code;
        this.lang = data.lang;
        this.lang_info = data.lang_info;
        this.problem = data.problem;
    }

    id: number
    code: string
    lang: number
    lang_info: string
    problem: number
};
