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

    find(ip: string): boolean {
        for (let server of this.queue) {
            if (server.ip == ip) {
                return true;
            }
        }

        return false;
    }

    edit(ip: string, new_data: Judger) {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].ip == ip) {
                this.queue[i] = new_data;
                return;
            }
        }

        throw "Judger not found";
    }
}

export let judger_queue: JudgerQueue = new JudgerQueue();
