import { useEffect } from "react";

import "./WalletContainer.css"

interface WalletContainerProps{
    wallet: any;
}
export const WalletContainer = (props: WalletContainerProps) =>{
    
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
        //(document.querySelector("#player") as HTMLAudioElement).play();
        (document.querySelector("#player") as HTMLAudioElement).addEventListener("ended", switchTrack)
    }, [])

    return(
        <>
            <div id="wallet-container">
                <div className="wallet-container-side-left"></div>
                <div className="wallet-container-center">
                    {props.wallet}
                    {
                        <>
                            <audio controls id="player" src="/src/assets/don'tknowwhy.mp3">
                            </audio>
                        </> 
                    }
                    
                </div>
                <div className="wallet-container-side-right"></div>
            </div>
            
        </>
    );
}