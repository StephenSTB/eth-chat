import { providers } from "@sb-labs/web3-data/networks/Providers.js"

import {Providers} from "@sb-labs/web3-data/networks/Providers.js"

import {deployed} from "@sb-labs/web3-data/networks/DeployedContracts.js"

import { Web3Engine } from "@sb-labs/web3-engine/Web3Engine.js";

import { EngineArgs } from "@sb-labs/web3-engine/Web3Engine.js";

import { contractFactoryV2 } from "@sb-labs/contract-factory-v2/ContractFactoryV2.js"

import { green, yellow, red, gray } from "@sb-labs/web3-data/functions/ConsoleColors.js";

import fs from "fs"

import { ecrecover, toBuffer } from "ethereumjs-util";
import { decrypt } from "eciesjs";

let engine : Web3Engine;

let wallet: any

let account0: string;

let account1: string;

let mnemonic : string;

const network: string = "Sepolia"

try{
    mnemonic = (fs.readFileSync("../secret/.secret-mn-ganache")).toString()
}catch{
    mnemonic = (fs.readFileSync("../../secret/.secret-mn-ganache")).toString()
}

const main = async () =>{

    let prvdrs = {} as Providers;

    prvdrs[network] = providers[network]

    const engineArgs = 
    {
        browser: false,
        mnemonic, 
        defaultAccount: 0,
        networks: [network], 
        defaultNetwork: network, 
        providers: prvdrs, 
        deployed, 
        contractFactory: contractFactoryV2, 
        contractFactoryVersion: 2
    } as EngineArgs

    engine = await Web3Engine.initialize(engineArgs);

    wallet = engine.defaultInstance?.wallet;

    account0 = wallet[0].address as string;

    account1 = wallet[1].address as string;

    await deployPublicKeys();

    process.exit(0)
}

const deployPublicKeys = async () =>{
    console.log(yellow(), "Deploying PublicKeys...")
    const publicKeysDeployed = await engine.deploy(network, "PublicKeys", [], {from: account0})

    //console.log(publicKeysDeployed)

    console.log(publicKeysDeployed.deployed._address)

    const enableHash  = await engine.sendTransaction(network, {from: account0}, "PublicKeys", "EnableHash", [], true)

    console.log(enableHash.transaction)

    const sig0 = await engine.defaultInstance?.wallet[0].sign("Enable Public Key.")
    console.log(sig0)
    
    const publicKey0 = await engine.sendTransaction(network, {from: account0}, "PublicKeys", "register", [sig0?.signature])
    console.log(publicKey0)
    
    const sig1 = await engine.defaultInstance?.wallet[1].sign("Enable Public Key.")

    const publicKey1 = await engine.sendTransaction(network, {from: account1}, "PublicKeys", "register", [sig1?.signature])
    console.log(publicKey1)

}

main();
