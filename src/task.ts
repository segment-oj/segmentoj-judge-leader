import axios from "axios";
import { judger_queue } from "./judger";

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
}

export class TaskAssigner {
    start() {
        setInterval(this.assign_task, 10);
    }

    assign_task() {
        if (task_queue.queue.length <= 0) {
            return;
        }

        const task: Task = task_queue.queue[0];

        for (let i = 0; i < judger_queue.queue.length; i++) {
            const judger = judger_queue.queue[i];

            if (judger.max_thread - judger.used_thread <= 0) {
                continue;
            }

            try {
                axios.post(`http://${judger.ip}/api/task`, {
                    problem: task.problem,
                    lang: task.lang,
                    lang_info: task.lang_info,
                    time_limit: task.time_limit,
                    memory_limit: task.memory_limit,
                    testdata_url: task.testdata_url,
                    code: task.code,
                })
                    .then(() => {
                        judger_queue.queue[i].used_thread++;
                        running_task_queue.push(task_queue.queue[0]);
                        task_queue.queue.splice(0, 1);
                    })
                    .catch((err) => {
                        throw err;
                    });
            } catch (err) {
                console.log(`[Judger] Cannot send task to Judger ${judger.ip} ${err.errno}`);
                continue;
            }
        }
    }
}

export let task_queue: TaskQueue = new TaskQueue();
export let running_task_queue: TaskQueue = new TaskQueue();
