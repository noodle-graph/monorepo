# Scanner

- [Scanning](#scanning)
  - [Noodle dependency comment](#noodle-dependency-comment)
  - [Undeclared resources](#undeclared-resources)
- [Scan result](#scan-result)

## Scanning

- Login to GitHub user
- Clone repositories
- Scan the files in each repository and search noodle comments based on the programming language.
- Generate and upload a results file.

### Noodle dependency comment

A code comment that represents a dependency. It has the following structure: `noodle <relationship> <node> <tags>`

For example:

- `// noodle -requests from-> another-api-service (http,get,feature1,feature1)`
- `// noodle <-requests from- sqs`
- `/* noodle -uploads to-> s3-my-bucket (s3,feature1) */`
- `# noodle -publish to-> sns-topic1 (sns,feature2)`

Every time the scanner hit a noodle comment it will generate dependency.

### Undeclared resources

Resources that were discovered during the scan and were not listed in the config file.

## Scan result

The scanner will generate a results file with the following structure:

```json
{
  "title": "My Organization",
  "resources": [
    {
      "id": "my-api-service",
      "name": "My API Service",
      "description": "REST API for managing data of some feature.",
      "tags": ["api", "nodejs", "rest", "feature1", "feature2"],
      "url": "https://github.com/my-organization/my-api-service",
      "platform": "GitHub",
      "relationships": [
        {
          "resourceId": "another-api-service",
          "action": "requests from",
          "tags": ["http", "feature1"],
          "url": "https://github.com/my-organization/my-api-service/blob/master/src/index.ts#17"
        },
        {
          "resourceId": "my-bucket",
          "relationship": "download",
          "tags": ["s3", "feature2"],
          "url": "https://github.com/my-organization/my-api-service/blob/master/src/downloadClient.ts#3"
        }
      ]
    },
    {
      "id": "another-api-service",
      "name": "Another API Service",
      "description": "REST API for managing data of another feature.",
      "tags": ["api", "java", "graphql", "feature1", "feature2"],
      "url": "https://github.com/my-organization/another-api-service",
      "platform": "GitHub",
      "dependencies": []
    },
    {
      "id": "my-bucket"
    }
  ]
}
```

_Note that this is the same structure as the [config file](../cli/README.md), except:_

- [Scanning](#scanning)
  - [Noodle dependency comment](#noodle-dependency-comment)
  - [Undeclared resources](#undeclared-resources)
- [Scan result](#scan-result)
