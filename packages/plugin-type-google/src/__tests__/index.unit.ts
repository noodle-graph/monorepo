import TypeGoogleLinker from '..';

it('Simple test', () => {
    const linker = new TypeGoogleLinker();
    expect(
        linker.enrich([
            {
                id: 's3-test',
                type: 'aws/s3',
                additionalLinks: [],
            },
            {
                id: 'webex',
                type: 'webex',
            },
        ])
    ).toEqual([
        {
            id: 's3-test',
            type: 'aws/s3',
            additionalLinks: [
                {
                    label: 'Search the type in google...',
                    url: 'https://www.google.com/search?q=aws%2Fs3',
                },
            ],
        },
        {
            id: 'webex',
            type: 'webex',
            additionalLinks: [
                {
                    label: 'Search the type in google...',
                    url: 'https://www.google.com/search?q=webex',
                },
            ],
        },
    ]);
});
