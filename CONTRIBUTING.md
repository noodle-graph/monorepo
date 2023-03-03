# Contributing

First, thanks for considering contributing to the project! 🤩

If you have any question, feel free to [reach out](https://github.com/dormeiri).

- [Setup locally](#setup-locally)
- [Useful commands](#useful-commands)
  - [Common](#common)
  - [Generating a new package](#generating-a-new-package)
- [Testing packages locally](#testing-packages-locally)
  - [With link](#with-link)
  - [With local registry](#with-local-registry)
    - [Publish locally](#publish-locally)
    - [Installing a local package](#installing-a-local-package)
  - [Testing the CLI locally](#testing-the-cli-locally)
    - [Using link in the global CLI installation](#using-link-in-the-global-cli-installation)
  - [Testing the UI locally](#testing-the-ui-locally)
- [Automated tests](#automated-tests)

## Setup locally

```bash
npm install
```

Make sure you can have the environment variables for running [automated tests](#automated-tests).

To validate the setup, run the following commands:

1. `nx run-many --target=test`
2. `nx run-many --target=lint`
3. `nx run-many --target=build`

## Automated tests

Where available, you can run only unit tests with:

```bash
nx test:unit <project name>
```

And only integration tests with:

```bash
nx test:integration <project name>
```

The integration tests need the following environment variables:

- `NOODLE_GITHUB_TOKEN` -- Some GitHub token for cloning this repo when scanning.

_NOTE:_ Code that requires integration should be separated from code that doesn't.
That will help keeping the separation in tests as well.

All projects have a `test` command that tests both unit and integration:

```bash
nx test <project name>
```

## Useful commands

### Common

```bash
npx nx lint <project name>
npx nx lint <project name>
npx nx test <project name>
npx nx test:unit <project name>
npx nx test:integration <project name>
npx nx build <project name>
```

_Read more about [running tasks with Nx](https://nx.dev/core-features/run-tasks)_

### Generating a new package

```bash
npm run generate:package <project name>
```

## Testing packages locally

### With link

In the package `dist` folder run `npm link`

And then in your consumer run `npm link @noodle-graph@<project>`

Run `npm unlink` in the package `dist` folder to remove the link.

Run `nx build <project>` to take changes you make into the consumer.

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

By default, the version is `0.0.0-local.1` with the tag `local` and the registry is `http://localhost:4873`, you can explore more in [publish.mjs](tools/scripts/publish.mjs) and [local-registry.mjs](tools/scripts/local-registry.mjs)

_In local environment, the version is being overwritten if it is already exist._

#### Installing a local package

npm:

```bash
npm install @noodle-graph/<package name>@local --registry=http://localhost:4873
```

yarn:

```bash
yarn add @noodle-graph/<package name>@local --registry=http://localhost:4873
```

### Testing the CLI locally

```bash
nx build:global cli
```

That will build and install the CLI globally on your local machine. Then you can run the CLI.

Be aware that this will also `npm link @noodle-graph/scanner` the global CLI module. To avoid that, you can do:

```bash
nx build cli
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
