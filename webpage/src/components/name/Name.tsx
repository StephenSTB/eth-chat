import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Web3Engine } from "@sb-labs/web3-engine"
import "./Name.css"
import * as Block from 'multiformats/block';
import * as raw from "multiformats/codecs/raw"
import { sha256 } from 'multiformats/hashes/sha2';
import axios from "axios" 
import { Icon, Textarea, Input, Button } from "@sb-labs/basic-components/dist";
import { user } from "@sb-labs/images"

/*
import { createHelia } from "helia";

const helia = await createHelia({})

setInterval(() =>{
    console.log(helia.libp2p.getConnections())
}, 10000)
*/

interface NameProps{
    network: string,
    engine: Web3Engine,
    host: any;
}

export const Name = (props: NameProps) =>{
    const [name, setName] = useState<string>("")
    const [bio, setBio] = useState<string>()
    const [link, setLink] = useState<string>()
    const [linkDisplay, setLinkDisplay] = useState<string>();
    const [avatar, setAvatar] = useState<string>();
    
    

    const [createName, setCreateName] = useState<boolean>(false);
    const [iconImport, setIconImport] = useState<string>(user);

    const [newName, setNewName] = useState<string>("");
    const [newBio, setNewBio] = useState<string>("")
    const [newLink, setNewLink] = useState<string>("")
    const [avatarCid, setAvatarCid] = useState<string>("")
    const [avatarFile, setAvatarFile] = useState<File>();

    const [error, setError] = useState<string>("");

    const [engine, setEngine] = useState<Web3Engine>();
    const [network, setNetwork] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [transacting, setTransacting] = useState<boolean>(false)

    const [newNameGas, setNewNameGas] = useState<string>("") 
    const [editInfoGas, setEditInfoGas] = useState<string>("")

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
            setEngine(engine)
            setNetwork(network)
            setAccount(account as string)
            let name = (await engine.sendTransaction(network, {from: account}, "Name", "Names", [account], true)).transaction

            console.log(name == "")
            
            if(name !== undefined && name !== ""){

                let gas = await engine?.getGas(network, {from: account}, "Name", "editInfo", [newBio, "bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24", "bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24"])
                const utils = engine?.defaultInstance?.web3.utils;
                console.log(utils?.fromWei(gas.gas.toString(), "ether"))
                setEditInfoGas(utils?.fromWei(gas.gas.toString(), "ether") as string);
                
                let nameInfo = (await engine.sendTransaction(network, {from: account}, "Name", "Info", [account], true)).transaction
                console.log(nameInfo)
                
                setName(name)
                setBio(nameInfo.bio)

                const block = await Block.encode({value: new Uint8Array() , codec: raw, hasher: sha256});

                console.log(block.cid.toString())
                if(name.link !== "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"){
                    setLink(nameInfo.link)
                    setLinkDisplay(nameInfo.link.slice(0, 9) + "..." + nameInfo.link.slice(-4))
                }  

                try{    
                    console.log(nameInfo.avatar)
                    let _avatar = await axios.get("https://ipfs.io/ipfs/" + nameInfo.avatar, {responseType: "blob"})
                    if(_avatar.data.type.includes("image/png")){
                        const blobUrl = window.URL.createObjectURL(_avatar.data);
                        console.log(_avatar.data)
                        setAvatar(blobUrl)
                    }

                }catch{
                    console.log("Bad axios request name 0.")
                }
            }
            else{

                // todo random name
                console.log("here111")
                let gas = await engine?.getGas(network, {from: account}, "Name", "createName", ["newName", "", "bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24", "bafkreie6z5t57xg2htwfdgjhvv6wyaqemfqjggsoswzpsimi5c6ibjtg24"])
                console.log(gas)
                const utils = engine?.defaultInstance?.web3.utils;
                console.log(utils?.fromWei(gas.gas.toString(), "ether"))
                setNewNameGas(utils?.fromWei(gas.gas.toString(), "ether") as string);
                setCreateName(true)
                console.log("here")
            }
            
            //console.log(nameInfo)
        } 
        getInfo()
    }, [props.engine])

    useEffect(() =>{

    },[error])

    function fileToUint8Array(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const uint8Array = new Uint8Array(reader.result as ArrayBuffer);
            resolve(uint8Array);
          };
          reader.onerror = () => {
            reject(reader.error);
          };
          reader.readAsArrayBuffer(file);
        });
      }

    const changeAvatar = async (e : any) =>{
        console.log(e.target.value)
        console.log("get avatar")
        const avatarInput = ((document.getElementById("name-avatar-button")) as HTMLInputElement).files?.item(0)
        setAvatarFile(avatarInput as File)

        console.log(await fileToUint8Array(avatarInput as File))

        const file = await fileToUint8Array(avatarInput as File)

        const block = await Block.encode({value: file, codec: raw, hasher: sha256})
        setAvatarCid(block.cid.toString())
        //setAvatarData(block as any)
        
        const blobUrl = URL.createObjectURL(avatarInput as File);
        setIconImport(blobUrl)
        
    }
   
    const changeName = async (e: any) =>{
        const address = (await engine?.sendTransaction(network, {from: account}, "Name", "NamesResolver", [e.target.value], true)).transaction;
        console.log(address)
        if(address !== "0x0000000000000000000000000000000000000000"){
            setError("Name already taken.")
            return;
        }
        setError("")
        setNewName(e.target.value)
        
    }

    const changeBio = async (e:any) =>{
        setNewBio(e.target.value)
    }

    const changeLink = (e: any) =>{
        //59 "bafybei""bafkrei"
        if(e.target.value.length !== 59){
            setError("Link cid not long enough")
            return;
        }
        console.log(e.target.value.slice(0, 7))
        if(e.target.value.slice(0, 7) !== "bafkrei"){
            setError("Incorret begining prefix for raw or pb content.")
            return;
        }
        setNewLink(e.targe.value)

    }
    const NewName = async () =>{
        setTransacting(true)
        let link = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
        let avatar = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
        // get blank info
        if(newLink !== ""){
            link = newLink;
        }
        if(avatarCid != ""){
            avatar = avatarCid
        }

        
        // send transaction
        let gas = await engine?.getGas(network, {from: account}, "Name", "createName", [newName, newBio, link, avatar])
        const utils = engine?.defaultInstance?.web3.utils;
        console.log(utils?.fromWei(gas.gas.toString(), "ether"))
        
        let createTranasaction = await engine?.sendTransaction(network, {from: account}, "Name", "createName", [newName, newBio, link, avatar])
        if(!createTranasaction.success){
            console.log(createTranasaction)
            return
        }

        let transaction =  (await engine?.sendTransaction(network, {from: account}, "Name", "Info", [account], true)).transaction
        transaction.network = network
        console.log(transaction)
        //TODO send avatar
        /*
        const formData = new FormData();
        if(avatarFile !== undefined){
            //console.log("here")
            formData.append('file', avatarFile as File);
            formData.append('data', JSON.stringify(transaction))
            await axios.post(`${props.host.port == 3001 ? `http://localhost:3001/api/avatar` : "https://" + props.host.host + ":" + props.host.port + "/api/avatar"}`, formData, {
                headers:{
                    "Content-Type": 'multipart/form-data'
                }
            })
        }*/

        setName(newName)
        setBio(newBio)
        setLink(newLink)
        setAvatar(iconImport)
        setCreateName(false)
        setTransacting(false)
    }

    const editInfo = async () =>{
        console.log("edit info")
        setTransacting(true)

        //let info = (await engine?.sendTransaction(network, {from: account}, "Name", "Info", [account], true)).transaction

        let link = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
        let avatar = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
        // get blank info

        console.log(avatarCid)
        console.log("newlink avatar cid", newLink, avatarCid)
        if(newLink !== ""){
            link = newLink;
        }
        if(avatarCid !== ""){
            avatar = avatarCid
        }

        let editTransaction = await engine?.sendTransaction(network, {from: account}, "Name", "editInfo", [newBio, link, avatar])

        if(!editTransaction.success){
            console.log(editTransaction)
            return
        }

        let transaction =  (await engine?.sendTransaction(network, {from: account}, "Name", "Info", [account], true)).transaction
        transaction.network = network
        console.log(transaction)
        /*
        //TODO send avatar
        const formData = new FormData();
        if(avatarFile !== undefined){
            //console.log("here")
            formData.append('file', avatarFile as File);
            formData.append('data', JSON.stringify(transaction))
            const resp = await axios.post(`${props.host.port == 3001 ? `http://localhost:3001/api/avatar` : "https://" + props.host.host + ":" + props.host.port +  "/api/avatar"}`, formData, {
                headers:{
                    "Content-Type": 'multipart/form-data'
                }
            })
            console.log(resp)
        }*/

        setBio(newBio)
        setLink(newLink)
        setAvatar(iconImport)
        setTransacting(false)
    }

    return(
        <>
        <div id="name-main">
            <div id="name-main-view">
                {
                    name !== "" &&
                    <>
                        <div id="name-current">
                            <div id="name-name">{name} <Icon src={avatar} size="large" round={true} /></div>
                            <div id="name-bio"><Textarea value={bio} /></div>
                            <div> <a href={"https://ipfs.io/ipfs/" + link}>{linkDisplay}</a></div>
                        </div>
                        <div id="name-edit">
                            <h3>Edit</h3>
                            
                            <div id="name-edit-bio"><Textarea placeholder="bio..." onChange={changeBio}></Textarea></div>
                            <Input placeholder="link..." size="small" id="name-link-input" onChange={changeLink}/>
                            <div id="name-avatar-section"> 
                                <input id="name-avatar-button" type="file" accept="image/png" onChange={changeAvatar}></input>
                                <Icon src={iconImport} />
                            </div>
                            <div id="name-edit-button">gas: {editInfoGas}&nbsp; <Button size="medium" text="Edit" transacting={transacting} onClick={editInfo} /></div>
                        </div>
                    </>
                    
                }
                {
                    createName &&
                    <>
                        <div id="name-create">
                            <h3>Create Name</h3>
                            <div>
                                <Input placeholder="name..." size="small" id="name-name-input" onChange={changeName}/>
                                <div id ="name-bio-textarea"><Textarea placeholder="bio..." onChange={changeBio}/></div>
                                <Input placeholder="link..." size="small" id="name-link-input" onChange={changeLink}/>
                                <label>Upload Avatar:</label>
                                <div id="name-avatar-section"> 
                                    <input id="name-avatar-button" type="file" accept="image/png" onChange={changeAvatar}></input>
                                    <Icon src={iconImport} />
                                </div>
                                <div id="name-name-button">gas: {newNameGas} <Button size="medium" text="Create" transacting={transacting} onClick={NewName} /></div>
                            </div>
                        </div>
                    </>
                    
                }
                <div>{error}</div>
            </div>
        </div>
        
        </>
    )
}