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

const network: string = "Ganache"

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

    //await deployPublicKeys();

    //await deployFollowing();

    //await follow();

    publicKeys = deployed[network]["PublicKeys"].address;
    
    await deployMessages();

    await message();

    process.exit(0)
}

const deployPublicKeys = async () =>{
    console.log(yellow(), "Deploying PublicKeys...")
    const publicKeysDeployed = await engine.deploy(network, "PublicKeys", [], {from: account0})

    //console.log(publicKeysDeployed)

    console.log(publicKeysDeployed.deployed._address)

    publicKeys = publicKeysDeployed.deployed._address;

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

const follow = async () =>{
    console.log(yellow(), "Following...")
   
    await engine.sendTransaction(network, {from: account0}, "Following", "follow", [account1 as string])

    const follow_tx = await engine.sendTransaction(network, {from: account0}, "Following", "FollowingChannel", [account0, 0], true);

    console.log(follow_tx)

    const follow_tx1 = await engine.sendTransaction(network, {from: account0}, "Following", "Following", [account0, account1], true);
    console.log(follow_tx1)

    await engine.sendTransaction(network, {from: account1}, "Following", "follow", [account0 as string])

    const follow_tx2 = await engine.sendTransaction(network, {from: account1}, "Following", "FollowingChannel", [account1, 0], true);

    console.log(follow_tx2)

    const follow_tx3 = await engine.sendTransaction(network, {from: account1}, "Following", "Following", [account1, account0], true);
    console.log(follow_tx3)

    const following_tx = await engine.sendTransaction(network, {from: account0}, "Following", "following", [0, 1], true);

    console.log(following_tx.transaction[0])

}

const deployMessages = async () =>{
    console.log(yellow(), "Deploying Messages...")
    const messagesDeployed = await engine.deploy(network, "Messages", [publicKeys], {from: account0})

    console.log(messagesDeployed);

    if(messagesDeployed.success){
        console.log(messagesDeployed.deployed._address)

    }
}

const message = async () =>{

    console.log(yellow(), "Sending Message")

    const enableHash  = await engine.sendTransaction(network, {from: account0}, "PublicKeys", "EnableHash", [], true)
    console.log(enableHash.transaction)

    const publicKey1 = await engine.sendTransaction(network, {from: account0}, "PublicKeys", "SignKeys", [account1], true)

    console.log(publicKey1)

    let keybuf1 = new Uint8Array( Buffer.from("04" + ecrecover(toBuffer(enableHash.transaction), Number(publicKey1.transaction.v), toBuffer(publicKey1.transaction.r), toBuffer(publicKey1.transaction.s)).toString('hex'), "hex"))
    console.log(keybuf1)

    const encrypted_message = await engine.encrypt(keybuf1, "Hello World!")

    console.log(encrypted_message)


    const msg = {
        to: account1,
        value: 0,
        message: "Hello World!",
        encrypted_message,
    }

    const message = await engine.sendTransaction(network, {from: account0}, "Messages", "sendMessage", [[msg.to, msg.value, msg.message, msg.encrypted_message]])

    console.log(message);

    const getmessage = await engine.sendTransaction(network, {from: account1}, "Messages", "MessagesChannel", [account1, account0, 0], true)   

    console.log(getmessage)

    const numMessages = await engine.sendTransaction(network, {from: account1}, "Messages", "numMessages", [account0], true)

    console.log(numMessages)

    const decrypted_message = (await engine.decrypt(1, new Uint8Array(Buffer.from(getmessage.transaction.message_encrypted.slice(2), "hex")))).toString();

    console.log(decrypted_message)
}

main()