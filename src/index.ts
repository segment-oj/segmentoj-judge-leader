const io = require('socket.io-client');

import * as express from 'express';
const express_server = express();
express_server.use(express.json());

import { DataServer, data_server_queue } from './data-server';
import { Judger, judger_queue } from './judger';
import { Config, get_config } from './config';
import { get_task } from './server';
import { TaskAssigner, task_queue } from './task';
import { login } from './login';

const config: Config = get_config();
let judger_threads = 0;

login(config)
    .then(token => {
        console.log('[Login] Success');

        // Set up task assigner
        let task_assigner: TaskAssigner = new TaskAssigner();
        task_assigner.start();

        // Socket.io connection with judger port
        const judger_port_socket = io(config.judger_port_uri, {
            auth: { token: token, }
        });

        // Initial priority
        judger_port_socket.emit('set-priority', 0);

        // Get task
        judger_port_socket.on('assign-task', task_id => {
            console.log(task_id);
            get_task(config, task_id)
                .then(res => {
                    task_queue.push(res);
                })
                .catch(err => {
                    console.log(`[Task] get task from server ERR ${err.request.status}`);
                });
        });

        // Data server check-in
        express_server.post('/api/data-server', (req, res) => {
            const ip = `${req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]}:${req.body.port}`;
            data_server_queue.push(new DataServer(ip));

            console.log(`[Data Server] check-in on IP ${ip}`);

            res.status(200).end();
        });

        // Judger check-in
        express_server.post('/api/judger', (req, res) => {
            const ip = `${req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]}:${req.body.port}`;

            judger_queue.push(new Judger(ip, req.body.max_thread, 0));

            judger_threads += req.body.max_thread;
            judger_port_socket.emit('set-priority', judger_threads);

            res.status(200).end();
        });

        express_server.listen(config.port, () => {
            console.log(`Serving on port ${config.port}`);
        });
    })
    .catch(() => {
        console.log(`[Login] ERR`);
        process.exit(1);
    });
