import axios from 'axios';
import { Config, get_config } from './config';
import { stdio_read, stdio_write } from './io';

let config: Config = get_config();

export function login() {
    stdio_write('[Login]\n');
    let username = stdio_read('    username: ').trim();
    let password = stdio_read('    password: ').trim();

    axios.post(`${config.server_uri}/api/account/token`, {
        username: username,
        password: password
    })
    .then((res) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

        axios.get(`${config.server_uri}/api/judger/token`)
        .then(res => {
            axios.post(`${config.judger_port_uri}/api/token`, {
                token: res.data.res,
            })
            .then(() => {
                console.log('[Login] success');
            })
            .catch((err) => {
                console.log(`[Login] judger port login ERR ${err.response.status}: ${err.response.data.detail}`);
                process.exit(1);
            });
        }).catch((err) => {
            console.log(`[Login] judger login ERR ${err.response.status}: ${err.response.data.detail}`);
            process.exit(1);
        });
    }).catch((err) => {
        console.log(`[Login] account login ERR ${err.response.status}: ${err.response.data.detail}`);
        process.exit(1);
    });
}
