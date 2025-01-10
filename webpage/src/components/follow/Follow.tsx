import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Follow.css"
import { Input, Button } from "@sb-labs/basic-components/dist";
import { isAddress } from "web3-validator";
import { Web3Engine } from "@sb-labs/web3-engine";
import { ContractCodeNotStoredError } from "web3";

interface FollowProps{
    engine: Web3Engine
    network: string;
    host: any;
}
export const Follow = (props: FollowProps) =>{

    const navigate = useNavigate();

    const engine = props.engine;
    const network = props.network;
    const account = engine.defaultAccount

    const [mobile, setMobile] = useState(false);

    const [toFollow, setToFollow] = useState<string>("");

    const [transacting, setTransacting] = useState<boolean>(false);

    const [following, setFollowing] = useState<string[]>([]);

    const [followers, setFollowers] = useState<number>(0);

    const [error, setError] = useState<string>("");

    useEffect(()  =>{

        if(props.engine.mnemonic === undefined){
            navigate("/")
            return
        }

        if(window.innerWidth < 900){
            setMobile(true)
        }

        
       

        // get following
        const getFollowing = async () =>{
            // reject no sign keys
            const signKey = await engine.sendTransaction(network, {from: account}, "PublicKeys", "SignKeys", [account], true)

            console.log(signKey)
            if(signKey.transaction.v == 0){
                navigate("/")
            }
            
            const number = await engine.sendTransaction(network, {from: account}, "Following", "numFollowing", [], true)
            console.log(number)

            const num = Number(number.transaction) < 25 ? Number(number.transaction) : 25;

            if(num > 0){
                const following_tx = await engine.sendTransaction(network, {from: account}, "Following", "following", [0, num], true)
                //console.log(following.transaction.length)
                let following = []
                for(let i =0; i < following_tx.transaction.length; i++){
                    const name =  await engine.sendTransaction(network, {from:account}, "Name", "Names", [following_tx.transaction[i]], true)
                    console.log(name)
                    if(name.transaction != ""){
                        following[i] = name.transaction
                        continue;
                    }
                    following[i] = following_tx.transaction[i]
                }
                   
                
                setFollowing(following)
                
            }

            const number0 = await engine.sendTransaction(network, {from: account}, "Following", "numFollowers", [account], true)
            console.log(number0.transaction)
            
            setFollowers(number0.transaction)
            
            
        }
        getFollowing();
        // get followers
    }, [])

    const changeFollow = async (e: any) =>{
        console.log(e.target.value)
        const name_tx = await engine.sendTransaction(network, {from: account}, "Name", "NamesResolver", [e.target.value], true)
        console.log(name_tx.transaction)
        if(name_tx.transaction != "0x0000000000000000000000000000000000000000"){
            console.log("found name")
            setToFollow(name_tx.transaction)
            setError("")
        }
        else if(isAddress(e.target.value)){
            setToFollow(e.target.value)
            setError("")
        }
        else{
            setError("Name or address not found")
        }
    }

    const follow = async () =>{ 
        console.log(toFollow)
        setTransacting(true)
        const follow_tx = await engine.sendTransaction(network, {from: account}, "Following", "follow", [toFollow])
        console.log(follow_tx)
        setTransacting(false)
        if(follow_tx.success){
            setError("Followed")
        }
        else{
            setError("Error following")
        }
    }

    return(
        <>
            <div id="follow-main">
                <div id="follow-box">
                    <h3>Follow</h3>
                    <div id="follow-follow">
                        <Input placeholder="name or 0x... " size={mobile ? "" : "small"} onChange={changeFollow}/>
                        <Button theme="light" size={mobile ? "" : "large"} text="Follow" id="follow-button" transacting={transacting} onClick={follow}/>
                    </div>
                    <h3>Following</h3>
                    <div id="follow-following">
                        {
                            following.map(e =>{
                                return(<div key={e}>
                                    {e}
                                </div>)
                            })
                        }
                    </div>
                    <h3>Followers</h3>
                    <div id="follow-followers">
                        {followers}
                    </div>
                    {error}
                </div>
            </div>
        </>
    );
}