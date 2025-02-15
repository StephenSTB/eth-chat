import { Web3Engine } from "@sb-labs/web3-engine"
import "./Call.css"
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@sb-labs/basic-components/dist";
import { isAddress } from "web3-validator";
import { v4 as uuidV4} from "uuid"
import { ecrecover, toBuffer } from "ethereumjs-util";
import { Peer } from "peerjs"
import { VideoPlayer } from "../videoplayer/VideoPlayer";

interface CallProps{
    engine: Web3Engine;
    network: string;
    host: any;
}

export const Call = (props: CallProps) =>{
     
    const navigate = useNavigate();

    const [callAddress, setCallAddress] = useState<string>("");
    const [error, setError] = useState<string>("")
    //const [callButtonText, setCallButtonText] = useState<string>("Call")
    const [promptText, setPromptText] = useState<string>("")
    const [transacting, setTransacting] = useState<boolean>(false)
    const [transactionGas,setTranasactionGas] = useState<string>("")

    const [engine, setEngine] = useState<Web3Engine>();
    const [network, setNetwork] = useState<string>("")
    const [account, setAccount] = useState<string>("")

    const [callState, setCallState] = useState<number>(0)

    const [me, setMe] = useState<Peer>()
    const [peeruuid, setpeeruuid] = useState<string>("");
    const [showPlayer, setShowPlayer] = useState<boolean>(false)


    const [mobile, setMobile] = useState<boolean>(false)

    
    useEffect(() =>{
        if(props.engine.mnemonic === undefined){
            navigate("/")
            return
        }

        if(window.innerWidth < 900){
            setMobile(true)
        }

        const getConnected = async () =>{
            const engine = props.engine;
            const network = props.network
            console.log(network)
            setEngine(engine)
            setNetwork(network)
            setAccount(engine?.defaultAccount as string)
            //let uuid = await engine.sendTransaction(network, {from: engine.defaultAccount}, "UUIDConnect", "uuidmap", [engine.defaultAccount], true);
            //console.log("uuid:", uuid)
        }
        getConnected()
        

        //engine.sendTransaction("")
    }, [])
    const changeCallAddress = async (e: ChangeEvent<HTMLInputElement>) =>{
        const address = await engine?.sendTransaction(network, {from: account}, "Name", "NamesResolver", [e.target.value] ,true)
        console.log("change call address:", address.transaction)
        if(address.transaction !== "0x0000000000000000000000000000000000000000000000000000000000000000" && !isAddress(e.target.value)){
            setCallAddress(address.transaction)
            return;
        }
        if(!isAddress(e.target.value)){
            setError("Invalid ethereum address format given.")
            return;
        }   

        setCallAddress(e.target.value)
    }

    const call = async () =>{
        // get correct address
        console.log(callAddress)
        if(!isAddress(callAddress)){
            setError("Invalid ethereum address format given.")
            
        }

        setError("")
        let state = callState

        // get signKey,
        if(state == 0){
            console.log("Call State 0")
            try{
                const signKey = await engine?.sendTransaction(network, {from: account}, "Call", "SignKeys", [account], true);
                if(signKey.transaction.v == 0){
                    console.log("No sign Key")
                    setPromptText(" Press call to create sign key.")
                    const sig = await engine?.defaultInstance?.wallet[0].sign("Enable Public Key.")
                    const gasT = await engine?.getGas(network as string, {from: account},"Call", "register", [sig?.signature] )
                    const utils = engine?.defaultInstance?.web3.utils;
                    const gas = utils?.fromWei(gasT.gas.toString(), "ether") as string
                    setTranasactionGas("Gas to register: "+ gas)
                    setCallState(1)
                    return
                }
                setCallState(2)
                state = 2
            }catch{
                console.log("Error getting sign key. 0")
                setError("Error getting sign key. 0")
            }
            
        }
        // create signkey if needed.
        if(state == 1){
            console.log("Call State 1")
            try{
                setTransacting(true)
                const sig = await engine?.defaultInstance?.wallet[0].sign("Enable Public Key.")
                
                const register = await engine?.sendTransaction(network as string, {from: account},"Call", "register", [sig?.signature] )
                console.log(register)
                //setTransacting(false)
                setCallState(2)
                state = 2
                setTransacting(false)
            }catch{
                console.log("Error creating signKey. 1")
                setError("Error creating signKey. 1")
                setTransacting(false)
            }
            
        }
        // get sender call channel to see if call can be made
            
        if(state == 2){
            console.log("Call State 2")
            try{
                const callchannel = await engine?.sendTransaction(network as string, {from: account},"Call", "CallChannel", [account, callAddress], true )
                console.log(callchannel.transaction)
                if(callchannel.transaction.encryptedSender == null){
                    console.log("Need to Create call channel")
                    setPromptText("Need to Create call channel press call to do so.")
                    console.log("0x" + Buffer.alloc(108).fill("dddd").toString())
                    const gasT = await engine?.getGas(network, {from: account}, "Call", "setCallChannel",  [callAddress, ["0x" +  Buffer.alloc(108).fill("dddd").toString(), "0x" +  Buffer.alloc(108).fill("dddd").toString()]])
                    console.log(gasT)
                    const utils = engine?.defaultInstance?.web3.utils;
                    const gas = utils?.fromWei(gasT.gas.toString(), "ether") as string
                    setTranasactionGas("Gas to set call channel: "+ gas)
                    setCallState(3);
                }
                else{
                    state = 4;
                }
            }catch{
                console.log("Error checking for call channel. 2")
                setError("Error checking for call channel. 2")
            }
            
        }
        // create channel if needed
        if(state == 3){
            console.log("Call State 3")
            try{
                const uuid = uuidV4()
                setTransacting(true)
                let enablehash = await engine?.sendTransaction(network, {from: account}, "Call", "EnableHash", [], true);
                enablehash = enablehash.transaction
                console.log(enablehash)
                console.log(callAddress)
                let signKey0 = await engine?.sendTransaction(network, {from: account}, "Call", "SignKeys", [callAddress], true);
                signKey0 = signKey0.transaction
                console.log(signKey0)
                if(signKey0.v == 0){
                    setPromptText("Other user doesn't have a signKey. Can't make channel")
                    return
                }
                let keybuf0 = new Uint8Array(Buffer.from("04" + ecrecover(toBuffer(enablehash), Number(signKey0.v), toBuffer(signKey0.r), toBuffer(signKey0.s)).toString("hex"), "hex"))
                const encrypted0 = await engine?.encrypt(keybuf0, uuid)

                let signKey1 = await engine?.sendTransaction(network, {from: account}, "Call", "SignKeys", [account], true);
                signKey1 = signKey1.transaction
                console.log(signKey1, enablehash, uuid)

                let keybuf1 = new Uint8Array(Buffer.from("04" + ecrecover(toBuffer(enablehash), Number(signKey1.v), toBuffer(signKey1.r), toBuffer(signKey1.s)).toString("hex"), "hex"))
                const encrypted1 = await engine?.encrypt(keybuf1, uuid)

                console.log(encrypted0)
                console.log(encrypted1)

                let enableCallChannel = await engine?.sendTransaction(network, {from: account}, "Call", "setCallChannel", [callAddress, ["0x" + encrypted0?.toString("hex"), "0x" + encrypted1?.toString('hex')]])
                
                console.log(enableCallChannel)
                
                if(enableCallChannel.success){
                    console.log("Created call channel from: ", account, " to ", callAddress)
                    const callchannel = await engine?.sendTransaction(network as string, {from: account},"Call", "CallChannel", [account, callAddress], true )
                    console.log(callchannel.transaction)
                    setPromptText(`Created call channel from you to ${callAddress}.`)
                    setTransacting(false)
                    state = 4
                }else{
                    throw new Error();
                }

            }catch{
                console.log("Error creating call channel 3")
                setError(`Error creating call channel for ${callAddress} 3`)
                setTransacting(false)
            }
        }
        
        
        // get  call address callchannel
        if(state == 4){
            console.log("Call State 4")
            try{
                const callchannel = await engine?.sendTransaction(network as string, {from: account},"Call", "CallChannel", [callAddress, account], true )
                console.log(callchannel.transaction)
                if(callchannel.transaction.encryptedSender == null){
                    console.log("Calle needs to Create call channel")
                    setPromptText("Calle needs to Create call channel.")
                    setTranasactionGas("")
                    setCallState(3);
                }
                else{
                    state = 5;
                }
            }
            catch{
                console.log("Error getting other user call channel 4")
                setError("Error getting other user call channel 4")
            }
        }
        // can make a call.
        if(state == 5){
            console.log("Call State 5")
            // get peer uuid from callAddress call channel sender
            let peeruuid: string = "";
            let uuid: string = ""; 
            try{
                let callchannel = await engine?.sendTransaction(network as string, {from: account},"Call", "CallChannel", [callAddress, account], true )
                callchannel = callchannel.transaction

                let msg = new Uint8Array(toBuffer(callchannel.encryptedSender))
                peeruuid = (await engine?.decrypt(0, msg))?.toString('utf-8') as string
                callchannel = await engine?.sendTransaction(network as string, {from: account},"Call", "CallChannel", [account, callAddress], true )
                callchannel = callchannel.transaction
                msg = new Uint8Array(toBuffer(callchannel.encryptedUser))
                
                uuid = (await engine?.decrypt(0, msg))?.toString("utf-8") as string
                console.log(uuid)

                console.log(peeruuid)
            }
            catch{
                console.log("Error getting uuids 5")
                setError("Error getting uuids 5")
            }
            
            const me = new Peer(uuid, props.host.port === 9000 ? 
                {
                    host: "0.peerjs.com", 
                    port: 443
                }
                : {
                host: props.host.host,
                port: props.host.port,
                path: props.host.path,
            })
            setMe(me)
            setpeeruuid(peeruuid)
            setShowPlayer(true)
        }
        
    }

    const closePlayer = () =>{
        setShowPlayer(false);
    }

    return(
        <>
            <div id="call-main">
                { showPlayer && <VideoPlayer closePlayer={closePlayer} me={me as Peer} peeruuid={peeruuid} />}
                <div id="call-search">
                    <Input placeholder="name or 0x... " size={mobile ? "" : "small"} onChange={changeCallAddress}/>
                    <Button theme="light" size={mobile ? "" : "large"} text="Call" id="call-button" transacting={transacting} onClick={call}/>
                </div>
                {transactionGas}<br/>
                {promptText}<br/>
                {error}
            </div>
        </>
    )
}