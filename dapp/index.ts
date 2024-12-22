import { providers } from "@sb-labs/web3-data/networks/Providers.js"

import {Providers} from "@sb-labs/web3-data/networks/Providers.js"

import {deployed} from "@sb-labs/web3-data/networks/DeployedContracts.js"

import { Web3Engine } from "@sb-labs/web3-engine/Web3Engine.js";

import { EngineArgs } from "@sb-labs/web3-engine/Web3Engine.js";

import { contractFactoryV2 } from "@sb-labs/contract-factory-v2/ContractFactoryV2.js"

import { green, yellow, red, gray } from "@sb-labs/web3-data/functions/ConsoleColors.js";

import fs from "fs"

import { ecrecover, toBuffer } from "ethereumjs-util";

import {v4 as uuidv4} from "uuid"

let engine : Web3Engine;

let wallet: any

let account0: string;

let account1: string;

let mnemonic : string;

let uuid: string;

let uuid0: string;

let uuid1: string;

const network: string = "Sepolia"

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

    //await deployUUIDConnect()

    await deployCall();

    //await enableSignKey();
    
    //await setCallChannel0();

    process.exit(0)
}


async function deployUUIDConnect(){

    console.log(green(), "Deploy")
    const uuidconnectsDeployed = await engine.deploy(network, "UUIDConnect", [], {from: account0})

    if(uuidconnectsDeployed.success){
        //uuid = uuidv4()
        //console.log(uuid)
        const connection = await engine.sendTransaction(network, {from: account0}, "UUIDConnect", "setUUID", [uuid])
        console.log(connection)
    }
}

async function deployCall(){
    console.log(yellow(), "Deploying Call...")
    const callDeployed = await engine.deploy(network, "Call", [], {from: account0})

    //console.log(callDeployed)

    if(callDeployed.success){
        console.log(green(), "Call Deployed")
    }
}

async function enableSignKey() {
        console.log(yellow(), "Enabling Sign Key for 0...")
        const publicKey0 = await engine.sendTransaction(network, {from: account0}, "Call", "SignKeys", [account0], true)
        console.log(publicKey0.transaction.v)

        if(publicKey0.transaction.v == 0){
            
            let sig = await engine.defaultInstance?.wallet[0].sign("Enable Public Key.")
            await engine.sendTransaction(network, {from: account0}, "Call", "register" , [sig?.signature])
            const publicKey0 = await engine.sendTransaction(network, {from: account0}, "Call", "SignKeys", [account0], true)
            console.log(publicKey0)

            if(publicKey0.transaction.v != 0){
                console.log(green(), "Enabled Sign Key 0")
                
            }
        }

        console.log(yellow(), "Enabling Sign Key for 1...")
        const publicKey1 = await engine.sendTransaction(network, {from: account1}, "Call", "SignKeys", [account1], true)
        console.log(publicKey1.transaction.v)

        if(publicKey1.transaction.v == 0){
            
            let sig = await engine.defaultInstance?.wallet[1].sign("Enable Public Key.")
            await engine.sendTransaction(network, {from: account1}, "Call", "register" , [sig?.signature])
            const publicKey1 = await engine.sendTransaction(network, {from: account1}, "Call", "SignKeys", [account1], true)
            console.log(publicKey1)

            if(publicKey0.transaction.v != 0){
                console.log(green(), "Enabled Sign Key 1")
            }
        }
    
}

interface CallChannel{
    encryptedSender: string;
    encryptedUser: string
}

async function setCallChannel0() {

    console.log(gray(), "Setting call channel 0.")
    // get enable hash
    console.log(yellow(), "Get enable hash")
    const enableHash = await engine.sendTransaction(network, {from: account0}, "Call", "EnableHash", [], true)
    console.log(green(), enableHash)
    // get public key1 rsv
    const publicKey1 = await engine.sendTransaction(network, {from: account0}, "Call", "SignKeys", [account1], true)
    // get public key1 hex
    let keybuf1 = new Uint8Array( Buffer.from("04" + ecrecover(toBuffer(enableHash.transaction), Number(publicKey1.transaction.v), toBuffer(publicKey1.transaction.r), toBuffer(publicKey1.transaction.s)).toString('hex'), "hex"))
    console.log(keybuf1)
    // encrypt uuid with public key1
    uuid0 = uuidv4()
    let encrypted0 = await engine.encrypt(keybuf1, uuid0)
    console.log(green(),"uuid0 encrypted0 with publicKey1: ", encrypted0)
    /*
    const encrypted00 = {
        iv: encrypted0.iv,
        ephemPublicKey: encrypted0.ephemPublicKey,
        ciphertext: encrypted0.ciphertext,
        mac: encrypted0.mac,
    }as EncryptedMessage*/

    //let decrypted = await engine.decrypt(1, encrypted00)
    //console.log(decrypted)
    // get public key0 rsc
    const publicKey0 = await engine.sendTransaction(network, {from: account0}, "Call", "SignKeys", [account0], true)
    // get public key0 hex
    let keybuf0 = new Uint8Array(Buffer.from("04" + ecrecover(toBuffer(enableHash.transaction), Number(publicKey0.transaction.v), toBuffer(publicKey0.transaction.r), toBuffer(publicKey0.transaction.s)).toString('hex'), "hex"))
    // encrypt uuid with public key0
    let encrypted1 = await engine.encrypt(keybuf0, uuid0)

    console.log(green(),"uuid0 encrypted1 with publicKey0: ", encrypted1)
    // enable callchannel

    let enableCallChannel = await engine.sendTransaction(network, {from: account0}, "Call", "setCallChannel", [account1, ["0x" + encrypted0.toString("hex"), "0x" + encrypted1.toString('hex')]])
    if(enableCallChannel.success){
        console.log(green(), "Enabled Call Channel from address0 to address1 with uuid: ", uuid0)
    }
    // decode from address 1 and address 0 // goes to get Call Channel

    let callChannel = await engine.sendTransaction(network, {from: account1}, "Call", "CallChannel", [account0, account1], true) 

    console.log(callChannel.transaction)
    const sender = callChannel.transaction.encryptedSender;

    console.log(green(), "Sender: ", sender)

    const utils = engine.defaultInstance?.web3.utils
    
    /*
    const encryptedSender = {
        iv: Buffer.from(new Uint8Array(utils?.hexToBytes(sender.iv)as number[])),
        ephemPublicKey: Buffer.from(new Uint8Array(utils?.hexToBytes(sender.ephemPublicKey)as number[])),
        ciphertext: Buffer.from(new Uint8Array(utils?.hexToBytes(sender.ciphertext)as number[])),
        mac: Buffer.from(new Uint8Array(utils?.hexToBytes(sender.mac)as number[])),
    } as EncryptedMessage*/

    console.log("encryptedSender: ",sender)
    
    let decrypted1 = await engine.decrypt(1, new Uint8Array(Buffer.from(sender.slice(2), "hex")))

    console.log(green(), "Decrypted from 1 from address 0, uuid", decrypted1.toString("utf-8"))
    
}

async function setCallChannel1() {

    // get enable hash

    // get public key0 rsv

    // get public key0 hex

    // encrypt uuid with public key0

    // get public key1 rsc

    // get public key1 hex

    // encrypt uuid with public key1

    // enable callchannel

    //let call0 = 
    
}

async function getCallChannel(){

}

main()