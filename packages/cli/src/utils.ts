import loggerConstructor from 'pino';

export function createLogger(options: { level: 'debug' | 'info'; production?: true }) {
    return loggerConstructor({
        level: options.level,

        ...(options.production
            ? {}
            : {
                  transport: {
                      target: 'pino-pretty',
                      options: {
                          ignore: 'pid,githubToken',
                      },
                  },
              }),
    });
}
