# CLI

- [Commands](#commands)
  - [`run`](#run)
    - [Parameters](#parameters)
    - [Scan config file](#scan-config-file)
    - [Scan options object (TODO)](#scan-options-object-todo)

## Commands

### `run`

```bash
noodle run
```

Using the [scanner](../scanner) to search resources relationships and bundles a UI with the results.

#### Parameters

| Command Argument | Environment Variable | Default | Description |
|-|-|-|-|
| `--config`, `-c` | `NOODLE_CONFIG` | `./noodle.json` | Path to the scan configuration file. |
| `--output`, `-o` | `NOODLE_OUTPUT` | `./noodleScanOutput` | Path to the UI bundle output folder. |
| `--githubToken` | `NOODLE_GITHUB_TOKEN` | - | GitHub access token. Required for GitHub resources. |
| `--open` | - | `false` | Whether to open in the browser the bundled UI when finished. |
| `--workers` | - | TODO | TODO |
| `--verbose` | - | TODO | TODO |

### Scan config file

You can find example of a config file in the [basic example](../../examples/basic/noodle.json)

| Field | Required | Description |
|-|-|-|
| `options` | No | See [scan options object](#scan-options-object-todo) |
| `resources` | Yes | List of [resources objects](#resource-object) to scan or declare. |

#### Scan options object (TODO)

| Field | Pattern | Required | Default | Description |
|-|-|-|-|-|
| `typeEvaluation` | boolean | No | `true` | Whether to [evaluate the type of undeclared resources](../scanner/README.md#type-evaluation-of-undeclared-resources-todo) or not. |

#### Resource object

| Field | Pattern | Required | Default | Description |
|-|-|-|-|-|
| `id` | a-z, number, forward slash, underscore, dash. RegEx: `[a-z\d-_/]+` | Yes | - | Identifier of the resource. |
| `name` | Any string | No | The value of `id` | The name of the resource. |
| `description` | Any string | No | `null` | Description of the resource. |
| `type` | `null`, `aws/lambda`, `aws/ec2`, `aws/ecs`, `aws/s3`, `aws/sqs`, `aws/sns`, `aws/cloudwatch`, `aws/rds`, `aws/dynamodb`, `aws/elasticache` | No | `null` | The type of the resource is deployed on |
| `tags` | a-z, number, forward slash, underscore, dash. RegEx: `[a-z\d-_/]+` | No | `[]` | Tags of the resource. For the UI view and filtering. |
| `url` | `null` if `source` is `third-party`, otherwise a valid URL. | Yes, except if `source` is `third-party`. | `null` | The URL of the source to scan. |
| `source` | `github`, `local`, `third-party` | No | `github` if starts with `https://github.com`, `third-party` if `url` is `null`, otherwise `local`. | The type of the source to scan. `third-party` sources won't get scanned. |
