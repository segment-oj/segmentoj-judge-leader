import axios from 'axios';

import { Config } from './config';
import { Task } from './task';

export async function get_task(config: Config, task_id: number) {
    let task: Task;

    try {
        const res = await axios.get(`${config.server_uri}/api/judger/task/${task_id}`);
        let data = res.data.res;

        try {
            let problem_res = await axios.get(`${config.server_uri}/api/judger/problem/${res.data.res.problem}`);
            data = Object.assign(data, problem_res.data.res);
        } catch (err) {
            throw err;
        }

        task = new Task(data);
    } catch (err) {
        throw err;
    }

    return task;
};
