/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import FormData from "form-data";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getFullyQualifiedName } from "hardhat/utils/contract-names";
import { Readable } from "stream";

const DEFAULT_ENDPOINT = "https://sourcify.dev/server/";

function log(...args: any[]) {
  console.log(...args);
}

function logError(...args: any[]) {
  console.error("ERROR: ", ...args);
}

function ensureTrailingSlash(s: string): string {
  if (s.endsWith("/")) {
    s += "/";
  }
  return s;
}

function inferFullyQualifiedName(
  contractName: string,
  fullPath?: string,
  path?: string
) {
  let source = '';
  if (fullPath) {
    source = fullPath;
  } else {
    source = `contracts/${path || ''}`;
    if (!source.endsWith(".sol")) {
      source += `${source.endsWith("/") ? "" : "/"}${contractName}.sol`;
    }
  }

  return {
    fullName: getFullyQualifiedName(source, contractName),
    sourceName: source,
  };
}

export async function submitSourcesToSourcify(
  hre: HardhatRuntimeEnvironment,
  config: {
    contract?: string; // name, `Greeter`
    address: string;
    path?: string; // partial path, e.g. `extensions` for contracts/extensions/Greeter.sol
    fullPath?: string; // full path, e.g. `contracts-foo/Greeter.sol`
    chainId?: number;
    endpoint?: string;
    contractName?: string, // legacy
    sourceName?: string, // legacy
  }
): Promise<void> {
  config = config || {};
  // get config
  const chainId = config.chainId || hre.network.config.chainId;
  let { contract, fullPath, path, address } = config;

  // legacy fallback
  if (config.contractName) {
    contract = config.contractName;
  }
  if (config.sourceName) {
    fullPath = config.sourceName;
  }

  if (!contract) {
    logError("Please pass in the name of your contract using the `contract` parameter");
    return;
  }

  const url = config.endpoint
    ? ensureTrailingSlash(config.endpoint)
    : DEFAULT_ENDPOINT;

  if ((path && fullPath) ) {
    logError("Please use either the `path` or the `full-path` parameter");
    return;
  }

  const { fullName, sourceName } = inferFullyQualifiedName(contract, fullPath, path);

  log(`Verifying source code for contract "${contract}" located at [${sourceName}], deployed to [${address}] on chain id [${chainId}]...`)


  async function submit() {
    // get chosenContract (contract index in hardhat metadata file)
    const buildInfo = await hre.artifacts.getBuildInfo(fullName);
    // get contract index from output of build info
    let index;
    if (buildInfo) {
      index = Object.keys(buildInfo.output.contracts).indexOf(sourceName);
    } else {
      // throw error
      logError("Contract not found");
      return
    }

    const metadataString = JSON.stringify(buildInfo);

    try {
      const checkResponse = await axios.get(
        `${url}checkByAddresses?addresses=${address.toLowerCase()}&chainIds=${chainId}`
      );
      const { data: checkData } = checkResponse;
      if (checkData[0].status === "perfect" || checkData[0].status === "partial") {
        log(`Already verified: "${contract}" [${address}], skipping. Status = ${checkData[0].status}`);
        return;
      }
    } catch (e) {
      logError("Verification status check failed");
      logError(
        ((e as any).response && JSON.stringify((e as any).response.data)) || e
      );
    }

    if (!metadataString) {
      logError(
        `Contract ${contract} was deployed without saving metadata. Cannot submit to sourcify, skipping.`
      );
      return;
    }

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
        log(`SUCCESS:  => contract ${contract} is now verified, verification status = ${status}`);
      } else {
        logError(` => contract ${contract} is NOT verified, result = ${JSON.stringify(result, null, 2)}`);
      }
    } catch (e) {
      logError(` => contract ${contract} is NOT verified`);
      logError(
        ((e as any).response && JSON.stringify((e as any).response.data, null, 2)) || e
      );
    }
  }

  await submit();
}
