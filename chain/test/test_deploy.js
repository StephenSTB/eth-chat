import { Web3Engine } from "@sb-labs/web3-engine/Web3Engine";
import { providers } from "@sb-labs/web3-data/networks/Providers";
import { deployed } from "@sb-labs/web3-data/networks/DeployedContracts";
import { contractFactoryV2 } from "@sb-labs/contract-factory-v2";
import fs from "fs";
let engine;
let wallet;
let mnemonic;
let account;
const network = "Ganache";
try {
    mnemonic = (fs.readFileSync("../secret/.secret-mn-ganache")).toString();
}
catch {
    mnemonic = (fs.readFileSync("../../secret/.secret-mn-ganache")).toString();
}
// create avatar transaction 
let prvdrs = {};
prvdrs[network] = providers[network];
const engineArgs = {
    browser: false,
    mnemonic,
    defaultAccount: 0,
    networks: [network],
    defaultNetwork: network,
    providers: prvdrs,
    deployed,
    contractFactory: contractFactoryV2,
    contractFactoryVersion: 2
};
engine = await Web3Engine.initialize(engineArgs);
wallet = engine.defaultInstance?.wallet;
account = wallet[0].address;
const main = async () => {
    // deploy
    await deploy();
    process.exit(0);
};
const deploy = async () => {
    let result = await engine.deploy(network, "Name", [], { from: account });
    console.log(result.deployed.options.address);
};
main();
// axios post
