import { exec } from 'child_process';
import { isAbsolute, join } from 'path';

import { fastifyStatic } from '@fastify/static';
import { fastify } from 'fastify';

import { createLogger } from './utils';

export function serve(attributes) {
    const server = fastify({ logger: createLogger('info'), disableRequestLogging: true });
    server.register(fastifyStatic, {
        root: isAbsolute(attributes.scanOutputDir) ? attributes.scanOutputDir : join(process.cwd(), attributes.scanOutputDir),
    });
    server.listen({ port: attributes.port, host: attributes.host }, (err, address) => {
        if (err) throw err;
        if (attributes.open) {
            exec(`open ${address}`);
        }
    });
}
