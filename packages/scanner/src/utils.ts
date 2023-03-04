export function getDefaultRegex(pattern: string | RegExp | undefined, defaultPattern: RegExp): RegExp {
    return typeof pattern === 'string' ? new RegExp(pattern) : defaultPattern;
}
