export class Task {
    constructor(id: number, code: string, lang: number, lang_info: string) {
        this.id = id;
        this.code = code;
        this.lang = lang;
        this.lang_info = lang_info;
    }

    id: number
    code: string
    lang: number
    lang_info: string
};
