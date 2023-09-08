import { task } from "hardhat/config";
import * as types from "hardhat/internal/core/params/argumentTypes";
import { submitSourcesToSourcify } from "./sourcify";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

task("verify-sourcify", "verify contract using sourcify")
  .addOptionalParam(
    "contract",
    "Name of the contract you want to verify (e.g. `Greeter`)",
    undefined,
    types.string
  )
  .addParam(
    "address",
    "Address of the contract",
    undefined,
    types.string
  )
  .addOptionalParam(
    "path",
    "Path to contract in default contract folder, e.g `extensions/Foo.sol` or `extensions` (for 'contracts/extensions/Greeter.sol'). Can be omitted if filename is the same as `contractName`, and file isn't in a subfolder. ",
    undefined,
    types.string
  )
  .addOptionalParam(
    "fullPath",
    "Full relative path to contract, e.g `contracts-custom/Greeter.sol`. Overrides `path` completely",
    undefined,
    types.string
  )
  .addOptionalParam(
    "chainId",
    "The chainId of the network that your contract deployed on, if `--network` isn't used",
    undefined,
    types.string
  )
  .addOptionalParam(
    "endpoint",
    "Endpoint url for Sourcify",
    undefined,
    types.string
  )
  .addOptionalParam(
    "contractName",
    "Legacy param for `contract`, do not use",
    undefined,
    types.string
  )
  .addOptionalParam(
    "sourceName",
    "Legacy param for `full-path`, do not use",
    undefined,
    types.string
  )
  .setAction(async (args, hre) => {
    // compile contracts first
    await hre.run("compile");

    const { endpoint, fullPath, path, contract, address, chainId, contractName, sourceName } = args;
    await submitSourcesToSourcify(hre, {
      contract,
      address,
      path,
      fullPath,
      chainId,
      endpoint,
      contractName,
      sourceName,
    }).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  });
