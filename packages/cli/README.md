# CLI

- [Commands](#commands)
  - [Scan](#scan)
    - [Arguments](#arguments)
    - [Config file](#config-file)
  - [Serve UI](#serve-ui)
    - [Arguments](#arguments-1)

## Commands

### Scan

```bash
noodle scan
```

It will use the [scanner](../scanner) to scan the repositories for dependencies and produce the results.

#### Arguments

| Name | Description |
|---|---|
| `--config` | Path the configuration file |

#### Config file

```json
[
  {
    "id": "my-api-service",
    "name": "My API Service",
    "tags": ["api", "nodejs", "rest", "feature1"],
    "description": "REST API for managing data of some feature.",
    "url": "https://github.com/my-organization/my-api-service"
  }
]
```

### Serve UI

```bash
noodle serve
```

#### Arguments

| Name | Description |
|---|---|
| `--results` | Path to a scan results file |
