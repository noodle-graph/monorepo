import { exec } from 'child_process';
import { isAbsolute, join } from 'path';

import { fastifyStatic } from '@fastify/static';
import { fastify } from 'fastify';
import type { Logger } from 'pino';

import { createLogger } from './utils';

interface Attributes {
    scanOutputDir: string;
    host: string;
    port: number;
    logger?: Logger;
    production?: true;
    open?: boolean;
}

const PRODUCTION_DEFAULTS: Partial<Attributes> = {
    open: false,
    host: '0.0.0.0',
    port: 3000,
};

export function serve(attributes: Attributes) {
    const options = {
        open: true,
        ...attributes,
        ...(attributes.production ? PRODUCTION_DEFAULTS : {}),
    };

    const server = fastify({
        logger: options.logger ?? createLogger({ level: 'info', production: options.production }),
        disableRequestLogging: true,
    });

    server.register(fastifyStatic, {
        root: isAbsolute(options.scanOutputDir) ? options.scanOutputDir : join(process.cwd(), options.scanOutputDir),
    });

    server.listen({ port: options.port, host: options.host }, (err, address) => {
        if (err) throw err;
        if (options.open) exec(`open ${address}`);
    });
}
