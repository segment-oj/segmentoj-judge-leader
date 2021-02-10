import * as express from 'express';
import { Config, get_config } from './config';
import { login } from './login';

const app = express();
const config: Config = get_config();
const io = require('socket.io-client');

login()
.then(token => {
    const socket = io(config.judger_port_uri, {
        auth: {
            token: token,
        }
    });

    // console.log(socket);
    // socket.emit('set-priority', 10);

    app.listen(config.port, () => {
        console.log(`Serving on port ${config.port}`);
    });
})
.catch(err => {
    console.log(`[Login] login ERR ${err.response.status}: ${err.response.data.detail}`);
    process.exit(1);
});

