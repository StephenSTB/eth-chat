import { useEffect, useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Web3 from "web3"
import {deployed} from "@sb-labs/web3-data/networks/DeployedContracts"
import { contractFactoryV2, ContractFactoryV2 } from "@sb-labs/contract-factory-v2"
import './App.css'
import { chains } from './interfaces/interfaces';
import { Connect } from './components/connect/Connect';
import { Peer } from "peerjs"

/*
interface Web3Props{
    web3: Web3;
    contracts: Contract[];
}*/



function App() {
  //const [web3, setWeb3] = useState({} as Web3)
  const [address, setAddress] = useState("")
  const [me, setMe] = useState<Peer>()
  const [peeruuid, setpeeruuid] = useState<string>()
  const [callStreamRecorder, setCallStreamRecorder] = useState<MediaRecorder>();

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

  },[callStreamRecorder] )

  const setCallStream = (callstream: MediaRecorder) =>{

    setCallStreamRecorder(callstream)
  }
 
  return (
    <div className='App'>
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index path="" element={<Connect text='Connect' getWeb3={getWeb3} me={me as Peer} setpeeruuid={setpeeruuid} setCallStreamRecoder={setCallStream} ></Connect>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
