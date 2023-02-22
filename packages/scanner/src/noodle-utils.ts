import * as console from 'console';
import { writeFile } from 'fs';

import { Relationship } from '@noodle-graph/types';

const noodleRegEx = /noodle\s+--([a-z\s]+)->\s+([a-z-]+)\s+(?:\(([a-z-,]+)+\)|)/;

export function relationships(path: string, content: string) {
    const comments: Relationship[] = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        // const matches = line.match(regex);
        const matches = noodleRegEx.exec(line);
        if (matches) {
            comments.push({
                action: matches[1],
                resourceId: matches[2],
                tags: matches[3].split(','),
                url: path,
                line: i + 1,
            });
        }
    });

    console.log(comments);
    return comments;
}

export async function persist(resources, path: string = process.cwd() + '/scan_config_file.json') {
    console.log(`persisting ${resources} to $ ${path}`);
    await new Promise((resolve) => writeFile(path, JSON.stringify(resources, null, 2), resolve));
}

// const testContent =
//     'export class NotificationClientWebex implements NotificationClient {\n' +
//     '    @inject(TYPE.HTTP_CLIENT) @named(NAME.WEBEX_API) private readonly client!: HttpClient;\n' +
//     '\n' +
//     '    // noodle --publish to-> webex (post,discovery-scan,discovery-scan-init,discovery-scan-control)\n' +
//     '    @tryCatch.tryCatch(undefined, undefined, false)\n' +
//     '    async notify(markdown: string): Promise<void> {\n' +
//     "        await this.client.post({ url: '', data: { roomId: notificationSettings.roomId, markdown } });";

// const commentsTest = relationships('file_nane', testContent);
// console.log(commentsTest);
// console.log('fsdfsdf');
