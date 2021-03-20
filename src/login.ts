import axios from 'axios';

import { Config } from './config';

export async function login(config: Config) {
    let token = '';

    try {
        const res = await axios.post(`${config.server_uri}/api/account/token`, {
            username: config.username,
            password: config.password
        });

        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

        try {
            const res = await axios.get(`${config.server_uri}/api/judger/token`);
            token = res.data.res;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    }

    return token;
}
