# inventory-server

## Endpoints

* `GET /nodes`
* `PUT /nodes/{nodeId}`

## Nodes schema example

```json
[
  {
    "id": "repo1",
    "prettyName": "Repo 1",
    "description": "A magical repo that cooks noodle",
    "url": "https://github.com/organization1/repo1",
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
  },
  {
    "id": "repo2",
    "prettyName": "Repo 2",
    "description": "Another magical repo that cooks noodle",
    "url": "https://github.com/organization1/repo2",
    "tags": ["tag2"],
    "dependencies": []
  }
]
```

### Remarks

* Dependencies URLs can be relative
* Dependency node doesn't have to be specified
