import * as console from "console";

const regex = '/noodle.+';

let noodleRegEx: RegExp = /noodle.+/;

type Finding = {
    source: string;
    line: number;
    match: string;
};

export function relationships(path: string, content: string) {
    const comments: Finding[] = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        // const matches = line.match(regex);
        const matches = noodleRegEx.exec(line);
        if (matches) {
            comments.push({
                source: path,
                line: i + 1,
                match: matches[0],
            });
        }
    });

    return comments;
}

export function persist(resources, path: string) {
    console.log(`persisting ${resources} to $ ${path}`);
    return '';
}

const testContent = 'export class NotificationClientWebex implements NotificationClient {\n' +
    '    @inject(TYPE.HTTP_CLIENT) @named(NAME.WEBEX_API) private readonly client!: HttpClient;\n' +
    '\n' +
    '    // noodle --publish to-> webex (post,discovery-scan,discovery-scan-init,discovery-scan-control)\n' +
    '    @tryCatch.tryCatch(undefined, undefined, false)\n' +
    '    async notify(markdown: string): Promise<void> {\n' +
    '        await this.client.post({ url: \'\', data: { roomId: notificationSettings.roomId, markdown } });'


let commentsTest;
commentsTest = relationships('file_nane', testContent);
console.log(commentsTest);
console.log('fsdfsdf');
