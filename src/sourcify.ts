/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import FormData from "form-data";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getFullyQualifiedName } from "hardhat/utils/contract-names";
import { Readable } from "stream";

function log(...args: any[]) {
  console.log(...args);
}

function logError(...args: any[]) {
  console.log(...args);
}

function logInfo(...args: any[]) {
  console.log(...args);
}

function logSuccess(...args: any[]) {
  console.log(...args);
}

function ensureTrailingSlash(s: string): string {
  const lastChar = s.substr(-1);
  if (lastChar !== "/") {
    s = s + "/";
  }
  return s;
}

const defaultEndpoint = "https://sourcify.dev/server/";

export async function submitSourcesToSourcify(
  hre: HardhatRuntimeEnvironment,
  config: {
    endpoint?: string;
    sourceName: string; // path ./contracts/Greeter.sol
    contractName: string; // name Greeter
    address: string;
    chainId?: number;
  }
): Promise<void> {
  config = config || {};
  //   get chainId
  const chainId = config.chainId || hre.network.config.chainId;
  log(`Verifying source code for contract "${config.contractName}" deployed to [${config.address}] on chain id [${chainId}]...`)

  const url = config.endpoint
    ? ensureTrailingSlash(config.endpoint)
    : defaultEndpoint;

  async function submit(name: string) {
    // get chosenContract index
    /// get chosenContract (contract index in hardhat metadata file)
    const fullyQualifiedName = getFullyQualifiedName(
      config.sourceName,
      config.contractName
    );
    const buildinfo = await hre.artifacts.getBuildInfo(fullyQualifiedName);
    /// get contract index from output of buildinfo
    let index;
    if (buildinfo) {
      index = Object.keys(buildinfo.output.contracts).indexOf(
        config.sourceName
      );
    } else {
      // throw error
      logError("Contract not found");
      return
    }
    const address = config.address;
    const metadataString = JSON.stringify(buildinfo);

    try {
      const checkResponse = await axios.get(
        `${url}checkByAddresses?addresses=${address.toLowerCase()}&chainIds=${chainId}`
      );
      const { data: checkData } = checkResponse;
      console.log(checkData[0].status);
      if (checkData[0].status === "perfect") {
        log(`already verified: ${name} (${address}), skipping.`);
        return;
      }
    } catch (e) {
      logError(
        ((e as any).response && JSON.stringify((e as any).response.data)) || e
      );
    }

    if (!metadataString) {
      logError(
        `Contract ${name} was deployed without saving metadata. Cannot submit to sourcify, skipping.`
      );
      return;
    }

    logInfo(`verifying ${name} (${address} on chain ${chainId}) ...`);

    const formData = new FormData();
    formData.append("address", address);
    formData.append("chain", chainId);
    formData.append("chosenContract", index);

    const fileStream = new Readable();
    fileStream.push(metadataString);
    fileStream.push(null);
    formData.append("files", fileStream, "metadata.json");

    try {
      const submissionResponse = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });
      const result = submissionResponse.data.result[0];
      const status = result.status;
      if (status === "perfect" || status === "partial") {
        logSuccess(` => SUCCESS: contract ${name} is now verified, verification status = ${status}`);
      } else {
        logError(` => ERROR: contract ${name} is NOT verified, result = ${JSON.stringify(result, null, 2)}`);
      }
    } catch (e) {
      logError(` => ERROR: contract ${name} is NOT verified`);
      logError(
        ((e as any).response && JSON.stringify((e as any).response.data, null, 2)) || e
      );
    }
  }

  if (config.contractName) {
    await submit(config.contractName);
  } else {
    logError("Error: contract name not specified");
  }
}
