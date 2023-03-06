import TypeEvaluator from '..';

it('Simple test', () => {
    const evaluator = new TypeEvaluator();
    expect(
        evaluator.enrich([
            {
                id: 's3-test',
            },
            {
                id: 'test-sns',
            },
            {
                id: 'webex',
            },
            {
                id: 'test-sqs-test',
            },
        ])
    ).toEqual([
        {
            id: 's3-test',
            type: 'aws/s3',
        },
        {
            id: 'test-sns',
            type: 'aws/sns',
        },
        {
            id: 'webex',
            type: 'webex',
        },
        {
            id: 'test-sqs-test',
            type: 'aws/sqs',
        },
    ]);
});
