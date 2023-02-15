# CLI

- [Commands](#commands)
  - [`here`](#here)
  - [`scan`](#scan)
    - [Parameters](#parameters)
    - [Scan config file](#scan-config-file)
    - [Scan options object](#scan-options-object)
  - [`bundle`](#bundle)
    - [Parameters](#parameters-1)

## Commands

### `here`

The quickest way to get started with Noodle 🍜

```bash
noodle here
```

Runs a [`scan`](#scan) on the current directory and [`bundle`](#bundle) the UI locally. When finished, it will automatically open it in the browser.

No config file is needed.

### `scan`

```bash
noodle scan
```

Using the [scanner](../scanner) to search resources relationships.

#### Parameters

| Command Argument | Environment Variable | Default | Description |
|-|-|-|-|
| `--config`, `-c` | `NOODLE_SCAN_CONFIG` | `./noodle.json` | Path to the scan configuration file. |
| `--output`, `-o` | `NOODLE_SCAN_OUTPUT` | `./noodleScanOutput.json` | Path of the output file. |
| `--github-token` | `NOODLE_SCAN_GITHUB_TOKEN` | - | GitHub access token. Required for GitHub resources. |

#### Scan config file

```json
{
  "options": {
    "typeEvaluation": true,
  },
  "resources": [
    {
      "id": "my-api-service",
      "name": "My API Service",
      "description": "REST API for managing data of some feature.",
      "type": "aws/ecs",
      "tags": ["api", "nodejs", "rest", "feature1"],
      "url": "https://github.com/my-organization/my-api-service",
      "source": "github"
    }
  ]
}
```

| Field | Required | Description |
|-|-|-|
| `options` | No | See [scan options object](#scan-options-object) |
| `resources` | Yes | List of [resources objects](#resource-object) to scan or declare. |

#### Scan options object

| Field | Pattern | Required | Default | Description |
|-|-|-|-|-|
| `typeEvaluation` | boolean | No | `true` | Whether to [evaluate the type of undeclared resources](../scanner/README.md#type-evaluation-of-undeclared-resources) or not. |

##### Resource object

| Field | Pattern | Required | Default | Description |
|-|-|-|-|-|
| `id` | a-z, number, forward slash, underscore, dash. RegEx: `[a-z\d-_/]+` | Yes | - | Identifier of the resource. |
| `name` | Any string | No | The value of `id` | The name of the resource. |
| `description` | Any string | No | `null` | Description of the resource. |
| `type` | `null`, `aws/lambda`, `aws/ec2`, `aws/ecs`, `aws/s3`, `aws/sqs`, `aws/sns`, `aws/cloudwatch`, `aws/rds`, `aws/dynamodb`, `aws/elasticache` | No | `null` | The type of the resource is deployed on |
| `tags` | a-z, number, forward slash, underscore, dash. RegEx: `[a-z\d-_/]+` | No | `[]` | Tags of the resource. For the UI view and filtering. |
| `url` | `null` if `source` is `third-party`, otherwise a valid URL. | Yes, except if `source` is `third-party`. | `null` | The URL of the source to scan. |
| `source` | `github`, `local`, `third-party` | No | `github` if starts with `https://github.com`, `third-party` if `url` is `null`, otherwise `local`. | The type of the source to scan. `third-party` sources won't get scanned. |

### `bundle`

Creates a UI bundle with the specified [scan output](../scanner/README.md#scan-output).

```bash
noodle bundle
```

#### Parameters

| Command Argument | Environment Variable | Default | Description |
|-|-|-|-|
| `--scanOutput` | `NOODLE_SCAN_OUTPUT` | `./noodleScanOutput.json` | Path to the scan output file. |
| `--output` | `NOODLE_BUNDLE_OUTPUT` | `./noodleDist` | Path the the bundle output directory. |
| `--open` | - | `false` | Whether to open in the browser the bundled UI when finished. |
