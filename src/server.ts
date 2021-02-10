import axios from 'axios';
import { timingSafeEqual } from 'crypto';
import { Config } from './config';
import { Task } from './task';

export async function get_status(config: Config, task_id: number) {
    let task: Task;

    await axios.get(`${config.server_uri}/api/status/${task_id}`)
    .then(res => {
        let data = res.data.res;
        task = new Task(data.id, data.code, data.lang, data.lang_info);
    })
    .catch(err => {
        throw(err);
    });

    return task;
};
