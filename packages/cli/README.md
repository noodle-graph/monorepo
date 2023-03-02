# Noodle 🍜 (UNDER CONSTRUCTION 🏗️)

Architecture diagram that maintains itself.

<img src="https://github.com/noodle-graph/monorepo/blob/master/docs/img/basicExampleGraph.png" width="400" alt="example"/>

[![Node.js CI](https://github.com/noodle-graph/monorepo/actions/workflows/node.js.yml/badge.svg)](https://github.com/noodle-graph/monorepo/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/noodle-graph/monorepo/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/noodle-graph/monorepo/actions/workflows/npm-publish.yml)

---

- [Quick start](#quick-start)
  - [1. Install](#1-install)
  - [2. Add Noodle comments](#2-add-noodle-comments)
  - [3. Create config file](#3-create-config-file)
  - [4. `noodle run --open`](#4-noodle-run---open)
- [Commands](#commands)
  - [`run`](#run)
    - [Parameters](#parameters)
  - [Scan config file](#scan-config-file)
    - [Resource object](#resource-object)
- [Contributing](#contributing)

## Quick start

### 1. Install

```bash
npm install --location=global @noodle-graph/cli
```

### 2. Add [Noodle comments](./packages/scanner/README.md#noodle-comment)

[Simple example](./examples/basic/someService/index.js)

### 3. Create [config file](./packages/cli/README.md#scan-config-file)

[Simple example](./examples/basic/noodle.json)

### 4. `noodle run --open`

See more in the [CLI package](./packages/cli).

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
| `--workers` | - | `8` | Amount of workers that will scan files in parallel. |
| `--verbose` | - | `false` | If true, Noodle will print more logs. |

### Scan config file

You can find example of a config file in the [basic example](../../examples/basic/noodle.json)

| Field | Required | Description |
|-|-|-|
| `resources` | Yes | List of [resources objects](#resource-object) to scan or declare. |

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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
