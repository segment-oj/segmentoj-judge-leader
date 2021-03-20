const io = require('socket.io-client');

const WebSocket = require('ws');
import * as express from 'express';
const express_server = express();
express_server.use(express.json());

import { DataServer, DataServerQueue } from './data-server';
import { Judger, JudgerQueue } from './judger';
import { Config, get_config } from './config';
import { get_task } from './server';
import { TaskQueue } from './task';
import { login } from './login';

const config: Config = get_config();

let data_server_queue = new DataServerQueue();
let judger_queue = new JudgerQueue();
let task_queue = new TaskQueue();
let judger_parallels = 0;

login(config)
    .then(token => {
        console.log('[Login] Success');

        // Socket.io connection with judger port
        const judger_port_socket = io(config.judger_port_uri, {
            auth: { token: token, }
        });

        // WebSocket server for judgers
        const judger_socket = new WebSocket.Server({
            port: config.ws_port,
        });

        // Initial priority
        judger_port_socket.emit('set-priority', 0);

        // Get task
        judger_port_socket.on('assign-task', task_id => {
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
            
            judger_queue.push(new Judger(ip, req.body.max_parallel));

            judger_parallels += req.body.max_parallel;
            judger_port_socket.emit('set-priority', judger_parallels);

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
