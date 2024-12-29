import express from "express"
import {ExpressPeerServer} from "peer"
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer"
import { rateLimit } from "express-rate-limit"
import { Providers , providers} from "@sb-labs/web3-data/networks/Providers.js";
import { Web3Engine, EngineArgs } from "@sb-labs/web3-engine/Web3Engine.js";
import { deployed } from "@sb-labs/web3-data/networks/DeployedContracts.js";
import { contractFactoryV2 } from "@sb-labs/contract-factory-v2/ContractFactoryV2.js";
import { Wallet } from "web3-eth-accounts"
import fs from "fs"
import { MongoClient } from 'mongodb'
import * as raw from "multiformats/codecs/raw"
import { sha256 } from 'multiformats/hashes/sha2';
import * as Block from 'multiformats/block';
import { CID } from "multiformats";
import { createHelia } from "helia";
import { FsBlockstore }  from "blockstore-fs"
import { Console } from "console";


let blockstore = new FsBlockstore("./avatars")

let helia = await createHelia({blockstore});

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);

const dbName = "eth-chat"

const drop = true;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 40, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

await client.connect()

const db = client.db(dbName);

if(drop){
    try{
        console.log("database droped.")
        db.collection('eth-chat').drop()
        console.log("database created.")
        db.createCollection('eth-chat')
    }
    catch{
        console.log("couldn't re-create database")
        
    }
}
else{
    try{    
        console.log("database created.")
        db.createCollection('eth-chat')
    }catch{
        console.log("couldn't create database")
    }
}

// getting menmonic
let mnemonic: string;
try{
    mnemonic = (fs.readFileSync("../secret/.secret-mn-ganache")).toString()
}catch{
    mnemonic = (fs.readFileSync("../../secret/.secret-mn-ganache")).toString()
}

// password
let password: string;
try{
    password = (fs.readFileSync("../secret/.secret-pw")).toString()
}catch{
    password = (fs.readFileSync("/home/stephensb/sb-labs/secret/.secret-pw")).toString()
}

// Web3 engine Initialization.

let prvdrs = {} as Providers;
prvdrs["Ganache"] = providers["Ganache"];
prvdrs["Sepolia"] = providers["Sepolia"];
prvdrs["Base"] = providers["Base"]

const engineArgs = 
{
    browser: false,
    mnemonic, 
    defaultAccount: 0,
    networks: ["Ganache","Sepolia", "Base"], 
    defaultNetwork: "Ganache", 
    providers: prvdrs, 
    deployed, 
    contractFactory: contractFactoryV2, 
    contractFactoryVersion: 2
} as EngineArgs

const engine = await Web3Engine.initialize(engineArgs);

const namesAddress = engine.defaultInstance?.contracts["Name"].options.address

console.log("Name address", namesAddress)

let wallet = engine.defaultInstance?.wallet as Wallet;

let account = wallet[0].address as string


// Express app creatiion
const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 
// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(limiter)


const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/", (req, res, next) => res.send("Hello world!"));

// Set up multer to store files in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });

app.post("/api/avatar", upload.single('file'), async (req, res) =>{
    if(req.body.data == undefined || req.file == undefined || req.file.mimetype !== "image/png"){
        console.log("invalid format")
        return
    }
    console.log(req.file)
    console.log(req.body)
    const data = JSON.parse(req.body.data)
    console.log(data)
    // get name avatar from engine
    try{
        
        const address = (await engine.sendTransaction(data.network, {from: account}, "Name", "NamesResolver", [data.name], true)).transaction // testing
        console.log(address)
        const info = (await engine.sendTransaction(data.network, {from: account}, "Name", "Info",[address], true )).transaction
        console.log(info)
        // check database for conformity.
        let user = await db.collection("eth-chat").findOne({name: data.name})

        if(user !== null && user.remove){
            res.send("User Removed")
        }
        //console.log(user)

        const file = new Uint8Array(req.file?.buffer as Buffer)
        console.log("File", file)
        const block = await Block.encode({value: file, codec: raw, hasher: sha256})
        console.log(block.cid.toString()) 
        if(block.cid.toString() !== info.avatar){
            console.log("File doesn't match on chain avatar.")
            res.send("Invalid avatar from file given vs on chain.")
            return;
        }

        fs.writeFileSync("./avatars/" + info.avatar + ".png", req.file?.buffer as Buffer)
        await helia.blockstore.put(block.cid , block.bytes)
        await helia.pins.add(block.cid)

        console.log("Added avatar for: ", info.name)
        
        if(user == null){
            console.log("New user.")
            await db.collection("eth-chat").insertOne({name: data.name, avatar: info.avatar, remove: false })
            res.send("Avatar succesfully archived")
            return;
        }
        else{
            console.log("Change user.")
            console.log(user.avatar)
            let avatars = await db.collection("eth-chat").countDocuments({avatar: user.avatar}) // countDocuments
            console.log(avatars)
            if(avatars == 1){
                fs.unlink("./avatars/" + user.avatar + ".png", () =>{
                    console.log("Removed: ", user.avatar)
                })
                const cid = CID.parse(user.avatar)
                await helia.blockstore.delete(cid);
            }
            await db.collection("eth-chat").updateOne( {name: data.name}, {$set: {avatar: info.avatar }})
            //await db.collection("nft").updateOne({contract: dbNFT.contract}, {$set: {subCIDs: result.subCIDs, state: "verified"}})
        }
    }catch{
        console.log("Error adding avatar");
    }   
    
    res.send("Avatar post success.")
})

app.post("/owner/remove", async (req, res) =>{
    console.log("remove")
    console.log(req.body)
    
    if(req.body.password == password){
        // remove mongodb remove ipfs
        console.log("removed")
        const removeList = req.body.removeList
        for(let i = 0; i < removeList.length; i++){
            //await db.collection("eth-chat").insertOne({name: "Steve", avatar: "bafkreif6rxoyugnbla46w2gun3ociyxz4gmvfpc6sl6z53ennyfu2wjdgm", remove: false})
            await db.collection("eth-chat").updateOne( {name: removeList[i]}, {$set: {remove: true }})
            const user = await db.collection("eth-chat").findOne({name: removeList[i]})
            console.log(user)
            if(user !== null){
                const cid = CID.parse(user.avatar)
                await helia.blockstore.delete(cid)
                await fs.unlink("./avatars/" + user.avatar + ".png", () =>{
                    console.log("removed avatar")
                })
            }
        }
        res.send("Removed")
    }
    
})


const peerServer = ExpressPeerServer(server, {
	path: "/eth-chat",
});

peerServer.on('connection', (client) => {console.log(`Client Connected: ${client.getId()}`)});
peerServer.on('disconnect', (client) => {console.log(`Client Disconnected: ${client.getId()}`)});

app.use("/", peerServer);

setInterval(() =>{
    console.log("Helia Connections: ", helia.libp2p.getConnections().length)
  }, 15000)
