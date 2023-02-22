import * as console from 'console';
import { writeFile } from 'fs';

import { Direction, Relationship } from '@noodle-graph/types';
import { stringify } from 'ts-jest';

const noodleRegEx = /noodle\s+(-|<)-([a-z\s]+)-(>|-)\s+([a-z-]+)\s+(?:\(([a-z-,]+)+\)|)/;

export function relationships(path: string, content: string) {
    const comments: Relationship[] = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        const matches = noodleRegEx.exec(line);
        if (matches) {
            const startDirectionArrow = matches[1];
            const endDirectionArrow = matches[3];
            let direction: Direction = Direction.None;
            if (startDirectionArrow === '-' && endDirectionArrow === '>') {
                direction = Direction.To;
            } else if (startDirectionArrow === '<' && endDirectionArrow === '-') {
                direction = Direction.From;
            } else if (startDirectionArrow === '<' && endDirectionArrow === '>') {
                direction = Direction.Both;
            } else {
                console.log('bad direction');
                // todo: raise exception
            }
            comments.push({
                action: matches[2],
                resourceId: matches[4],
                tags: matches[3].split(','),
                url: path + '#' + stringify(i + 1),
                direction: direction,
            });
        }
    });

    console.log(comments);
    return comments;
}

export async function persist(resources, path: string = process.cwd() + '/scan_output_file.json') {
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
