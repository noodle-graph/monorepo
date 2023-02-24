const IMG_DIR = 'img/';
const TYPE_IMG_PNG = ['webex'];

export function getTypeImagePath(type: string): string {
    return IMG_DIR + type + (TYPE_IMG_PNG.includes(type) ? '.png' : '.svg');
}

export function prettifySource(source?: string): string {
    return !source ? 'Config' : source === 'github' ? 'GitHub' : source === 'local' ? 'Local' : source;
}
