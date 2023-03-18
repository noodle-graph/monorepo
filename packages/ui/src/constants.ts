const IMG_DIR = 'img/';
const TYPE_IMG_PNG = ['webex'];

export function getTypeImagePath(type: string): string {
    return IMG_DIR + type + (TYPE_IMG_PNG.includes(type) ? '.png' : '.svg');
}

export function prettifySource(source?: string): string {
    return (
        {
            github: 'GitHub',
            local: 'Local',
            scan: 'Scan',
            config: 'Configuration',
            ui: 'UI',
        }[source ?? ''] ?? 'Unknown'
    );
}
