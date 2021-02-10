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
}
