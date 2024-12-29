import { useState, ChangeEvent } from "react"
import { Button, Input } from "@sb-labs/basic-components/dist"
import "./Import.css"
import { EngineArgs, Web3Engine } from "@sb-labs/web3-engine"
import * as CryptoJS from 'crypto-js'

interface ImportProps{
    getEngine: any
    setComp: any
}

export const Import = (props: ImportProps) =>{

    const [mnemonic, setMnemonic] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirm, setConfirm] = useState<string>("")
    const [error, setError] = useState<string>("");

    const importAccount = () =>{
        const engine = new Web3Engine({} as EngineArgs)
        if(!engine.validateMnemonic(mnemonic as string)){
            setError("Invalid mnemonic given.")
            return
        }
        if(password.length < 12 || confirm.length < 12){
            setError("Password not long enough.")
            return;
        }
        if(password !== confirm){
            setError("Passwords didn't match.")
            return;
        }

        let encryptedUser = CryptoJS.AES.encrypt(mnemonic, password).toString();
        let hmac = CryptoJS.HmacSHA256(encryptedUser, CryptoJS.SHA256(password)).toString();
        localStorage.setItem('hot-wallet', JSON.stringify({encryptedUser, hmac}))
        props.setComp("Display")
    }

    const changeMneonic = (e: ChangeEvent<HTMLInputElement>) =>{
        setMnemonic(e.target.value)
    }

    const changePassword = (e: ChangeEvent<HTMLInputElement>) =>{
        setPassword(e.target.value)
    }

    const changeConfirm = (e: ChangeEvent<HTMLInputElement>) =>{
        setConfirm(e.target.value)
    }

    const setDisplay = () =>{
        props.setComp("Display")
    }

    const setCreate = () =>{
        props.setComp("Create")
    }

    return(
        <>
            <div id="import">
                <h3>Import</h3>
                <Input placeholder="mnemonic..." size="small" id="import-mnemonic-input" inputType="password" onChange={changeMneonic} />
                <Input placeholder="password..." size="small" id="import-password-input" inputType="password" onChange={changePassword} />
                <Input placeholder="confirm..." size="small" id="import-confirm-input" inputType="password" onChange={changeConfirm} />
                <div id="connect-display">
                    <Button text="Back" size="small" id="import-display-button" onClick={setDisplay} />
                    <Button text="Connect" size="small" id="import-connect-button" onClick={importAccount} />
                </div>
                <div id= "create-display"><Button onClick={setCreate} size="small" text="Create" id="import-create-button"/></div>
                {error}
            </div>
        </>
    )
}