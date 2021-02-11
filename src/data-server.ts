import { Task } from './task';
import axios from 'axios';
import { copyFileSync } from 'fs';

export class DataServer {
    constructor(ip: string) {
        this.ip = ip;
    }

    ip: string
    
    async check_data(pid: number) {
        let res: boolean = false;

        await axios.get(`${this.ip}/api/data/${pid}`)
        .then(ret => {
            res = ret.data.res;
        })
        .catch(() => {
            console.log(`[Data Server] check data Err on server ${this.ip}`);
        });

        return res;
    }

    async get_disk_capacity() {
        let res: number = 0;

        await axios.get(`${this.ip}/api/capacity`)
        .then(ret => {
            res = ret.data.res;
        })
        .catch(() => {
            console.log(`[Data Server] check capacity Err on server ${this.ip}`);
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

    async get_latest_data(task: Task) {
        let found_ip: string = '';

        for (let server of this.queue) {
            if (found_ip.length == 0) {
                await axios.get(`${server.ip}/api/data/${task.problem}`)
                .then(res => {
                    if (res.data.res.testdata_last_update == task.testdata_last_update) {
                        found_ip = server.ip;
                    }
                })
                .catch(() => {});
            } else {
                break;
            }
        }

        return found_ip;
    }

    async get_max_storage() {
        let max: number = -Infinity;
        let max_ip: string = '';

        for (let server of this.queue) {
            let capacity: number = await server.get_disk_capacity();
            if (capacity > max) {
                max = capacity;
                max_ip = server.ip;
            }
        }

        return max_ip;
    }
}
