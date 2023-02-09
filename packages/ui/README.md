# UI

- [Features](#features)
- [TBD](#tbd)

The graph displayed using [vis.js](https://visjs.org/).

## Features

- Graph view
  - Resources (nodes) and dependencies (edges)
  - Open resource view by clicking on its node
  - Filter resources nodes by:
    - Tags
    - Name
    - Platform
- Resource view
  - Name
  - Tags
  - Link to git repository
  - Dependencies:
    - Relationship
    - Related resource name
    - Tags
    - Link to source code

## TBD

- What happens with [undeclared resources](../scanner/README.md#undeclared-resources) when filtering?
- Put image to a node based on tags? Like S3 icon for s3 tag, DB icon for db tag, etc.
