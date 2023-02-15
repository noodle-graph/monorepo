# Scanner

- [Scanning](#scanning)
  - [Noodle comment](#noodle-comment)
  - [Undeclared resources](#undeclared-resources)
    - [Type evaluation of undeclared resources](#type-evaluation-of-undeclared-resources)
- [Scan output](#scan-output)
  - [Relationship object](#relationship-object)

## Scanning

- Login to GitHub user.
- Clone repositories.
- Scan the files in each repository and search [Noodle comments](#noodle-comment) based on the programming language.
- [Evaluate undeclared resources types](#type-evaluation-of-undeclared-resources).
- Generate and save an [output file](#scan-output).

### Noodle comment

A code comment that represents a relationship with another resource. It has the following structure: `noodle --{action}-> {resourceId} ({tags})`

For example:

- `// noodle --requests from-> another-api-service (http,get,feature1,feature1)`
- `// noodle <-receive from-- sqs-my-queue (sqs,feature2,data)`
- `/* noodle --uploads to-> s3-my-bucket (s3,feature1) */`
- `# noodle --publish to-> sns-topic1 (sns,feature2)`

Every time the scanner finds a Noodle comment it will add the relationship to the results.

### Undeclared resources

Resources that were discovered during the scan and were not listed in the [scan config file](../cli/README.md#scan-config-file).

#### Type evaluation of undeclared resources

The type of undeclared resources will be evaluated by the relationship which discovered them.

Example of evaluation rules:

- `id starts with "s3" => aws/s3`
- `id starts with "aws/s3" => aws/s3`
- `tags contains "sns" => aws/sns`
- `tags contains "aws/sns" => aws/sns`
- etc.

The first match wins. <!--TODO: Link to the list of type evaluation rules-->

## Scan output

The scanner will output a results file with the following structure:

```json
{
  "resources": [
    {
      "id": "my-api-service",
      "name": "My API Service",
      "description": "REST API for managing data of some feature.",
      "type": "aws/ec2",
      "tags": ["api", "nodejs", "rest", "feature1", "feature2"],
      "url": "https://github.com/my-organization/my-api-service",
      "source": "GitHub",
      "relationships": [
        {
          "resourceId": "another-api-service",
          "action": "requests from",
          "tags": ["http", "feature1"],
          "url": "https://github.com/my-organization/my-api-service/blob/master/src/index.ts#17"
        },
        {
          "resourceId": "s3-my-bucket",
          "action": "download",
          "tags": ["s3", "feature2"],
          "url": "https://github.com/my-organization/my-api-service/blob/master/src/downloadClient.ts#3"
        }
      ]
    },
    {
      "id": "another-api-service",
      "name": "Another API Service",
      "description": "REST API for managing data of another feature.",
      "type": "aws/ecs",
      "tags": ["api", "java", "graphql", "feature1", "feature2"],
      "url": "https://github.com/my-organization/another-api-service",
      "source": "GitHub",
      "relationships": []
    },
    {
      "id": "my-bucket",
      "type": "aws/s3"
    }
  ]
}
```

_Note that this is very similar to the [scan config file](../cli/README.md#scan-config-file), except the `relationships` field_

### Relationship object

| Field | Description |
|-|-|
| `resourceId` | The identifier of the related resource. |
| `action` | The action declared in the relationship. |
| `tags` | The tags of the relationship, mostly used for [type evaluation](#type-evaluation-of-undeclared-resources) and filtering. |
| `url` | The link to the exact line of the [Noodle comment](#noodle-comment). |
