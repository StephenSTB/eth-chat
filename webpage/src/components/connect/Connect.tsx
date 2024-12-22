import { useEffect, useState,  } from "react"
import { Button, GetWeb3, Input, Text } from "@sb-labs/basic-components/dist"
import {Web3} from "web3"
import { isAddress } from 'web3-validator';
import { ContractFactoryV2, contractFactoryV2 } from "@sb-labs/contract-factory-v2"
import { deployed, } from "@sb-labs/web3-data"
import { chains } from '../../interfaces/interfaces';
import { v4 as uuidV4, validate} from "uuid"
import "./Connect.css"
//import { useNavigate } from "react-router-dom"
import WAValidator from "multicoin-address-validator"
import {Peer} from "peerjs";
import { VideoPlayer } from "../videoplayer/VideoPlayer";


interface ConnectProps{
    getWeb3(web3: Web3, uuid: string): any
    me: Peer;
    setpeeruuid(peeruuid: string): any;
    setCallStreamRecoder(callstream: MediaRecorder): any;
    text: string;
}

export function Connect(props: ConnectProps){

    const [promptText, setPromptText] = useState<string>()
    const [getConnect, setGetConnect] = useState<boolean>(true); 
    const [connectPeer, setConnectPeer] = useState<boolean>(false);
    const [address, setAddress] = useState<string>();
    //const [web3, setWeb3] = useState<Web3>();
    const [uuidConnect, setuuidConnect] = useState<any>();
    const [uuid, setuuid] = useState<string>();
    const [peeruuid, setpeeruuid] = useState<string>();
    const [callTransacting, setCallTransacting] = useState<boolean>(false)
    const [displayStream, setDisplayStream] = useState<boolean>(false)
    //let getConnect = true
    //const navigate = useNavigate();

    const [mobile , setMobile] = useState<boolean>(false)

    useEffect(() =>{
        setMobile(window.innerWidth > 900 ? false: true)

    }, [window.innerWidth])

   
/*
    useEffect(() =>{
        
        setDisplayStream(false)
    }, [displayStream])*/

    const getWeb3 = async (web3: Web3) =>{
        const address = (await web3.eth.getAccounts())[0]
        await setAddress(address)
        const factory = contractFactoryV2(web3) as ContractFactoryV2;
        const uuidConnect = factory["UUIDConnect"];
        const chainId = (await web3.eth.getChainId()).toString()
        console.log(chainId)
        const network = chains[ chainId]
        uuidConnect.options.address = deployed[network]["UUIDConnect"].address;
        await setuuidConnect(uuidConnect)
        //uuidConnect.get
        try{
            let myuuid = await uuidConnect.methods.uuidmap(address).call({from: address})
            console.log(myuuid)
            setuuid(myuuid)
            if(myuuid === ""){
                myuuid = uuidV4();

                setPromptText("Setting your uuid, save it. UUID: " +  uuid  )
                const setuuid = await uuidConnect.methods.setUUID(myuuid).send({from: address})
                console.log(setuuid)
                setuuid(myuuid)
                
            }
            await setGetConnect(false)
            await setConnectPeer(true)
            props.getWeb3(web3, myuuid as string)
        }
        catch{
            console.log("contract error")
        }
        
    }


    const onKeyDown = async (e: any) =>{
        //const address = (e.target as HTMLInputElement).value[(e.target as HTMLInputElement).value.length -1]
        //const enter =;
        console.log(props.me.id)
        if(e.keyCode === 13){
            // test address test
            let isEth : Boolean = true
            console.log(WAValidator.validate(e.target.value, "ETH")) // web3 validaor
            // test if the given address from target is valid if not assume not eth address
            if(!isAddress(e.target.value)){
                //console.log("1")
                isEth = false
            }
            if(!isEth){
                //console.log("2")
                //console.log(validate(e.target.value))
                if(!validate(e.target.value).valueOf()){ // uuid validator
                    console.log("3")
                    await setPromptText("Invalid address given.") //Invalid eth or uuid address.
                    return
                }
                await setPromptText("Calling")
                await setCallTransacting(true)
                //call
                await setDisplayStream(true)

                return;
            }
            await setPromptText("Calling")
            try{
                const peeruuid = await uuidConnect?.methods.uuidmap(e.target.value).call({from: address} )
                console.log(peeruuid)
                if(peeruuid === ""){
                    setPromptText("Error user needs to connect network account.")
                    return
                }
                //const uuid = await uuidConnect?.methods.uuidmap(address).call({from: address} )
                await props.setpeeruuid(peeruuid)
                
                await setpeeruuid(peeruuid)

                await setCallTransacting(true)
                //call
               
                await setDisplayStream(true)
                
            }catch{
                setPromptText("Error getting info: uuid")
                return;
            }

            try{
                
            }catch{
                setPromptText("Error performing call.")
            }
            //setuuid(uuid)
        }
    }
    const prefix = "/src/assets/"
    const tracks = [ prefix + "CtrlAltDelete.mp3", prefix + "don'tknowwhy.mp3", prefix + "Bleach.mp3", prefix + "Suppuku.mp3"]; //prefix + "Bleach.mp3", prefix + "Suppuku.mp3"

    let track = 0;

    const switchTrack = () =>{
        const track = (Math.floor(Math.random() * 1000 )) % tracks.length;
        (document.querySelector("#player") as HTMLAudioElement).src = tracks[track];
        (document.querySelector("#player") as HTMLAudioElement).play();
    }

    useEffect(() =>{
        console.log("play first track");
        ;
        const next = (Math.floor(Math.random() * 1000) ) % tracks.length;
        console.log((next));
        (document.querySelector("#player") as HTMLAudioElement).src =  tracks[next];
        (document.querySelector("#player") as HTMLAudioElement).play();
        (document.querySelector("#player") as HTMLAudioElement).addEventListener("ended", switchTrack)
    }, [])

/*
size?: string;
    placeholder?: string;
    onChange?: any;
    onKeyDown?: any;
    button?: boolean;
    icon?: any;
    onClick?: any;
    theme?: string;
    inputType?: string;
    id?:string;
*/
    return(
        <div id="connect">

            {
                displayStream && <VideoPlayer me={props.me } peeruuid={peeruuid as string} /> // getStreaming?{/*setCallStreamRecorder={props.setCallStreamRecoder*/}
                
            }
            {
                !displayStream && <div id="spacer" />
            }
            {

            }
                {getConnect &&
                <>
                    {<GetWeb3 text={props.text} default_network={11155111} networkIds={[11155111]} getWeb3={getWeb3}/>}
                    <br />
                    
                </>
            
                } 
                <div id="callbar">
                    { 
                        connectPeer && <>
                            <Input size={mobile ? "small" : "medium"} placeholder="0x...90d" onKeyDown={onKeyDown}></Input> 
                            <br/>
                                
                        </>
                    }{

                    }
                    {
                        callTransacting && <Button theme="light" size="mini" transacting={true}/>
                    }
                    
                    <Text theme="light" text={promptText} ></Text>
                </div>
                <>
                    <audio controls id="player" src="/src/assets/don'tknowwhy.mp3">
                        {/*<source src="/src/assets/don'tknowwhy.mp3" type="audio/mp3" id="player-source"/>*/}
                        {/*<source src="/src/assets/CtrlAltDelete.mp3" type="audio/mp3"/>*/}
                    </audio>
                    {/*<Input placeholder = "Audio link..." onKeyDown={getAudio} size="small"></Input>*/}
                    
                </>
                
                
        </div>
    )
}