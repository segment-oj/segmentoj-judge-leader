import * as express from 'express';
import { Config, get_config } from './config';
import { login } from './login';
import { get_status } from './server';
import { Task } from './task';

const app = express();
const config: Config = get_config();
const io = require('socket.io-client');

login(config)
.then(token => {
    const socket = io(config.judger_port_uri, {
        auth: { token: token, }
    });

    // Initial priority
    socket.emit('set-priority', 0);

    // Get task
    socket.on('assign-task', (task_id) => {
        get_status(config, task_id)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(`[Task] get task from server ERR ${err.request.status}`);
        });
    });;

    app.listen(config.port, () => {
        console.log(`Serving on port ${config.port}`);
    });
})
.catch(err => {
    console.log(`[Login] login ERR ${err.response.status}: ${err.response.data.detail}`);
    process.exit(1);
});
