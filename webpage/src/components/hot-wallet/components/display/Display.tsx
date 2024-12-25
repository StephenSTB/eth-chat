import {useState, ChangeEvent, useEffect} from "react"

import { Button, Divider, Dropdown, Icon, Input, Popup } from "@sb-labs/basic-components/dist"

import { EngineArgs, Web3Engine } from "@sb-labs/web3-engine"

import { contractFactoryV2 } from "@sb-labs/contract-factory-v2"

import { deployed, providers, Providers } from "@sb-labs/web3-data"

import {ethereum_black, copy, flame} from "@sb-labs/images"

import * as CryptoJS from 'crypto-js'

import {ecrecover, toBuffer} from "ethereumjs-util"

import { Buffer } from 'buffer';

import { v4 as uuidV4 } from "uuid"

import axios from "axios" 

globalThis.Buffer = Buffer;

//console.log('Buffer polyfill:', Buffer);

import "./Display.css"


interface DisplayProps{
    engine: Web3Engine,
    setComp: any
    getEngine: any
    getNetwork: any
}

export const Display = (props: DisplayProps) => {

    const [engine, setEngine] = useState<Web3Engine>();
    const [network, setNetwork] = useState<string>();
    const [account , setAccount] = useState<string>()
    const [displayAccount, setDisplayAccount] = useState<string>();
    /*const [client, setClient] = useState(createPublicClient({ chain: sepolia , transport: http() }) as PublicClient);*/
    const [client, setClient] = useState()
    const [name, setName] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("");
    const [ether, setEther] = useState<string>();
    const [display, setDisplay] = useState("Connect")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("");
    const options = [<option value="Sepolia" key="Sepolia">Sepolia</option>,<option value="Base" key="Base">Base</option>]
    // account 
    const [copyState, setCopyState] = useState<boolean>(false)
    // send ether
    const [toAddress, setToAddress] = useState<string>("")
    const [sendEthereum, setSendEthereum] = useState<number>(0);
    const [etherTransacting, setEtherTransacting] = useState<boolean>(false);
    // registry variables
    const [callSignKey, setCallSignKey] = useState<boolean>(false);
    const [callRegisterGas, setCallRegisterGas] = useState("");
    const [callChannelGas, setCallChannelGas] = useState("");
    // transacting variables
    const [transactCallSignKey, setTransactCallSignKey] = useState<boolean>(false);

    useEffect(() =>{

        const getEther = async () =>{
            const ether = props.engine.defaultInstance?.web3.utils.fromWei(await props.engine.defaultInstance?.web3.eth.getBalance(props.engine.defaultAccount as string), "ether")
            setEther(ether)
        }

        const engine = props.engine;
        const network = engine.defaultNetwork as string;
        let account;

        if(engine.mnemonic !== undefined){
            setAccount(props.engine.defaultAccount)
            //console.log("display account")
            setDisplayAccount((props.engine.defaultAccount as string).slice(0, 6) + "..." + (props.engine.defaultAccount as string).slice(-4))
            setEngine(engine);
            setNetwork(engine.defaultNetwork as string)
            getEther()
            setDisplay("Account")
        }

        const getRegistries = async() =>{
            console.log("here")
                if(engine.defaultInstance?.web3 !== undefined){
                    account = engine.web3Instances[network].wallet[0].address
                    const signkey = await engine.sendTransaction(engine.defaultNetwork as string, {from: account}, "Call", "SignKeys", [account], true)
                    //console.log(signkey.transaction.v)
                    if(signkey.transaction.v == 0){
                        const sig = await engine.defaultInstance.wallet[0].sign("Enable Public Key.")
                        const registerGas = await engine.getGas(engine.defaultNetwork as string, {from: account}, "Call", "register", [sig.signature])
                        console.log("Gas:", registerGas)
                        setCallSignKey(true);
                        setCallRegisterGas(engine.defaultInstance.web3.utils.fromWei(registerGas.gas.toString(), "ether"))
                        return;
                    }
                    else{
                        setCallSignKey(false)
                        /* get create channel gas */
                        // get enable hash
                        const enableHash = await engine.sendTransaction(network, {from: account}, "Call", "EnableHash", [], true)
                        //console.log(enableHash)
                        const publicKey = (await engine.sendTransaction(network, {from: account}, "Call", "SignKeys", [account], true)).transaction
                        //console.log(publicKey)

                        let keybuf = new Uint8Array(Buffer.from(("04" + ecrecover(toBuffer(enableHash.transaction), Number(publicKey.v), toBuffer(publicKey.r), toBuffer(publicKey.s)).toString("hex")), "hex"))
                        //console.log(keybuf)
                        const uuid = uuidV4()
                        let encrypted = await engine.encrypt(keybuf, uuid)//await engine.sendTransaction(network, {from: account},"Call", "CallChannel", [account] )
                        //console.log(encrypted)

                        let gas = await engine.getGas(network, {from: account}, "Call", "setCallChannel",[account, ["0x" + encrypted.toString("hex"), "0x" + encrypted.toString("hex")]] )
                        const utils = engine.defaultInstance.web3.utils
                        setCallChannelGas(utils.fromWei(gas.gas.toString(), "ether"))
                       
                    }
                    // Name verifier.
                    const name_tx = (await engine.sendTransaction(network, {from: account}, "Name", "Names", [account], true))
                    const _name = name_tx.transaction;
                    console.log(_name)
                    if(_name !== ""){
                        const address = await engine.sendTransaction(network, {from: account}, "Name", "NamesResolver", ["Steve"], true)
                    
                        const info_tx = await engine.sendTransaction(network, {from: account}, "Name", "Info", [account], true)
                        const info = info_tx.transaction;
                        setName(_name)
                        console.log(info.avatar)
                        
                        try{
                            console.log(avatar)
                            if(avatar == ""){
                                const _avatar = await axios.get(("https://ipfs.io./ipfs/" + info.avatar), {responseType: "blob"})
                                console.log(_avatar.data)
                                if(_avatar.data.type.includes("image")){
                                    const blobUrl = window.URL.createObjectURL(_avatar.data);
                                    console.log(_avatar.data)
                                    setAvatar(blobUrl)
                                }
                                
                            }
                            
                        
                        }catch{
                            console.log("Bad axios call")
                        }
                        
                        
                        
                        /*const resp = _avatar.clone()

                        const blobUrl = window.URL.createObjectURL(await resp.blob());
                        console.log(blobUrl)
                        //console.log(avatar)
                        setAvatar(blobUrl)*/
                        
                    }
                    
                    
                }
        }
        // get registries
        getRegistries()

    },[props.engine])

    const confirmPassword = async () =>{
        
        const encryptedWallet = JSON.parse(localStorage.getItem("hot-wallet") as string);
        console.log(encryptedWallet)

        let vhmac = CryptoJS.HmacSHA256(encryptedWallet.encryptedUser, CryptoJS.SHA256("password1234")).toString(); // undo

        //console.log(vhmac)

        if(encryptedWallet.hmac != vhmac){
            setError("Incorrect Password. Try password again or import mnemonic.");
            return;
        }
        setError("")

        let mnemonic = CryptoJS.AES.decrypt(encryptedWallet.encryptedUser, "password1234").toString(CryptoJS.enc.Utf8); //undo password is var

        //console.log(mnemonic)

        let prvdrs = {} as Providers;

        const network = "Sepolia"

        prvdrs[network] = providers[network]

        const engineArgs = 
        {
            browser: true,
            mnemonic, 
            defaultAccount: 0,
            networks: [network], 
            defaultNetwork: network, 
            providers: prvdrs, 
            deployed, 
            contractFactory: contractFactoryV2, 
            contractFactoryVersion: 2
        } as EngineArgs
        
        const engine = await Web3Engine.initialize(engineArgs)

        setAccount(engine.defaultAccount)

        //setDisplayAccount((props.engine.defaultAccount as string).slice(0, 6) + "..." + (props.engine.defaultAccount as string).slice(-4))

        const ether = engine.defaultInstance?.web3.utils.fromWei(await engine.defaultInstance?.web3.eth.getBalance(engine.defaultAccount as string), "ether") 

        setEther(ether as string)

        //setEngine(engine)

        props.getEngine(engine)

        props.getNetwork(network)

        setDisplay("Account")
        
    }
    
    /* Import */
    const importMnemonic = () =>{
        props.setComp("Import")
    }
            
    const changePassword = (e: ChangeEvent<HTMLInputElement>) =>{
            setPassword(e.target.value)
    }

    const passwordEnter = (e: any) =>{
        if(e.keyCode === 13){
            confirmPassword();
        }
    }

    /* address*/
    const copyAddress = (e: Event) =>{
        navigator.clipboard.writeText(account as string)
        setCopyState(true)
    }

    /*Send ether*/

    const sendEther = async () =>{
        setEtherTransacting(true)
        if(Number(ether) > sendEthereum){
            let eth = engine?.defaultInstance?.web3.utils.toWei(sendEthereum.toString())
            await engine?.sendTransaction(network as string, {from: account, to:toAddress, value: eth})
        }else{
            setError("must not send all ether")
        }
        setEtherTransacting(false)
    }
    // to user section
    const changeTo = (e: ChangeEvent<HTMLInputElement>) =>{
        const utils = engine?.defaultInstance?.web3.utils
        setCopyState(false)
        if(utils?.isAddress(e.target.value)){
            setToAddress(e.target.value)
            setError("")
            return
        }
        setError("Not an Ethereum address in to address")
    }
    //send section
    const keySendEther = (e: any) =>{
        if(e.keyCode == 13){
            sendEther()
        }
    }
    
    const changeSendEther = (e: ChangeEvent<HTMLInputElement>) =>{
        setCopyState(false)
        const ether = Number(e.target.value)
        if(!isNaN(ether)){
            setError("")
            setSendEthereum(Number(e.target.value))
            return
        }
        
        setError("Incorrect value entered into send ether field.")
    }   

    /* display network */
    const networkChange = (e: ChangeEvent<HTMLSelectElement>) =>{
        const network = e.target.value;
        const defaultInstance = props.engine.web3Instances[network]
        const engine = props.engine;

        engine.defaultInstance = defaultInstance
        props.getEngine(engine);
        
    }

    
    /*Registry */
    const registerCallSignKey = async (e: Event) =>{
        setTransactCallSignKey(true)
        const sig = await engine?.defaultInstance?.wallet[0].sign("Enable Public Key.")
        const register = await engine?.sendTransaction(network as string, {from: account},"Call", "register", [sig?.signature] )
        console.log(register);
        if(register.success){
            setTransactCallSignKey(false);
            setCallSignKey(false)
        }    
    }

    /* create Call channel */
    const changeChannel =  async (e: ChangeEvent<HTMLInputElement>) =>{
        const utils = engine?.defaultInstance?.web3.utils;
        if(!utils?.isAddress(e.target.value)){
            setError("Call channel input must be valid address.")
            return;
        }
        await engine?.sendTransaction(network as string, {from: account}, "Call", "SignKeys", [e.target.value], true )
    }

    return(
        <>
            <div id="display">
                {
                    display === "Connect" &&
                    <>
                        <Icon size="large" src={flame}/>
                        <h3>Connect to Wallet</h3>
                        
                        <Input size="small" placeholder="password..." onChange={changePassword} onKeyDown={passwordEnter} inputType="password"/>
                        <div id="connect-import">
                            <Button text="Import" size="small" id="import-button" onClick={importMnemonic}/>
                            <Button text="Connect" size="small" id="connect-button" onClick={confirmPassword}/>
                        </div>
                    </>
                }
                {
                    display === "Account" &&
                    <>
                        <h3>Account</h3>
                        {
                            name !== "" && <div id="display-name">{name} <Icon src={avatar} size="medium"/></div>
                        }
                        <div id="display-account">
                            {/*<div>{name}<Icon size="mini" src={avatar} /></div>*/}
                            <div id="display-account-string">{displayAccount}</div>
                            <div id="display-account-copy">
                                <Popup text='Copied!' offset={{bottom: "45px", right:"-25px"}} display={copyState} 
                                element={<Button size='icon' icon={<Icon size="mini" src={copy} round={true}/>} onClick={copyAddress} id="display-copy"/>}/>
                            </div>
                        </div>
                        <div id="display-ether">
                            Ether: {ether} <Icon size="mini" src={ethereum_black} round={true}></Icon>
                        </div>
                        {/** Create send ether  TODO*/}
                        <Divider />
                        <h3>Send Ether</h3>
                        <div>
                            <Input size="small" placeholder="address..." onKeyDown={keySendEther} onChange={changeTo}/>
                        </div>
                        
                        <div id="display-send-ether">
                                <Input  placeholder="ether..." onKeyDown={keySendEther} onChange={changeSendEther}/>
                                <Button text="send" size="large" id="display-send-ether-button" onClick={sendEther} transacting={etherTransacting}/>
                        </div>
                        {/* auto transact toggle*/}
                        <Divider />
                        {/* network change */}
                        <h3>Network</h3>
                        <div id="display-network">
                            
                            <Dropdown options={options} size="medium" theme="light" onChange={networkChange}></Dropdown>
                        </div>
                        
                        {/* register for calling messages following*/}
                        
                            { 
                                callSignKey && 
                                <>
                                    <Divider />
                                    <div id="call-sign">
                                    <div>Register Call Sign Key Button to Interact with App.</div>
                                    <div>Gas : {callRegisterGas}</div>
                                    <Button text="Register Call Sign Key." size="large" onClick={registerCallSignKey} id="call-sign-key-button" transacting={transactCallSignKey}/>
                                </div>
                                </>
                                
                            }
                        {/* Create Call channel */}
                            {/*
                                !callSignKey &&
                                <div id="create-call-channel">
                                    <h3>Create Call Channel</h3>
                                    <div>Gas : {callChannelGas}</div>
                                    <div id="create-call-channel-input"><Input placeholder="address..." onChange={changeChannel}/><Button text="Channel" size="large"/></div>
                                </div>*/
                            }
                        
                        

                    </>
                }
                
                
                {error}
            </div>
        </>
    )
}