import axios from 'axios';

import { stdio_read, stdio_write } from './io';
import { Config } from './config';

export async function login(config: Config) {
    stdio_write('[Login]\n');
    let username = stdio_read('    username: ').trim();
    let password = stdio_read('    password: ').trim();

    let token = '';

    await axios.post(`${config.server_uri}/api/account/token`, {
        username: username,
        password: password
    })
    .then(async res => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

        await axios.get(`${config.server_uri}/api/judger/token`)
        .then(async res => {
            await axios.post(`${config.judger_port_uri}/api/token`, {
                token: res.data.res,
            })
            .then(() => {
                console.log('[Login] success');
                token = res.data.res;
            })
            .catch((err) => {
                throw(err);
            });
        }).catch((err) => {
            throw(err);
        });
    }).catch((err) => {
        throw(err);
    });

    return token;
}
