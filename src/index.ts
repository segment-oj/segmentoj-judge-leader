import * as express from 'express';
import { Config, get_config } from './config';
import { login } from './login';

const app = express();
const config: Config = get_config();

login();

app.listen(config.port, () => {
    console.log(`Serving on port ${config.port}`);
});
