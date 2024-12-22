import { ChangeEvent, useState } from "react"
import { Input, Button, Textarea } from "@sb-labs/basic-components/dist"
import { EngineArgs, Web3Engine } from "@sb-labs/web3-engine"
import "./Create.css"

import * as CryptoJS from 'crypto-js'

interface CreateProps{
    setComp: any
}

export const Create = (props: CreateProps) =>{

    const [component, setComponent] = useState<string>("Create")

    const  [mnemonic,  setMnemonic] = useState<string>("")

    const [password, setPassword] = useState<string>("")

    const [confirm, setConfirm] = useState<string>("");

    const [error, setError] = useState<string>("")

    const confirmPasswords = () =>{
        if(password?.length >= 12 && confirm?.length >= 12){
            if(password === confirm){
                // create wallet

                const engine = new Web3Engine({} as EngineArgs);
                const mnemonic = engine.generateMnemonic()
                setMnemonic(mnemonic)
                setComponent("Mnemonic")
            }
            else{
                setError("Passwords not the same.")
                return
            }
            
            
        }
        else{
            setError("Password not long enough.")
        }
    }

    const encryptWallet = () =>{
        let encryptedUser = CryptoJS.AES.encrypt(mnemonic, password).toString();
        let hmac = CryptoJS.HmacSHA256(encryptedUser, CryptoJS.SHA256(password)).toString();
        localStorage.setItem('hot-wallet', JSON.stringify({encryptedUser, hmac}))
        props.setComp("Display")
    }

    const changePassword = (e: ChangeEvent<HTMLInputElement>) =>{
        setPassword(e.target.value)
    }

    const changeConfirm = (e: ChangeEvent<HTMLInputElement>) =>{
        setConfirm(e.target.value)
    }

    const passwordEnter = (e: any) =>{
        if(e.keyCode === 13){
            confirmPasswords();
        }
    }

    return(<>
        <div id="wallet-create">
            <h3>Create Wallet</h3>
            {
                component === "Create" && <>
                        <div id="wallet-password"><Input placeholder="password..." onChange={changePassword} inputType="password"/></div>
                        <div id="wallet-password-confirm"><Input placeholder="confirm..." onChange={changeConfirm} onKeyDown={passwordEnter} inputType="password"/></div>
                        <Button size="medium" text="Create" id="wallet-create-button" onClick={() => confirmPasswords() }></Button>     
                        {
                            error !== "" && <>{error}</>
                        } 
                </>
                
            }{
                component === "Mnemonic" && <>
                    <Textarea size="medium" theme="light" value={mnemonic}/>
                    <Button text="Continue" size="large" id="continue-button" onClick={encryptWallet}/>
                </>
            }
                 
        </div>
    </>);
}