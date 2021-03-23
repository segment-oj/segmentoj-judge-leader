export function parse_ip(req): string {
    return `${req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]}:${req.body.port}`;
}
