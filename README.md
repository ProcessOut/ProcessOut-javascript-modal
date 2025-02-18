# ProcessOut.js

The ProcessOut's full API documentation can be found on [our documentation](https://docs.processout.com).
You can also find ProcessOut.js specific documentation for [Card tokenization setup](https://docs.processout.com/docs/tokenizing-a-card-in-the-browser),  [Dynamic Checkout](https://docs.processout.com/docs/dynamic-checkout-web) and [Embedded/Native APMs](https://docs.processout.com/docs/sdks-embedded-components).

## Prerequisites

- Node.js (v18.17.1)
- Yarn (v1.22.22)

## Installation

To develop ProcessOut.js locally you need to install the dependencies by running the following command:
```bash
yarn install
```

It will install all the dependencies needed to run the project in development mode, lint, format and build it.

## Building

To build the project to get final `processout.js` and `modal.js` scripts, run the following command:

```bash
yarn build
```

It will create the `dist` folder with the final scripts.

## Versioning

To bump the version of ProcessOut.js, run the following command:

`yarn bump-version --patch` or `yarn bump-version --minor` or `yarn bump-version --major` or `yarn bump-version` and specify the version you want to bump to.

This will bump the version of the project inside the package.json file and create Git tag and commit with the new version. The version will then append to the `dist/processout.js` and `dist/modal.js` files when building the project and will be used to identify the version of the ProcessOut.js with every request to the ProcessOut API. Keep in mind that this is just internal versioning for logging purposes, it doesn't affect how merchants use the ProcessOut.js.

**Every time you make a change to the project with new features or bug fixes, you should bump the version of the project.**

## Development

To run the development environment, run the following command:

```bash
yarn dev
```

This will start the development server and the TypeScript compiler in watch mode. The development server will be available at [http://localhost:3000](http://localhost:3000). Every change you make will be reflected in the browser automatically.

## Testing

To run the tests, run the following command:

```bash
yarn test
```

## Linting

To run the linting, run the following command:

```bash
yarn lint
```

## Formatting

To run the formatting, run the following command:

```bash
yarn format
```

This will format the code according to the Prettier rules.

