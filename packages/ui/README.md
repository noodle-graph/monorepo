# UI

- [Features](#features)
- [Bundling](#bundling)

The graph displayed using [vis.js](https://visjs.org/) under the hood.

## Features

- Graph view
  - Resources (nodes) and relationships (edges)
  - Nodes have icons based on the `type`
  - Open resource view by clicking on its node
  - Filter resource nodes by:
    - Tags
    - Name (TODO)
    - Type (TODO)
    - Distance from filtered nodes
- Resource view
  - Name
  - Type
  - Description
  - Tags
  - Link to file
  - Relationships
    - Related resource name
    - Tags
    - Link to source code line

## Bundling

The UI must be bundled together with the [scan output](../scanner/README.md#scan-output) to be functional.

__See the [run command](../cli/README.md#run).__
