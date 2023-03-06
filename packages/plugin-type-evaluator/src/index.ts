import type { NoodlePlugin, Resource } from '@noodle-graph/types';

const evaluatorPatterns: [string, RegExp][] = [
    ['aws/s3', /.*-?s3-?.*/],
    ['aws/sns', /.*-?sns-?.*/],
    ['aws/sqs', /.*-?sqs-?.*/],
    ['aws/ec2', /.*-?ec2-?.*/],
    ['aws/ecs', /.*-?ecs-?.*/],
    ['aws/dynamodb', /.*-?dynamo-?db-?.*/],
    ['webex', /.*-?webex-?.*/],
    ['aws/eks', /.*-?eks-?.*/],
    ['aws/rds', /.*-?rds-?.*/],
    ['aws/lambda', /.*-?lambda-?.*/],
    ['aws/elasticache', /.*-?elasticache-?.*/],
];

export default class TypeEvaluator implements NoodlePlugin {
    public enrich(resources: Resource[]): Resource[] {
        for (const resource of resources) {
            resource.type ??= evaluatorPatterns.find(([_, pattern]) => pattern.test(resource.id))?.[0];
        }
        return resources;
    }
}
