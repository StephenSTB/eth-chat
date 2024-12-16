import { providers } from "@sb-labs/web3-data/networks/Providers.js"

import {Providers} from "@sb-labs/web3-data/networks/Providers.js"

import {deployed} from "@sb-labs/web3-data/networks/DeployedContracts.js"

import { Web3Engine } from "@sb-labs/web3-engine/Web3Engine.js";

import { EngineArgs } from "@sb-labs/web3-engine/Web3Engine.js";

import { contractFactoryV2 } from "@sb-labs/contract-factory-v2/ContractFactoryV2.js"

import Web3 from "web3"

import fs from "fs"

import { Contract } from "@sb-labs/web3-data/interfaces/Contract.js";

///import {v4 as uuidv4} from "uuid"

let engine : Web3Engine;

let wallet: any

let account: string;

let UUID_Connect : Contract;

let web3: Web3

let mnemonic : string;

let uuid: string;

try{
    mnemonic = (fs.readFileSync("../secret/.secret-mn-ganache")).toString()
}catch{
    mnemonic = (fs.readFileSync("../../secret/.secret-mn-ganache")).toString()
}

try{
    uuid = (fs.readFileSync("../secret/.uuid")).toString()
}catch{
    uuid = (fs.readFileSync("../../secret/.uuid")).toString()
}

const main = async () =>{

    let prvdrs = {} as Providers;

    prvdrs["Sepolia"] = providers["Sepolia"]

    const engineArgs = 
    {
        browser: false,
        mnemonic, 
        defaultAccount: 0,
        networks: ["Sepolia"], 
        defaultNetwork: "Sepolia", 
        providers: prvdrs, 
        deployed, 
        contractFactory: contractFactoryV2, 
        contractFactoryVersion: 2
    } as EngineArgs

    engine = await Web3Engine.initialize(engineArgs);

    wallet = engine.defaultInstance?.wallet;

    account = wallet[0].address as string;

    await deploy()
    
    process.exit(0)
}

function green(){
    return '\x1b[32m%s\x1b[0m'
}

async function deploy(){

    console.log(green(), "Deploy")
    const uuidconnectsDeployed = await engine.deploy("Sepolia", "UUIDConnect", [], {from: account})

    if(uuidconnectsDeployed.success){
        UUID_Connect = uuidconnectsDeployed.deployed
    }

    console.log(UUID_Connect.methods)
    console.log(UUID_Connect.options.address)
    //uuid = uuidv4()
    console.log(uuid)
    const connection = await engine.sendTransaction("Sepolia", {from: account}, "UUIDConnect", "setUUID", [uuid])
    console.log(connection)
}

main()