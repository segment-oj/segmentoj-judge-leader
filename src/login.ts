import axios from 'axios';

import { Config } from './config';

export async function login(config: Config) {
    let token = '';

    await axios.post(`${config.server_uri}/api/account/token`, {
        username: config.username,
        password: config.password
    })
    .then(async res => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
        
        await axios.get(`${config.server_uri}/api/judger/token`)
        .then(async res => {
            token = res.data.res;
        }).catch((err) => {
            throw(err);
        });
    }).catch((err) => {
        throw(err);
    });

    return token;
}
