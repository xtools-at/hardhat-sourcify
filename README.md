# hardhat-sourcify
verify contracts with sourcify using hardhat

## Usage
- install plugin
```shell
yarn add -D @xtools-at/hardhat-sourcify
```

- import plugin in `hardhat.config`
```typescript
import "@xtools-at/hardhat-sourcify";
```

- verify contract
```shell
yarn hardhat --network beam-testnet verify-sourcify --contract-name "WETH" --source-name "contracts/WETH.sol" --address 0x123456
```

  - instead of using the `--network` param, you can pass in e.g. `--chain-id 13337` directly.
```shell
yarn hardhat verify-sourcify --contract-name "WETH" --source-name "contracts/WETH.sol" --address 0x123456 --chain-id 13337
```

- CLI help
```shell
yarn hardhat help verify-sourcify
```

## Build and publish lib

- sign up and get access token from [npmjs](https://npmjs.com)

### via Github actions

- add `NPM_TOKEN` to _Github actions_ secrets
- add annotated tag to branch:
```shell
git tag -a v0.1.2 -m "release 0.1.2"
```

- push all tags
```shell
git push --follow-tags
```

### manually

- use NodeJS v16+
- install repo dependencies using `npm i` (_not_ yarn)
- build
```shell
npm run build
```

- publish to npm
```shell
NPM_TOKEN=yourNpmAccessToken npm publish --access public
```

## History

**0.1.0**

- fork of [zoey-t's hardhat-sourcify](https://github.com/zoey-t/hardhat-sourcify) including prebuilt package and published latest version to npm
