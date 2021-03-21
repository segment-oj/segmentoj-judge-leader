# Sgmentoj Judge Leader
Segment OJ judger leader

## How To Build
1. Clone repo
```zsh
git clone https://github.com/segment-oj/segmentoj-judge-leader
```
2. Install
```zsh
npm install
```
3. Serve
```zsh
npm serve
```

## Configure
Write the config in `process.env.cfg` or `judge-leader.config.json`

Available configures and their default values.
```json
{
    "port": 4000,
    "ws_port": 5000,
    "server_uri": "http://localhost:8000",
    "judger_port_uri": "http://localhost:3000",
    "username": "judge-leader",
    "password": "123456"
}
```

|Config Name|Meaning|
|:--|--|
|`port`|The HTTP Server Port|
|`ws_port`|The WS Server Port|
|`server_uri`|The Backend-Server's URI|
|`judger_port_uri`|The Judger-Port's URI|
|`usermane`|The Username to the Judge-Leader In The Backend-Server|
|`password`|The Password to the Judge-Leader In The Backend-Server|
