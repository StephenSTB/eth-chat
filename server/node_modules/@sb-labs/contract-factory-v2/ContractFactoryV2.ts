

import { AbiItem } from "web3-utils";

import Web3 from "web3"

import NFT_Register from "../web3-data/contracts/NFT_Register.json" assert {"type" : "json"}

// Dapp
import UserRegister from "../web3-data/contracts/UserRegister.json" assert {"type" : "json"}

import Messages from "../web3-data/contracts/Messages.json" assert {"type" : "json"}

import Feed from "../web3-data/contracts/Feed.json" assert {"type" : "json"}

import FeedViewer from "../web3-data/contracts/FeedViewer.json" assert {"type" : "json"}

import CryptoRicks from "../web3-data/contracts/CryptoRicks.json" assert {"type" : "json"}

import VRFHelper from "../web3-data/contracts/VRFHelper.json" assert {"type" : "json"}

import Shop from "../web3-data/contracts/Shop.json" assert {"type" : "json"}

import MockUSDC from "../web3-data/contracts/MockUSDC.json" assert {"type" : "json"}

import StevesTees from "../web3-data/contracts/StevesTees.json" assert {"type" : "json"}

import AgeUpdater from "../web3-data/contracts/AgeUpdater.json" assert {"type": "json" }

import UserAgeManager from "../web3-data/contracts/UserAgeManager.json" assert { "type" : "json" }

import TransparentUpgradableProxy from "../web3-data/contracts/TransparentUpgradeableProxy.json" assert { "type" : "json" }

import CometInterface from "../web3-data/contracts/CometInterface.json" assert { "type" : "json" }

import LiquidatableQuery from "../web3-data/contracts/LiquidatableQuery.json"  assert { "type" : "json" }

import OnChainLiquidator from "../web3-data/contracts/OnChainLiquidator.json" assert { "type" : "json" }

import PoolManager from "../web3-data/contracts/PoolManager.json" assert { "type" : "json" }

import MockAsset from "../web3-data/contracts/MockAsset.json" assert { "type" : "json" }

import BasicHook from "../web3-data/contracts/BasicHook.json" assert { "type" : "json" }

import MessagesENS from "../web3-data/contracts/MessagesENS.json" assert {"type": "json"}

import UUIDConnect from "../web3-data/contracts/UUIDConnect.json" assert {"type": "json"}

import PublicKeys from "../web3-data/contracts/PublicKeys.json" assert {"type":"json"}

import Call from "../web3-data/contracts/Call.json" assert {"type":"json"}

import Name from "../web3-data/contracts/Name.json" assert {"type":"json"};

export interface ContractFactoryV2{
    [key: string] : any;
}

export const contractFactoryV2 = (web3 : Web3) : ContractFactoryV2 => {

    return {
        "NFT_Register": (new web3.eth.Contract(NFT_Register.abi as AbiItem[], "" , {data: NFT_Register.bytecode}) as unknown) as any,
        "UserRegister": (new web3.eth.Contract(UserRegister.abi as AbiItem[], "" , {data: UserRegister.bytecode}) as unknown) as any,
        "Messages": (new web3.eth.Contract(Messages.abi as AbiItem[], "" , {data: Messages.bytecode}) as unknown) as any,
        "Feed": (new web3.eth.Contract(Feed.abi as AbiItem[], "" , {data: Feed.bytecode}) as unknown) as any,
        "FeedViewer": (new web3.eth.Contract(FeedViewer.abi as AbiItem[], "" , {data: FeedViewer.bytecode}) as unknown) as any,
        "CryptoRicks": (new web3.eth.Contract(CryptoRicks.abi as AbiItem[], "" , {data: CryptoRicks.bytecode}) as unknown) as any,
        "VRFHelper": (new web3.eth.Contract(VRFHelper.abi as AbiItem[], "" , {data: VRFHelper.bytecode}) as unknown) as any,
        "Shop": ( new web3.eth.Contract(Shop.abi as AbiItem[], "", {data: Shop.bytecode}) as unknown) as any,
        "MockUSDC": ( new web3.eth.Contract(MockUSDC.abi as AbiItem[], "", {data: MockUSDC.bytecode}) as unknown) as any,
        "StevesTees": ( new web3.eth.Contract(StevesTees.abi as AbiItem[], "", {data: StevesTees.bytecode}) as unknown) as any,
        "AgeUpdater": ( new web3.eth.Contract(AgeUpdater.abi as AbiItem[], "", {data: AgeUpdater.bytecode}) as unknown) as any,
        "UserAgeManager": ( new web3.eth.Contract(UserAgeManager.abi as AbiItem[], "", {data: UserAgeManager.bytecode}) as unknown) as any,
        
        "MockAsset": ( new web3.eth.Contract(MockAsset.abi as AbiItem[], "", {data: MockAsset.bytecode}) as unknown) as any,

        "TransparentUpgradableProxy": ( new web3.eth.Contract(TransparentUpgradableProxy.abi as AbiItem[], "", {data: TransparentUpgradableProxy.bytecode}) as unknown) as any,

        "CometInterface": ( new web3.eth.Contract(CometInterface.abi as AbiItem[], "", {data: CometInterface.bytecode}) as unknown) as any,
        "LiquidatableQuery": ( new web3.eth.Contract(LiquidatableQuery.abi as AbiItem[], "", {data: LiquidatableQuery.bytecode}) as unknown) as any,
        "OnChainLiquidator": ( new web3.eth.Contract(OnChainLiquidator.abi as AbiItem[], "", {data: OnChainLiquidator.bytecode}) as unknown) as any,
        /** Uniswap v4 */
        "PoolManager": ( new web3.eth.Contract(PoolManager.abi as AbiItem[], "", {data: PoolManager.bytecode}) as unknown) as any,
        "BasicHook": ( new web3.eth.Contract(BasicHook.abi as AbiItem[], "", {data: BasicHook.bytecode}) as unknown) as any,

        /* ens messages*/
        "MessagesENS": ( new web3.eth.Contract(MessagesENS.abi as AbiItem[], "", {data: MessagesENS.bytecode}) as unknown) as any,

        // uuid connect
        "UUIDConnect": ( new web3.eth.Contract(UUIDConnect.abi as AbiItem[], "", {data: UUIDConnect.bytecode}) as unknown) as any,

        // PublicKeys
        "PublicKeys": ( new web3.eth.Contract(PublicKeys.abi as AbiItem[], "", {data: PublicKeys.bytecode}) as unknown) as any,
        // Call
        "Call": ( new web3.eth.Contract(Call.abi as AbiItem[], "", {data: Call.bytecode}) as unknown) as any,

        // Name
        "Name": ( new web3.eth.Contract(Name.abi as AbiItem[], "", {data: Name.bytecode}) as unknown) as any,

    } as ContractFactoryV2
}
