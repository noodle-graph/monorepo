# UI

- [Features](#features)

The graph displayed using [vis.js](https://visjs.org/) under the hood.

## Features

- Graph view
  - Resources (nodes) and relationships (edges)
  - Nodes will have icon based on the `type`
  - Open resource view by clicking on its node
  - Filter resource nodes by:
    - Tags
    - Name
    - Type
    - Relationship tags
- Resource view
  - Name
  - Type
  - Description
  - Tags
  - Link to git repository (if GitHub source)
  - Path (if local source)
  - Relationships
    - Action
    - Related resource name
    - Tags
    - Link to source code line

## Bundling

The UI must be bundled together with the [scan output](../scanner/README.md#scan-output) to be functional.

__See the [bundle command](../cli/README.md#bundle).__
