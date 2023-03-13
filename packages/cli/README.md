# Noodle 🍜

***Architecture diagram that maintains itself.***

Noodle is an open-source project designed to simplify the process of understanding and visualizing complex system architectures.
It offers automated architecture diagram generation, graph filtering, user-friendly UI features, and a friendly CLI, making it easy to deploy and use.
Additionally, Noodle is reliant on the best source of truth, which is the code itself, by linking to the source code of the relationships.

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
    - [Options](#options)
    - [Scan config file](#scan-config-file)
      - [Resource object](#resource-object)
  - [`serve`](#serve)
    - [Options](#options-1)
- [Plugins](#plugins)
- [Contributing](#contributing)

## Quick start

### 1. Install

```bash
npm install --location=global @noodle-graph/cli
```

### 2. Add [Noodle comments](https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/README.md#noodle-comment)

[Simple example](https://github.com/noodle-graph/monorepo/blob/master/examples/basic/someService/index.js)

### 3. Create [config file](https://github.com/noodle-graph/monorepo/blob/master/packages/cli/README.md#scan-config-file)

[Simple example](https://github.com/noodle-graph/monorepo/blob/master/examples/basic/noodle.json)

### 4. `noodle run --open`

## Commands

### `run`

```bash
noodle run
```

Using the [scanner](https://github.com/noodle-graph/monorepo/tree/master/packages/scanner) to search resources relationships and bundles a UI with the results.

#### Options

| Option | Environment Variable | Default | Description |
|-|-|-|-|
| `--config`, `-c` | `NOODLE_CONFIG` | `./noodle.json` | Path to the [scan configuration file](#scan-config-file). |
| `--output`, `-o` | `NOODLE_OUTPUT` | `./noodleScanOutput` | Path to the UI bundle output folder. |
| `--githubToken` | `NOODLE_GITHUB_TOKEN` | `null` | GitHub access token. Required for GitHub resources. |
| `--open` | - | `false` | Whether to open in the browser the bundled UI when finished. |
| `--workers` | `NOODLE_WORKERS` | 8 | Amount of workers for scanning the files of a resource. |
| `--verbose` | `NOODLE_VERBOSE` | `false` | Whether to print debug logs. |

#### Scan config file

You can find example of a config file in the [basic example](https://github.com/noodle-graph/monorepo/blob/master/examples/basic/noodle.json)

| Field | Required | Description |
|-|-|-|
| `plugins` | No | List of plugin import names. See [`examples/basic/noodleWithPlugin.json`](https://github.com/noodle-graph/monorepo/blob/master/examples/basic/noodleWithPlugin.json) |
| `resources` | Yes | List of [resources objects](#resource-object) to scan or declare. |

##### Resource object

| Field | Pattern | Required | Default | Description |
|-|-|-|-|-|
| `id` | a-z, number, forward slash, underscore, dash. RegEx: `[a-z\d-_/]+` | Yes | - | Identifier of the resource. |
| `name` | Any string | No | The value of `id` | The name of the resource. |
| `description` | Any string | No | `null` | Description of the resource. |
| `type` | See [UI icons](https://github.com/noodle-graph/monorepo/tree/master/packages/ui/public/img) | No | `null` | The type of the resource is deployed on |
| `tags` | a-z, number, forward slash, underscore, dash. RegEx: `[a-z\d-_/]+` | No | `[]` | Tags of the resource. For the UI view and filtering. |
| `url` | `null` if `source` is `config`, otherwise a valid URL. | Yes, except if `source` is `config`. | `null` | The URL of the source to scan. |
| `source` | `github`, `local`, `config` | No | `github` if `url` starts with `https://`, `config` if `url` is `null`, otherwise `local`. | The type of the source to scan. `config` sources won't get scanned. |
| `relationships` | [Relationship](https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/README.md#relationship-object) array | No | `null` | List of relationship to added regardless of scanning. |

### `serve`

```bash
noodle serve
```

Serves the result of [`noodle run`](#run).

#### Options

| Option | Environment Variable | Default | Description |
|-|-|-|-|
| `--production` | - | `false` | Use production options: `{ "port": 3000, "host": "0.0.0.0" }`. It will not open the browser and use default `pino` logger. |
| `--port`, `-p` | `NOODLE_PORT` | `0` | The port the server will listen to. |
| `--host`, `-p` | `NOODLE_HOST` | `127.0.0.1` | The host the server will listen to. |
| `--scanOutputDir` | `NOODLE_OUTPUT` | `./noodleScanOutput` | The output directory of `noodle run`. |

## Plugins

You can enrich the resource object in the output with plugins.

See [`examples/basic/noodleWithPlugin.json`](https://github.com/noodle-graph/monorepo/blob/master/examples/basic/noodleWithPlugin.json) for example.

For implementing a plugin, see the [CONTRIBUTING.md](https://github.com/noodle-graph/monorepo/blob/master/CONTRIBUTING.md#plugins) file.

## Contributing

See [CONTRIBUTING.md](https://github.com/noodle-graph/monorepo/blob/master/CONTRIBUTING.md)
