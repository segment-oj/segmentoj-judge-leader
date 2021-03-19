import * as fs from 'fs';

let use_default_config = (conf, def) => {
    for (let i in def) {
        if (conf[i] === undefined) {
            conf[i] = def[i];
        }
    }

    return conf;
};

export interface Config {
    port: number,
    ws_port: number,
    server_uri: string,
    judger_port_uri: string,
    username: string,
    password: string,
};

export function get_config(): Config {
    const default_config: Config = {
        port: 4000,
        ws_port: 5000,
        server_uri: 'http://localhost:8000',
        judger_port_uri: 'http://localhost:3000',
        username: 'judge-leader',
        password: '123456',
    };

    const config_path = process.env.cfg || './judge-leader.config.json';

    if (!fs.existsSync(config_path)) {
        return default_config;
    }
    const content = fs.readFileSync(config_path);
    
    let config;
    try {
        config = JSON.parse(content.toString());
    } catch {
        console.log('[Config] json parsing ERR');
    }

    return use_default_config(config, default_config);
};
