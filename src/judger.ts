export class Judger {
    constructor(ip: string, max_thread: number, used_thread: number) {
        this.ip = ip;
        this.max_thread = max_thread;
        this.used_thread = used_thread;
    }

    ip: string;
    max_thread: number;
    used_thread: number;
}

export class JudgerQueue {
    constructor() {
        this.queue = new Array<Judger>();
    }

    queue: Array<Judger>;

    push(server: Judger) {
        this.queue.push(server);
    }
}

export let judger_queue: JudgerQueue = new JudgerQueue();
