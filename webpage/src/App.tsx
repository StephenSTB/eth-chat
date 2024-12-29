import { useEffect, useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Web3 from "web3"
import {deployed} from "@sb-labs/web3-data/networks/DeployedContracts"
import { contractFactoryV2, ContractFactoryV2 } from "@sb-labs/contract-factory-v2"
import { EngineArgs, Web3Engine } from '@sb-labs/web3-engine'
import './App.css'
import { chains } from './interfaces/interfaces';
import { Connect } from './components/connect/Connect';
import { Peer } from "peerjs"
import { Topbar } from './components/topbar/Topbar'
import { WalletContainer } from './components/wallet-container/WalletContainer'
import { HotWallet } from './components/hot-wallet/HotWallet'
import { Call } from './components/call/Call'
import { Name } from './components/name/Name'
/*
interface Web3Props{
    web3: Web3;
    contracts: Contract[];
}*/

function App() {
  //const [web3, setWeb3] = useState({} as Web3)
  const [account, setAccount] = useState<string>("")
  const [displayAddress, setDisplayAddress] = useState<string>("")
  const [me, setMe] = useState<Peer>()
  const [peeruuid, setpeeruuid] = useState<string>()
  const [callStreamRecorder, setCallStreamRecorder] = useState<MediaRecorder>();
  const [engine, setEngine] = useState<Web3Engine>(new Web3Engine({} as EngineArgs));
  const [network, setNetwork] = useState<string>("Sepolia");
/*
  async function getWeb3(web3: Web3, uuid: string){
    console.log("getweb3")
    let addr = (await web3.eth.getAccounts())[0];
    console.log(addr)
    console.log(address)
    console.log(peeruuid);
    setAddress(addr)
    
    const factory = contractFactoryV2(web3) as ContractFactoryV2
    const uuidConnect = factory["UUIDConnect"];
    console.log(uuidConnect)
    const chainId = (await web3.eth.getChainId()).toString()
    console.log(chainId)
    const network = chains[ chainId]
    //console.log(network)
    //console.log(deployed)
    uuidConnect.options.address = deployed[network]["UUIDConnect"].address
    
    await setMe(new Peer(uuid))

    console.log("set peer", uuid)

    //await setWeb3(web3)
    //await setAddress(address)
  }
  useEffect(() =>{

  },[callStreamRecorder] )*/

  const setCallStream = (callstream: MediaRecorder) =>{

    setCallStreamRecorder(callstream)
  }

  const getEngine = (engine: Web3Engine) =>{
    setEngine(engine)
  }

  const getNetwork = (network: string) => {
    setNetwork(network)
  }

    const prefix = "/src/assets/"
    const tracks = [ prefix + "CtrlAltDelete.mp3", prefix + "don'tknowwhy.mp3", prefix + "Bleach.mp3", prefix + "Suppuku.mp3", prefix + "MyFlaws.mp3"]; //prefix + "Bleach.mp3", prefix + "Suppuku.mp3"

    //let track = 0;

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
        //(document.querySelector("#player") as HTMLAudioElement).play();
        (document.querySelector("#player") as HTMLAudioElement).addEventListener("ended", switchTrack)
    }, [])
 
  return (
    <div className='App'>
        
        <BrowserRouter>
            <Topbar></Topbar>
            {
                        <>
                            <audio controls id="player" src="/src/assets/don'tknowwhy.mp3">
                            </audio>
                        </> 
            }
            <Routes>
                <Route path="/">
                    <Route index element={<WalletContainer wallet={<HotWallet getEngine={getEngine} getNetwork={getNetwork} engine={engine} network={network}/>}></WalletContainer>} />
                    
                    <Route path="call" element={<div>
                                                {
                                                    /*<Connect text='Connect' getWeb3={getWeb3} me={me as Peer} setpeeruuid={setpeeruuid} setCallStreamRecoder={setCallStream} ></Connect>
                                                                        <Messages></Messages>*/
                                                }
                                                <Call engine={engine} network={network}/>
                                          </div>}
                                        />
                  <Route path="name" element={<Name engine={engine} network={network}/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
