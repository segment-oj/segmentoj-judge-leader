import * as fs from 'fs';

export function stdio_read(prompt): string {
    process.stdout.write(prompt);
    process.stdin.pause();

    const buf = Buffer.allocUnsafe(10000);
    let req = fs.readSync(process.stdin.fd, buf, 0, 10000, 0);
    process.stdin.end();

    return buf.toString('utf8', 0, req);
}

export function stdio_write(content) {
    process.stdout.write(content);
}
