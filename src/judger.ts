export class Judger {
    constructor(uid: number, ip: string, max_parallel: number) {
        this.uid = uid;
        this.ip = ip;
        this.max_parallel = max_parallel;
    }

    uid: number;
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