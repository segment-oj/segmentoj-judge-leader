import * as express from 'express';
import { Config, get_config } from './config';

const server = express();
const config: Config = get_config();

server.listen(config.port, () => {
    console.log(`Serving on port ${config.port}`);
});
