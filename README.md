# hardhat-sourcify
Verify smart contracts with Sourcify using Hardhat.

## Usage
- install plugin
```shell
yarn add -D @xtools-at/hardhat-sourcify
```
- import plugin in `hardhat.config`
```typescript
import "@xtools-at/hardhat-sourcify";
// or
require("@xtools-at/hardhat-sourcify");
```
- verify contract using a configured network in `hardhat.config`
```shell
npx hardhat --network beam verify-sourcify --contract-name "NFT" --source-name "contracts/NFT.sol" --address 0x12345...
```
- verify contract passing in chain id directly
```shell
npx hardhat verify-sourcify --contract-name "NFT" --source-name "contracts/NFT.sol" --address 0x12345... --chain-id 4337
```
- CLI help
```shell
npx hardhat help verify-sourcify
```

## Build and publish lib

- sign up and get access token from [npmjs](https://npmjs.com)

### via Github actions

- add `NPM_TOKEN` to _Github actions_ secrets
- create a Github access token and add it to the secrets as `RELEASE_TOKEN`
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

**0.1.3**

- fixed minor build issue with yarn, improved log messages

**0.1.0**

- fork of [zoey-t's hardhat-sourcify](https://github.com/zoey-t/hardhat-sourcify) including prebuilt package and published latest version to npm
