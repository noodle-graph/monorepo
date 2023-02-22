const regex = 'dasdas';

type Finding = {
    source: string;
    line: number;
    match: string;
};

export async function relationships(path: string, content: string) {
    const comments: Finding[] = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        const matches = line.match(regex);
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
