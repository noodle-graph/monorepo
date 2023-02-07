# CLI

## Commands

### Scan and print

```bash
noodle scan
```

It will use the [scanner](../scanner) to scan the repository for dependencies and print the results.

### Scan and publish

```bash
noodle scan --inventory-url {inventory server URL}
```

It will use the [scanner](../scanner) to scan the repository for dependencies and publish the results to the [inventory](../inventory-server).
