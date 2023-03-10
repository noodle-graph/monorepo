# Contributing

First, thanks for considering contributing to the project! 🤩

If you have any question, feel free to [reach out](https://github.com/dormeiri).

- [Setup locally](#setup-locally)
- [Automated tests](#automated-tests)
- [Useful commands](#useful-commands)
  - [Common](#common)
  - [Generating a new package](#generating-a-new-package)
- [Plugins](#plugins)
  - [Plugin Lifecycle](#plugin-lifecycle)
- [Testing packages locally](#testing-packages-locally)
  - [With link](#with-link)
  - [With local registry](#with-local-registry)
    - [Publish locally](#publish-locally)
    - [Installing a local package](#installing-a-local-package)
  - [Testing the CLI locally](#testing-the-cli-locally)
    - [Using link in the global CLI installation](#using-link-in-the-global-cli-installation)
  - [Testing the UI locally](#testing-the-ui-locally)

## Setup locally

```bash
npm install
```

Make sure you can have the environment variables for running [automated tests](#automated-tests).

To validate the setup, run the following commands:

1. `npx nx run-many --target=lint`
2. `npx nx run-many --target=build`

## Automated tests

Where available, you can run only unit tests with:

```bash
npx nx test:unit <project name>
```

And only integration tests with:

```bash
npx nx test:integration <project name>
```

The integration tests need the following environment variables:

- `NOODLE_GITHUB_TOKEN` -- Some GitHub token for cloning this repo when scanning.

All projects have a `test` command that run both unit and integration tests:

```bash
npx nx test <project name>
```

## Useful commands

### Common

```bash
npx nx lint <project name>
npx nx test <project name>
npx nx test:unit <project name>
npx nx test:integration <project name>
npx nx build <project name>
```

If Nx cache evaluated incorrectly, use the option `--skip-nx-cache`

_Read more about [running tasks with Nx](https://nx.dev/core-features/run-tasks)_

### Generating a new package

```bash
npm run generate:package <project name>
```

## Plugins

To add a plugin, you just need to implement the [NoodlePlugin](https://github.com/noodle-graph/monorepo/blob/master/packages/types/src/index.ts#L1) interface.

Check [Type Evaluator Plugin](https://github.com/noodle-graph/monorepo/blob/master/packages/plugin-type-evaluator/src/index.ts) for example.

For contributing a new plugin to the ecosystem, feel free to add it to this repository by [generating a new package](#generating-a-new-package).

### Plugin Lifecycle

For now there is only one phase in the lifecycle, which is `enrich`. That happens after the scan is finished and you have a list of resources with relationships.

## Testing packages locally

### With link

In the package `dist` folder run `npm link`

And then in your consumer run `npm link @noodle-graph@<project>`

Run `npm unlink @noodle-graph@<project>` to unlink the package.

Run `npx nx build <project>` to take changes you make into the consumer.

You can check the existing links with `npm list -g --depth=0`

### With local registry

We are using [verdaccio](https://verdaccio.org/) for the local registry.

We have some commands to make it even more easy:

```bash
npm run local-registry help
```

See more in [local-registry.mjs](tools/scripts/local-registry.mjs)

#### Publish locally

```bash
npm run local-registry publish <project name>
```

By default, the version is `0.0.0-local.1` with the tag `local` and the registry is `http://localhost:4873`, you can explore more in [publish.js](tools/scripts/publish.js) and [local-registry.mjs](tools/scripts/local-registry.mjs)

_In local environment, the version is being overwritten if it is already exist._

#### Installing a local package

```bash
npm install @noodle-graph/<package name>@local --registry=http://localhost:4873
```

### Testing the CLI locally

#### Without global installation

```bash
npx nx build cli
node packages/cli/dist
```

If you want to test the scanner you can link it or use local registry.

#### With global installation

```bash
npx nx build:global cli
```

That will build and install the CLI globally on your local machine. Then you can run the CLI.

Be aware that this will also `npm link @noodle-graph/scanner` to the global CLI module. To avoid that, you can do:

```bash
npx nx build cli
cd packages/cli/dist
npm i -g .
```

#### Using link in the global CLI installation

You can also `npm link` packages in the global CLI by changing the directory of the global module.

For example:

```bash
cd $(npm root -g)/@noodle-graph/cli
npm link @noodle-graph/scanner
```

To print out linked packages you can run:

```bash
npm list -g --depth=0
```

### Testing the UI locally

1. Run a scan somewhere, for example in [the basic example](./examples/basic)
2. Search for the `scanOutput.js` file that was generated and copy the content of that file.
3. Go to the [scanOutput.js](./packages/ui/public/scanOutput.js) in the UI project and replace it with the content you have just copied.
4. Run `nx start ui`, you should see the scan results. Changes you do in the `src` files, will change the UI.

_Make sure you don't push the `scanOutput.js` file_
