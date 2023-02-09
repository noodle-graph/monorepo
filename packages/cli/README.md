# CLI

- [Commands](#commands)
  - [Scan](#scan)
    - [Parameters](#parameters)
    - [Config file](#config-file)
  - [Serve UI](#serve-ui)
    - [Parameters](#parameters-1)

## Commands

### Scan

```bash
noodle scan
```

It will use the [scanner](../scanner) to scan the repositories for dependencies and produce the results.

#### Parameters

| Command Argument | Environment Variable | Default | Description |
|-|-|-|-|
| `--config` | `NOODLE_CONFIG` | `./noodle.json` | Path the configuration file. |
| `--gitHubToken` | `NOODLE_GITHUB_TOKEN` | - | GitHub access token. Required for GitHub resources. |

#### Config file

```json
{
  "title": "My Organization",
  "resources": [
    {
      "id": "my-api-service",
      "name": "My API Service",
      "description": "REST API for managing data of some feature.",
      "tags": ["api", "nodejs", "rest", "feature1"],
      "url": "https://github.com/my-organization/my-api-service",
      "platform": "GitHub"
    }
  ]
}
```

### Serve UI

```bash
noodle serve
```

#### Parameters

| Command Argument | Environment Variable | Default | Description |
|-|-|-|-|
| `--results` | - | Path to a scan results file |
