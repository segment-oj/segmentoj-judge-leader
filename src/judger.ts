export class Judger {
    constructor(ip: string, max_parallel: number) {
        this.ip = ip;
        this.max_parallel = max_parallel;
    }

    ip: string;
    max_parallel: number;
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