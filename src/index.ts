import { task } from "hardhat/config";
import * as types from "hardhat/internal/core/params/argumentTypes";
import { submitSourcesToSourcify } from "./sourcify";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

task("verify-sourcify", "verify contract using sourcify")
  .addOptionalParam(
    "endpoint",
    "endpoint url for sourcify",
    undefined,
    types.string
  )
  .addParam("sourceName", "e.g contract/Greeter.sol", undefined, types.string)
  .addParam(
    "contractName",
    "Name of the contract you want to verify",
    undefined,
    types.string
  )
  .addParam("address", "address of the contract", undefined, types.string)
  .addOptionalParam(
    "chainId",
    "the chainId of the network that your contract deployed on",
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
