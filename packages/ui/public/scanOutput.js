(function () {
    console.log('hello2');
    // eslint-disable-next-line no-undef
    window.window.scanOutput = {
        resources: [
            {
                id: 'my-api-service',
                name: 'My API Service',
                description: 'REST API for managing data of some feature.',
                type: 'aws/ec2',
                tags: ['api', 'nodejs', 'rest', 'feature1', 'feature2'],
                url: 'https://github.com/my-organization/my-api-service',
                source: 'GitHub',
                relationships: [
                    {
                        resourceId: 'another-api-service',
                        action: 'requests from',
                        tags: ['http', 'feature1'],
                        url: 'https://github.com/my-organization/my-api-service/blob/master/src/index.ts#17',
                    },
                    {
                        resourceId: 'my-bucket',
                        action: 'download',
                        tags: ['s3', 'feature2'],
                        url: 'https://github.com/my-organization/my-api-service/blob/master/src/downloadClient.ts#3',
                    },
                ],
            },
            {
                id: 'another-api-service',
                name: 'Another API Service',
                description: 'REST API for managing data of another feature.',
                type: 'aws/ecs',
                tags: ['api', 'java', 'graphql', 'feature1', 'feature2'],
                url: 'https://github.com/my-organization/another-api-service',
                source: 'GitHub',
                relationships: [],
            },
            {
                id: 'my-bucket',
                type: 'aws/s3',
            },
        ],
    };
})();
