import { task } from "hardhat/config";
import * as types from "hardhat/internal/core/params/argumentTypes";
import { submitSourcesToSourcify } from "./sourcify";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

task("verify-sourcify", "verify contract using sourcify")
  .addParam("sourceName", "Path to contract, e.g contract/Greeter.sol", undefined, types.string)
  .addParam(
    "contractName",
    "Name of the contract you want to verify (e.g. Greeter)",
    undefined,
    types.string
  )
  .addParam("address", "address of the contract", undefined, types.string)
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
  .setAction(async (args, hre) => {
    // compile contract first
    const { endpoint, sourceName, contractName, address, chainId } = args;
    await hre.run("compile");
    await submitSourcesToSourcify(hre, {
      endpoint,
      sourceName,
      contractName,
      address,
      chainId,
    }).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  });
