import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Web3Engine } from "@sb-labs/web3-engine"
import "./Name.css"
import * as Block from 'multiformats/block';
import * as raw from "multiformats/codecs/raw"
import { sha256 } from 'multiformats/hashes/sha2';
import axios from "axios" 
import { Icon, Textarea, Input } from "@sb-labs/basic-components/dist";
import { user } from "@sb-labs/images"

interface NameProps{
    network: string,
    engine: Web3Engine
}

export const Name = (props: NameProps) =>{
    const [name, setName] = useState<string>("")
    const [bio, setBio] = useState<string>()
    const [link, setLink] = useState<string>()
    const [avatar, setAvatar] = useState<string>();

    const [createName, setCreateName] = useState<boolean>(false);
    const [iconImport, setIconImport] = useState<string>(user);
    const navigate = useNavigate()
    useEffect(() =>{
        if(props.engine.mnemonic === undefined){
            navigate("/")
            return
        }

        /*getInfo*/
        const getInfo = async() =>{
            
            const engine = props.engine
            const network = props.network
            const account = engine.defaultAccount
            let name = (await engine.sendTransaction(network, {from: account}, "Name", "Names", [account], true)).transaction

            console.log(name== "")
            
            if(name !== undefined && name !== ""){
                let nameInfo = (await engine.sendTransaction(network, {from: account}, "Name", "Info", [account], true)).transaction
                console.log(nameInfo)
                
                setName(name)
                setBio(nameInfo.bio)

                const block = await Block.encode({value: new Uint8Array() , codec: raw, hasher: sha256});

                console.log(block.cid.toString())
                if(name.link !== "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"){
                    setLink("https://ipfs.io/ipfs/" + nameInfo.link)
                }  

                try{    
                    console.log(nameInfo.avatar)
                    let _avatar = await axios.get("https://ipfs.io/ipfs/" + nameInfo.avatar, {responseType: "blob"})
                    if(_avatar.data.type.includes("image")){
                        const blobUrl = window.URL.createObjectURL(_avatar.data);
                        console.log(_avatar.data)
                        setAvatar(blobUrl)
                    }

                }catch{
                    console.log("Bad axios request name 0.")
                }
            }
            else{
                setCreateName(true)
                console.log("here")
                


            }
            
            //console.log(nameInfo)
        } 
        getInfo()
    }, [props.engine])



    const getAvatar = (e : any) =>{
        console.log(e.target.value)
        console.log("get avatar")
        const avatarInput = ((document.getElementById("name-avatar-button")) as HTMLInputElement).files?.item(0)
        console.log(avatarInput)
        //const reader = new FileReader()
        
        const blobUrl = URL.createObjectURL(avatarInput as File);
        setIconImport(blobUrl)
    }
    
    return(
        <>
        <div id="name-main">
            <div id="name-main-view">
                {
                    name !== "" &&
                    <div id="name-current">
                        <div id="name-name">{name} <Icon src={avatar} size="large" round={true} /></div>
                        <div id="name-bio"><Textarea value={bio} /></div>
                        <div>{link}</div>
                    </div>
                }
                {
                    createName &&
                    <div id="name-create">
                        <h3>Create Name</h3>
                        <div>
                            <Input placeholder="name..." size="small" id="name-name-input"/>
                            <div id ="name-bio-textarea"><Textarea placeholder="bio..." /></div>
                            <Input placeholder="link..." size="small" id="name-link-input"/>
                            <label >Upload Avatar:</label>
                            <div id="name-avatar-section"> 
                                <input id="name-avatar-button" type="file" accept="image/png, image/jpeg" onChange={getAvatar}></input>
                                <Icon src={iconImport} /></div>
                        </div>
                    </div>
                }
                
            </div>
        </div>
        
        </>
    )
}