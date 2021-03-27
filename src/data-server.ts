import { Task } from './task';
import axios from 'axios';

export class DataServer {
    constructor(ip: string) {
        this.ip = ip;
    }

    ip: string;

    async check_data(pid: number) {
        let res: boolean = false;

        try {
            const ret = await axios.get(`http://${this.ip}/api/data/${pid}`);
            res = ret.data.res;
        } catch (err) {
            console.log(`[Data-Server] ERR: Cannot check data from server ${this.ip} ${err.errno}`);
        }

        return res;
    }

    async get_disk_capacity() {
        let res: number = 0;

        try {
            const ret = await axios.get(`http://${this.ip}/api/capacity`);
            res = ret.data.res;
        } catch (err) {
            console.log(`[Data-Server] ERR: Cannot check capacity from server ${this.ip} ${err.errno}`);
        }

        return res;
    }
}

export class DataServerQueue {
    constructor() {
        this.queue = new Array<DataServer>();
    }

    queue: Array<DataServer>;

    push(server: DataServer) {
        this.queue.push(server);
    }

    async get_latest_data(task: Task) {
        let found_ip: string = '';

        for (let server of this.queue) {
            if (found_ip.length == 0) {
                try {
                    const res = await axios.get(`http://${server.ip}/api/data/${task.problem}`);
                    if (res.data.res.testdata_last_update == task.testdata_last_update) {
                        found_ip = server.ip;
                    }
                }
                catch { }
            } else {
                break;
            }
        }

        return found_ip;
    }

    async get_max_capacity() {
        let max: number = -Infinity;
        let max_ip: string = '';

        for (let server of this.queue) {
            let capacity = await server.get_disk_capacity();

            if (capacity > max) {
                max = capacity;
                max_ip = server.ip;
            }
        }

        return max_ip;
    }

    find(ip: string): boolean {
        for (let server of this.queue) {
            if (server.ip == ip) {
                return true;
            }
        }

        return false;
    }

    edit(ip: string, new_data: DataServer) {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].ip == ip) {
                this.queue[i] = new_data;
                return;
            }
        }

        throw "Data-Server not found";
    }
}

export let data_server_queue: DataServerQueue = new DataServerQueue();
