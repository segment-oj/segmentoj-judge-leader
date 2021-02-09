import axios from 'axios';
import * as fs from 'fs';
import { Config, get_config } from './config';
import { stdio_read, stdio_write } from './io';

let config: Config = get_config();

export function login() {
    stdio_write('[Login]\n');
    let username = stdio_read('    username: ').trim();
    let password = stdio_read('    password: ').trim();

    axios.post(`${config.server_uri}/api/account/token`, {
        username: username,
        password: password,
    })
    .then(() => {
        console.log('[Login] Success');
    })
    .catch(() => {
        console.log('[Login] Err');
    });
}