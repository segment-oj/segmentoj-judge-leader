import { Task } from './task';
import axios from 'axios';

export class DataServer {
    constructor(ip: string) {
        this.ip = ip;
    }

    ip: string
    
    async check_data(pid: number) {
        let res: boolean = false;

        await axios.get(`${this.ip}/api/data/${pid}`)
        .then(res => {
            res = res.data.res;
        });

        return res;
    }
}

export class DataServerQueue {
    constructor() {
        this.queue = new Array<DataServer>();
    }

    queue: Array<DataServer>;

    push(task: DataServer) {
        this.queue.push(task);
    }

    get_latest_data(task: Task): string {
        let found: string = '';

        for (let server of this.queue) {
            if (found.length == 0) {
                axios.get(`${server.ip}/api/data/${task.problem}`)
                .then(res => {
                    if (res.data.res.testdata_last_update == task.testdata_last_update) {
                        found = server.ip;
                    }
                })
                .catch(() => {});
            }
        }

        return found;
    }
}
