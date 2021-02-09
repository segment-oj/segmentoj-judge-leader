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
    server_uri: string,
};

export function get_config(): Config {
    const default_config: Config = {
        port: 3000,
        server_uri: 'http://localhost:8000',
    };

    const config_path = process.env.cfg || './judge-leader.config.json';

    if (!fs.existsSync(config_path)) {
        return default_config;
    }
    const content = fs.readFileSync(config_path);
    let config = JSON.parse(content.toString());

    return use_default_config(config, default_config);
};
