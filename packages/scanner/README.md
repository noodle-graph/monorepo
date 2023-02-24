# Scanner

- [Scanning](#scanning)
  - [Noodle comment](#noodle-comment)
  - [Undeclared resources (TODO)](#undeclared-resources-todo)
    - [Type evaluation of undeclared resources (TODO)](#type-evaluation-of-undeclared-resources-todo)
- [Scan output](#scan-output)
  - [Relationship object](#relationship-object)

## Scanning

- Login to GitHub user.
- Clone repositories.
- Scan the files in each repository and search [Noodle comments](#noodle-comment) based on the programming language.
- [Evaluate undeclared resources types](#type-evaluation-of-undeclared-resources-todo) (TODO).

### Noodle comment

A code comment that represents a relationship with another resource. It has the following structure: `noodle --{action}-> {resourceId} ({tags})`

For example:

- `// noodle --requests from-> another-api-service (http,get,feature1,feature1)`
- `// noodle <-receive from-- sqs-my-queue (sqs,feature2,data)`
- `/* noodle --uploads to-> s3-my-bucket (s3,feature1) */`
- `# noodle --publish to-> sns-topic1 (sns,feature2)`

Every time the scanner finds a Noodle comment it will add the relationship to the results.

### Undeclared resources (TODO)

Resources that were discovered during the scan and were not listed in the [scan config file](../cli/README.md#scan-config-file).

#### Type evaluation of undeclared resources (TODO)

The type of undeclared resources will be evaluated by the relationship which discovered them.

Example of evaluation rules:

- `id starts with "s3" => aws/s3`
- `id starts with "aws/s3" => aws/s3`
- `tags contains "sns" => aws/sns`
- `tags contains "aws/sns" => aws/sns`
- etc.

The first match wins. <!--TODO: Link to the list of type evaluation rules-->

## Scan output

Here is a sample of scan output:

```json
{
  "resources":[
    {
      "id":"some-service",
      "url":"./someService",
      "name":"Some Service",
      "tags":[
        "feature1",
        "feature2",
        "service"
      ],
      "type":"aws/ecs",
      "source":"local",
      "relationships":[
        {
          "action":"requests from",
          "resourceId":"another-service",
          "tags":[
            "feature",
            "hello"
          ],
          "url":"./someService",
          "from":false,
          "to":true
        }
      ]
    },
    {
      "id":"another-service",
      "url":"./anotherService",
      "name":"Another Service",
      "tags":[
        "feature1",
        "service"
      ],
      "type":"aws/ecs",
      "source":"local",
      "relationships":[
        {
          "action":"query",
          "resourceId":"some-db",
          "tags":[
            "feature"
          ],
          "url":"./anotherService",
          "from":false,
          "to":true
        }
      ]
    },
    {
      "id":"some-db",
      "name":"Some DB",
      "tags":[
        "feature1",
        "feature2",
        "service"
      ],
      "type":"aws/aurora"
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
| `tags` | The tags of the relationship, mostly used for [type evaluation](#type-evaluation-of-undeclared-resources-todo) and filtering. |
| `url` | The link to the exact line of the [Noodle comment](#noodle-comment). |
| `from` | Whether arrow should be in the "from" resource. |
| `to` | Whether arrow should be in the "to" resource. |
