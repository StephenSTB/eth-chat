
import { Button } from "@sb-labs/basic-components/dist";
import "./Topbar.css"
import { useNavigate } from "react-router-dom";
export const Topbar = () =>{

    const navigate = useNavigate();
    /*
    const changeWallet = (e: Event) =>{
        console.log("change wallet")
    }*/

    return(
        <>
            <div id="topbar">
                <div className="top-section">
                    <Button size="small" text="Name" onClick={() => navigate("/name")} theme="light" id="top-button"></Button>
                    {/*<Button size="small" text="Call" onClick={() => navigate("/call")} theme="light" id="top-button"></Button>*/}
                    <Button size="small" text="Follow" onClick={() => navigate("/follow")} theme="light" id="top-button"></Button>
                    <Button size="small" text="Wallet" onClick={() => navigate("/")} theme="light" id="top-button"></Button>
                </div>
                <div className="top-section"></div>
                <div className="top-section"></div>
                <div className="top-section">
                    
                </div>
            </div>
        </>
    );
    

}