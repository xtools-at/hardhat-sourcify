# hardhat-sourcify
Verify smart contracts with Sourcify using Hardhat.

## Install

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
- CLI help
```shell
npx hardhat help verify-sourcify
```

## Use

- verify contract `NFT` in `contracts/NFT.sol`:
```shell
npx hardhat --network beam verify-sourcify --contract "NFT" --address 0x12345...
```
- verify contract `NFT` in `contracts/NFT.sol`, overriding the network's chain id:
```shell
npx hardhat verify-sourcify --chain-id 4337 --contract "NFT" --address 0x12345...
```
- verify contract `NFT` in `contracts/extensions/NFT.sol`:
```shell
npx hardhat --network beam verify-sourcify --contract "NFT" --path "extensions" --address 0x12345...
```
- verify contract `NFT` in `contracts/extensions/OtherFilename.sol`:
```shell
npx hardhat --network beam verify-sourcify --contract "NFT" --path "extensions/OtherFilename.sol" --address 0x12345...
```
- verify contract `NFT` in `contracts-custom42/extensions/OtherFilename.sol`:
```shell
npx hardhat --network beam verify-sourcify --contract "NFT" --full-path "contracts-custom42/extensions/OtherFilename.sol" --address 0x12345...
```

## Build and publish lib

- sign up and get access token from [npmjs](https://npmjs.com)

### via Github actions

- add `NPM_TOKEN` to _Github actions_ secrets
- create a Github access token and add it to the secrets as `RELEASE_TOKEN`
- bump the package version in `package.json`
- add annotated tag to branch:
```shell
git tag -a v0.2.0 -m "release 0.2.0"
```
- push all tags
```shell
git push --follow-tags
```

### manually

- install Node.js v16+
- install repo dependencies using `npm i` (_not_ yarn)
- bump the package version in `package.json`
- build
```shell
npm run build
```
- publish to npm
```shell
NPM_TOKEN=yourNpmAccessToken npm publish --access public
```

## History

**0.2.0**

- new streamlined interface (backwards compatible), less typing necessary

**0.1.1 - 0.1.2**

- fixed minor build issue with yarn, improved log messages

**0.1.0**

- fork of [zoey-t's hardhat-sourcify](https://github.com/zoey-t/hardhat-sourcify) including prebuilt package and published latest version to npm
