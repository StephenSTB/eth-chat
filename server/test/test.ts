import { Web3Engine , EngineArgs} from "@sb-labs/web3-engine/Web3Engine.js";
import { Providers, providers } from "@sb-labs/web3-data/networks/Providers.js"
import { deployed } from "@sb-labs/web3-data/networks/DeployedContracts.js"
import { contractFactoryV2 } from "@sb-labs/contract-factory-v2/ContractFactoryV2.js";
import fs  from "fs";

import FormData from "form-data"

import axios from "axios"

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

// create avatar transaction 
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

const main = async () => {

    

    await createName()

    await editInfo()
    // post file to axios
    
    process.exit(0)
}

const createName = async () =>{
    // send create name transaction
    const _name = "Steve"
    const _bio = "a bio"
    const _link = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"
    const _avatar = "bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24"

    console.log(engine.defaultInstance?.contracts["Name"].options.address)

    let createTranasaction = await engine?.sendTransaction(network, {from: account}, "Name", "createName", [_name, _bio, _link, _avatar])

    let info = await engine?.sendTransaction(network, {from: account}, "Name", "Info", [account], true)
    info.transaction.network = network;
    console.log(info.transaction)

    const formdata = new FormData();
    formdata.append('file', fs.createReadStream("./test/avatars/bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24.png"))
    formdata.append('data', JSON.stringify(info.transaction))

    await axios.post("http://localhost:3001/api/avatar/", formdata, {
        headers:{
            "Content-Type": 'multipart/form-data'
        } 
    })
}

const editInfo = async () =>{
    const _bio = "a bio"
    const _link = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"
    const _avatar = "bafkreif6rxoyugnbla46w2gun3ociyxz4gmvfpc6sl6z53ennyfu2wjdgm"

    let editTransaction = await engine?.sendTransaction(network, {from: account}, "Name", "editInfo", [_bio, _link, _avatar])

    let info = await engine?.sendTransaction(network, {from: account}, "Name", "Info", [account], true)
    info.transaction.network = network;
    console.log(info.transaction)

    const formdata = new FormData();
    formdata.append('file', fs.createReadStream("./test/avatars/bafkreif6rxoyugnbla46w2gun3ociyxz4gmvfpc6sl6z53ennyfu2wjdgm.png"))
    formdata.append('data', JSON.stringify(info.transaction))

    await axios.post("http://localhost:3001/api/avatar/", formdata, {
        headers:{
            "Content-Type": 'multipart/form-data'
        } 
    })
}

main()
// axios post

