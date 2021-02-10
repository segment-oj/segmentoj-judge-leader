import axios from 'axios';

import { Config } from './config';
import { Task } from './task';

export async function get_status(config: Config, task_id: number) {
    let task: Task;

    await axios.get(`${config.server_uri}/api/status/${task_id}`)
    .then(res => {
        let data = res.data.res;
        task = new Task(data);
    })
    .catch(err => {
        throw(err);
    });

    return task;
};
