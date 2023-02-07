# Ecosystem

## Components

* [cli](../packages/cli)
* [scanner](../packages/scanner)
* [ui](../packages/ui)
* [inventory-server](../packages/inventory-server)

```mermaid
graph TD

CLI -->|Uses| Scanner
CLI -->|"PUT /nodes/{nodeId}"| Inventory
UI -->|"GET /nodes"| Inventory
```
