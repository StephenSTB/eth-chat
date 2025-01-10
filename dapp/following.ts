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

let publicKeys: any;


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

    publicKeys = deployed[network]["PublicKeys"].address;

    await deployFollowing();

    await followSteve();

    await getFollowing();

    await numFollowers();

    process.exit(0)
}

const deployFollowing = async () =>{
    console.log(yellow(), "Deploying Following...")
    const followingDeployed = await engine.deploy(network, "Following", [publicKeys], {from: account0})

    console.log(followingDeployed);

    if(followingDeployed.success){
        console.log(followingDeployed.deployed._address)
    }
    const public_keys = await engine.sendTransaction(network, {from: account0}, "Following", "Public_Keys", [], true)
    console.log(public_keys)

}

const followSteve = async () =>{
    console.log(yellow(), "Following...")
   
    await engine.sendTransaction(network, {from: account0}, "Following", "follow", [account1 as string])

    const follow_tx = await engine.sendTransaction(network, {from: account0}, "Following", "FollowingChannel", [account0, 0], true);

    console.log(follow_tx)

    const follow_tx1 = await engine.sendTransaction(network, {from: account0}, "Following", "Follows", [account0, account1], true);
    console.log(follow_tx1)

    await engine.sendTransaction(network, {from: account1}, "Following", "follow", [account0 as string])

    const follow_tx2 = await engine.sendTransaction(network, {from: account1}, "Following", "FollowingChannel", [account1, 0], true);

    console.log(follow_tx2)

    const follow_tx3 = await engine.sendTransaction(network, {from: account1}, "Following", "Follows", [account1, account0], true);
    console.log(follow_tx3)

    const following_tx = await engine.sendTransaction(network, {from: account0}, "Following", "following", [0, 1], true);

    console.log(following_tx.transaction[0])

}

const getFollowing = async () =>{
    console.log(yellow(), "Getting Following...")

    const number = await engine.sendTransaction(network, {from: account0}, "Following", "numFollowing", [], true)
    console.log(number)
    const following = await engine.sendTransaction(network, {from: account0}, "Following", "following", [0, number.transaction], true)
    console.log(following)
}

const numFollowers = async () =>{

    const number = await engine.sendTransaction(network, {from: account0}, "Following", "numFollowers", [account0], true)

    console.log(number)

    const transaction = await engine.sendTransaction(network, {from: account0}, "Following", "FollowersChannel", [account0, Number(number.transaction) - 1 ], true)

    console.log(transaction)

}

main();