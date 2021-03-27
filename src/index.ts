const io = require('socket.io-client');

import * as express from 'express';
const express_server = express();
express_server.use(express.json());

import { DataServer, data_server_queue } from './data-server';
import { Judger, judger_queue } from './judger';
import { Config, get_config } from './config';
import { get_task } from './server';
import { TaskAssigner, task_queue, running_task_queue } from './task';
import { login } from './login';
import { parse_ip } from './utilities';

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
            console.log(`[Task] Got task ID: ${task_id} from Judger-Port`);

            get_task(config, task_id)
                .then(res => {
                    task_queue.push(res);
                })
                .catch(err => {
                    console.log(`[Task] Get task from server ERR ${err.request.status}`);
                });
        });

        // Data-Server check-in
        express_server.post('/api/data-server', (req, res) => {
            const ip = parse_ip(req);

            try {
                if (!data_server_queue.find(ip)) {
                    data_server_queue.push(new DataServer(ip));
                    console.log(`[Data-Server] Check-in on IP ${ip}`);
                } else {
                    data_server_queue.edit(ip, new DataServer(ip));
                    console.log(`[Data-Server] Recheck-in on IP ${ip}`);
                }

                res.status(200).end();
            } catch (err) {
                console.log(`[Data-Server] ERR: Check-in (${err})`);
                res.status(500).end();
            }
        });

        // Judger check-in
        express_server.post('/api/judger', (req, res) => {
            const ip = parse_ip(req);

            try {
                if (!judger_queue.find(ip)) {
                    judger_queue.push(new Judger(ip, req.body.max_thread, 0));

                    judger_threads += req.body.max_thread;
                    judger_port_socket.emit('set-priority', judger_threads);

                    console.log(`[Judger] Check-in on IP ${ip}`);
                } else {
                    judger_queue.edit(ip, new Judger(ip, req.body.max_thread, 0));
                    console.log(`[Judger] Recheck-in on IP ${ip}`);
                }

                res.status(200).end();
            } catch (err) {
                console.log(`[Judger] ERR: Check-in (${err})`);
                res.status(500).end();
            }
        });

        // Judger finish task
        express_server.delete('/api/task', (req, res) => {
            const ip = parse_ip(req);
            for (let i = 0; i < running_task_queue.queue.length; i++) {
                if (running_task_queue.queue[i].id == req.body.id) {
                    running_task_queue.queue.splice(i, 1);
                    break;
                }
            }

            for (let i = 0; i < judger_queue.queue.length; i++) {
                if (judger_queue.queue[i].ip == ip) {
                    judger_queue.queue[i].used_thread--;
                    break;
                }
            }

            console.log(`[Judger] Finished task ID: ${req.body.id}`);

            res.status(200).end();
        })

        express_server.listen(config.port, () => {
            console.log(`Serving on port ${config.port}`);
        });
    })
    .catch(() => {
        console.log(`[Login] ERR`);
        process.exit(1);
    });
