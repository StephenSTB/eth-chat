
import { useEffect, useState } from "react"
import "./HotWallet.css"

import { Create }  from "./components/create/Create"
import { Display } from "./components/display/Display"
import { Web3Engine } from "@sb-labs/web3-engine"
import { Import } from "./components/import/Import"

interface HotWalletProps{
    engine: Web3Engine;
    getEngine: any;
    getNetwork: any;
    network: string
}

export const HotWallet = (props: HotWalletProps) =>{

    const [component, setComponent] = useState<string>(); // "Create","import",  "Display"

    useEffect(() =>{
        //localStorage.setItem('hot-wallet', "")
        let encryptedUser = localStorage.getItem("hot-wallet");
        console.log("mnemonic", encryptedUser)
        
        if(encryptedUser === null || encryptedUser === ""){
            setComponent("Create")
            return;
        }
        setComponent("Display")
        
    }, [])

    const setComp = (comp: string) =>{
        setComponent(comp)
    }
    
    const getEngine = (engine: Web3Engine) =>{
        props.getEngine(engine)
    }

    const getNetwork = (network: string) =>{
        props.getNetwork(network)
    }

    return(
        <>
            <div id="hot-wallet-main">
                {
                    component === "Create" && 
                    <>
                        <Create setComp={setComp}></Create>
                    </>
                }
                {
                    component === "Display" &&
                    <>
                        <Display getEngine={getEngine} getNetwork={getNetwork} setComp={setComp} engine={props.engine} network={props.network}></Display>
                    </>
                }
                {
                    component === "Import" &&
                    <>
                        <Import getEngine={getEngine} setComp={setComp}/>
                    </>
                }
            </div>
        </>
    )
}