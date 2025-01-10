import { providers } from "@sb-labs/web3-data/networks/Providers.js"

import {Providers} from "@sb-labs/web3-data/networks/Providers.js"

import {deployed} from "@sb-labs/web3-data/networks/DeployedContracts.js"

import { Web3Engine } from "@sb-labs/web3-engine/Web3Engine.js";

import { EngineArgs } from "@sb-labs/web3-engine/Web3Engine.js";

import { contractFactoryV2 } from "@sb-labs/contract-factory-v2/ContractFactoryV2.js"

import { green, yellow, red, gray } from "@sb-labs/web3-data/functions/ConsoleColors.js";

const __dirname = new URL('.', import.meta.url).pathname;



import * as dagPB from "@ipld/dag-pb"

import * as json from "multiformats/codecs/json"

import { CID, Version } from 'multiformats/cid'

import { prepare } from "@ipld/dag-pb";

import * as raw from "multiformats/codecs/raw"

import { sha256 } from 'multiformats/hashes/sha2';

import * as Block from 'multiformats/block';

import * as all from "it-all";

import fs from "fs"

import {base32} from "multiformats/bases/base32"
import {base64} from "multiformats/bases/base64"

import {createHelia} from "helia"

import {unixfs} from "@helia/unixfs"
/*
import { createLibp2p } from "libp2p"
import { createHeliaHTTP, } from '@helia/http'
import { unixfs } from '@helia/unixfs'
import { trustlessGateway } from '@helia/block-brokers'
import { delegatedHTTPRouting, httpGatewayRouting } from '@helia/routers'*/

import { MemoryDatastore } from 'datastore-core'
import { MemoryBlockstore } from 'blockstore-core'
import { FsBlockstore }  from "blockstore-fs"
import { createFromProtobuf } from '@libp2p/peer-id-factory'
import { noise } from '@chainsafe/libp2p-noise'
import { webSockets } from '@libp2p/websockets'
import { tcp } from '@libp2p/tcp'
import { kadDHT } from '@libp2p/kad-dht'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'

import { execSync } from 'child_process';


let engine : Web3Engine;

let wallet: any

let mnemonic : string;

let account: string;

const network: string = "Ganache"

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

    account = wallet[0].address as string;

    await deployName();
    
    //await createName();

    //await getName();

    //await editInfo()

    //await runHelia()
   // process.exit(0)
}

const deployName = async () =>{
    console.log(yellow(), "Deploying Name...")
        const nameDeployed = await engine.deploy(network, "Name", [], {from: account})
    
        //console.log(callDeployed)
    
        if(nameDeployed.success){
            console.log(green(), "Name Deployed")
        }
        
}

    const createName = async () => {
        console.log(gray(), "creating name")
        const data = new Uint8Array(fs.readFileSync("./test/bafkreibt25qdqiw3y5w5ks6pj75z6wj3hq7dhgpm6hfe4effxmto2ap2lq.png"))

        const image_block = await Block.encode({value: data, codec: raw, hasher: sha256});

        console.log(image_block.cid.toString())

        await engine.sendTransaction(network, {from: account}, "Name", "createName", ["Steve", "This is my life. Bio.", image_block.cid.toString(), image_block.cid.toString()])
        
    }
    const getName = async () =>{
        const info_tx = await engine.sendTransaction(network, {from:account}, "Name", "Info", [account], true) // Info 
        const info = info_tx.transaction;
        console.log(green(),info)

        const name_tx = await engine.sendTransaction(network, {from:account}, "Name", "Names", [account], true) //Names,
        console.log(green(), name_tx.transaction)
        const address_tx = await engine.sendTransaction(network, {from:account}, "Name", "NamesResolver", ["Steve"], true) // NamesResolver
        console.log(green(), address_tx.transaction)
    }

    const editInfo = async () =>{
        const data = new Uint8Array(fs.readFileSync("./test/bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24.png"))

        const image_block = await Block.encode({value: data, codec: raw, hasher: sha256});

        await engine.sendTransaction(network, {from: account}, "Name", "editInfo", ["New bio", image_block.cid.toString(), image_block.cid.toString()])

        await getName();
    }

    const runHelia = async () =>{ 
        const datastore = new MemoryDatastore();
        const blockstore = new MemoryBlockstore();
        const blockstr = new FsBlockstore("./test") 
        //const peerId = await createFromProtobuf(new Uint8Array(fs.readFileSync("PeerId")))
        console.log("here")

        const helia0 = await createHelia({blockstore: blockstr});
        /*
        helia0.libp2p.getConnections()
        /*const helia = await createHeliaHTTP({
            blockBrokers: [
              trustlessGateway()
            ],
            routers: [
              delegatedHTTPRouting('https://delegated-ipfs.dev'),
              httpGatewayRouting({
                gateways: ['https://cloudflare-ipfs.com', 'https://ipfs.io']
              })
            ]
          })*/
          ///const hfs = unixfs(helia0);
          const data = new Uint8Array(fs.readFileSync("./test/bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24.png"))
            /*const bytes = dagPB.encode({
                Data: data,
                Links:[],
            })
            */

            const block = await Block.encode({value: data, codec: raw, hasher: sha256})
            console.log(block.cid)

            //const image_block = await Block.encode({value: {Data: data, Links: []}, codec: dagPB, hasher: sha256});
            
            //console.log(image_block.cid.toString(base64))
            //const value = {data: data}
            helia0.blockstore.put(block.cid, data)
            //const file0 = await helia0.blockstore.get(block.cid);
            console.log()

            const blk = await Block.encode({value: data, codec: raw, hasher: sha256});

            console.log(blk.cid.toString(base32.encoder))
            /*
            const hfs = unixfs(helia0)
            const dir = fs.readdir("../", () =>{

            })
            hfs.addDirectory()*/

            
          //const id = await hfs.addBytes(data)
          //const id = await hfs.addFile({path:"", content: data})
          //const cid = id.toV1().toString();

          setInterval(() =>{
            console.log(helia0.libp2p.getConnections().length)
          }, 5000)
    }

main();