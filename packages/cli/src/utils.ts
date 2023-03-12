import loggerConstructor from 'pino';

export function createLogger(level: 'debug' | 'info') {
    return loggerConstructor({
        level,

        transport: {
            target: 'pino-pretty',
            options: {
                ignore: 'pid,githubToken',
            },
        },
    });
}
