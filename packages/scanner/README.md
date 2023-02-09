# Scanner

- [Scanning](#scanning)
  - [Noodle comment](#noodle-comment)
- [Scan result](#scan-result)

## Scanning

- Login to GitHub user
- Clone repositories
- Scan the files in each repository and search noodle comments based on the programming language.
- Generate and upload a results file.

### Noodle comment

A code comment that represents a dependency. It has the following structure: `noodle <relationship> <node> <tags>`

For example:

- `// noodle calls repo2 tag1,tag2,tag3`
- `/* noodle "uploads to" S3/bucket1 */`
- `# noodle "publish to" SNS/topic1`

Every time the scanner hit a noodle comment it will generate dependency.

## Scan result

The scanner will generate a results file with the following structure:

```json
[
  {
    "id": "my-api-service",
    "name": "My API Service",
    "tags": ["api", "nodejs", "rest", "feature1"],
    "description": "REST API for managing data of some feature.",
    "url": "https://github.com/my-organization/my-api-service",
    "dependencies": ["another-api-service", "S3/my-bucket"]
  },
  {
    "id": "another-api-service",
    "name": "Another API Service",
    "tags": ["api", "java", "graphql", "feature2"],
    "description": "REST API for managing data of another feature.",
    "url": "https://github.com/my-organization/another-api-service",
    "dependencies": []
  }
]
```
