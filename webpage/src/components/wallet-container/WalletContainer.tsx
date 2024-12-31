//import { useEffect } from "react";

import "./WalletContainer.css"

interface WalletContainerProps{
    wallet: any;
}
export const WalletContainer = (props: WalletContainerProps) =>{
    
    

    return(
        <>
            <div id="wallet-container">
                <div className="wallet-container-side-left"></div>
                <div className="wallet-container-center">
                    {props.wallet}
                    
                    
                </div>
                <div className="wallet-container-side-right"></div>
            </div>
            
        </>
    );
}