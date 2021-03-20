export class Task {
    constructor(data) {
        this.id = data.id;
        this.code = data.code;
        this.lang = data.lang;
        this.lang_info = data.lang_info;
        this.problem = data.problem;
        this.time_limit = data.time_limit;
        this.memory_limit = data.memory_limit;
        this.testdata_url = data.testdata_url;
        this.testdata_last_update = data.testdata_last_update;
    }

    id: number;
    code: string;
    lang: number;
    lang_info: string;
    problem: number;
    time_limit: number;
    memory_limit: number;
    testdata_url: string;
    testdata_last_update: string;
};

export class TaskQueue {
    constructor() {
        this.queue = new Array<Task>();
    }

    queue: Array<Task>;

    push(task: Task) {
        this.queue.push(task);
    }

    // function assigner() {
    //     setInterval 
    // }
}
