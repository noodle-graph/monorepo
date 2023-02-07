# Noodle Graph Monorepo (UNDER CONSTRUCTION 🏗️)

Automated microservices architecture graph generator.

---

- [Contributing](#contributing)
  - [Setup](#setup)
  - [Commands](#commands)
    - [Common](#common)
    - [Generating a new package](#generating-a-new-package)
  - [Testing packages locally](#testing-packages-locally)
    - [With link](#with-link)
    - [With local registry](#with-local-registry)

## Contributing

### Setup

```bash
npm ci
```

### Commands

#### Common

```bash
npx nx lint <project name>
npx nx test <project name>
npx nx build <project name>
```

_Read more about [running tasks with Nx](https://nx.dev/core-features/run-tasks)_

#### Generating a new package

```bash
npm run generate:package <project name>
```

### Testing packages locally

#### With link

In the package `dist` folder run `npm link`

And then in your consumer run `npm link @noodle-graph@<project>`

Run `npm unlink` in the package `dist` folder to remove the link.

Run `nx build <project>` to take changes you make into the consumer.

#### With local registry

We are using [verdaccio](https://verdaccio.org/) for the local registry.

We have some commands to make it even more easy:

```bash
npm run local-registry help
```

See more in [local-registry.mjs](tools/scripts/local-registry.mjs)

##### Publish locally

```bash
npm run local-registry publish <project name>
```

By default, the version is `0.0.0-local.1` with the tag `local` and the registry is `http://localhost:4873`, you can explore more in [publish.mjs](tools/scripts/publish.mjs) and [local-registry.mjs](tools/scripts/local-registry.mjs)

_In local environment, the version is being overwritten if it is already exist._

##### Installing a local package

npm:

```bash
npm install @noodle-graph/<package name>@local --registry=http://localhost:4873
```

yarn:

```bash
yarn add @noodle-graph/<package name>@local --registry=http://localhost:4873
```
