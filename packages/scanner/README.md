# Scanner

## Node metadata

The `noodle.json` file in the root folder of each repository will hold metadata of that node.

### Example

```json
{
  "id": "repo1",
  "prettyName": "Repo 1",
  "description": "A magical repo that cooks noodle",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Scanning

* Search the repository URL in `.git/config` file.
* Scan the files in the repository and search noodle comments based on the programming language.

### Noodle comment

A code comment that represents a dependency. It has the following structure: `noodle <relationship> <node>`

For example:

* `// noodle calls repo2`
* `/* noodle "uploads to" S3/bucket1 */`
* `# noodle "publish to" SNS/topic1`

Every time the scanner hit a noodle comment it will generate dependency.

## Scan result

The scanner will return an object with the following schema:

```json
{
  "id": "repo1",
  "prettyName": "Repo 1",
  "description": "A magical repo that cooks noodle",
  "tags": ["tag1", "tag2", "tag3"],
  "dependencies": [
    {
      "id": "repo1",
      "relationship": "calls",
      "url": "blob/master/src/index.ts#7"
    },
    {
      "id": "S3/bucket1",
      "relationship": "upload",
      "url": "blob/master/src/uploader.ts#16"
    }
  ]
}
```
