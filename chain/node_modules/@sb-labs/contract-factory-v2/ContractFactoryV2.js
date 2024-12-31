import NFT_Register from "../web3-data/contracts/NFT_Register.json" assert { "type": "json" };
// Dapp
import UserRegister from "../web3-data/contracts/UserRegister.json" assert { "type": "json" };
import Messages from "../web3-data/contracts/Messages.json" assert { "type": "json" };
import Feed from "../web3-data/contracts/Feed.json" assert { "type": "json" };
import FeedViewer from "../web3-data/contracts/FeedViewer.json" assert { "type": "json" };
import CryptoRicks from "../web3-data/contracts/CryptoRicks.json" assert { "type": "json" };
import VRFHelper from "../web3-data/contracts/VRFHelper.json" assert { "type": "json" };
import Shop from "../web3-data/contracts/Shop.json" assert { "type": "json" };
import MockUSDC from "../web3-data/contracts/MockUSDC.json" assert { "type": "json" };
import StevesTees from "../web3-data/contracts/StevesTees.json" assert { "type": "json" };
import AgeUpdater from "../web3-data/contracts/AgeUpdater.json" assert { "type": "json" };
import UserAgeManager from "../web3-data/contracts/UserAgeManager.json" assert { "type": "json" };
import TransparentUpgradableProxy from "../web3-data/contracts/TransparentUpgradeableProxy.json" assert { "type": "json" };
import CometInterface from "../web3-data/contracts/CometInterface.json" assert { "type": "json" };
import LiquidatableQuery from "../web3-data/contracts/LiquidatableQuery.json" assert { "type": "json" };
import OnChainLiquidator from "../web3-data/contracts/OnChainLiquidator.json" assert { "type": "json" };
import PoolManager from "../web3-data/contracts/PoolManager.json" assert { "type": "json" };
import MockAsset from "../web3-data/contracts/MockAsset.json" assert { "type": "json" };
import BasicHook from "../web3-data/contracts/BasicHook.json" assert { "type": "json" };
import MessagesENS from "../web3-data/contracts/MessagesENS.json" assert { "type": "json" };
import UUIDConnect from "../web3-data/contracts/UUIDConnect.json" assert { "type": "json" };
import PublicKeys from "../web3-data/contracts/PublicKeys.json" assert { "type": "json" };
import Call from "../web3-data/contracts/Call.json" assert { "type": "json" };
import Name from "../web3-data/contracts/Name.json" assert { "type": "json" };
export const contractFactoryV2 = (web3) => {
    return {
        "NFT_Register": new web3.eth.Contract(NFT_Register.abi, "", { data: NFT_Register.bytecode }),
        "UserRegister": new web3.eth.Contract(UserRegister.abi, "", { data: UserRegister.bytecode }),
        "Messages": new web3.eth.Contract(Messages.abi, "", { data: Messages.bytecode }),
        "Feed": new web3.eth.Contract(Feed.abi, "", { data: Feed.bytecode }),
        "FeedViewer": new web3.eth.Contract(FeedViewer.abi, "", { data: FeedViewer.bytecode }),
        "CryptoRicks": new web3.eth.Contract(CryptoRicks.abi, "", { data: CryptoRicks.bytecode }),
        "VRFHelper": new web3.eth.Contract(VRFHelper.abi, "", { data: VRFHelper.bytecode }),
        "Shop": new web3.eth.Contract(Shop.abi, "", { data: Shop.bytecode }),
        "MockUSDC": new web3.eth.Contract(MockUSDC.abi, "", { data: MockUSDC.bytecode }),
        "StevesTees": new web3.eth.Contract(StevesTees.abi, "", { data: StevesTees.bytecode }),
        "AgeUpdater": new web3.eth.Contract(AgeUpdater.abi, "", { data: AgeUpdater.bytecode }),
        "UserAgeManager": new web3.eth.Contract(UserAgeManager.abi, "", { data: UserAgeManager.bytecode }),
        "MockAsset": new web3.eth.Contract(MockAsset.abi, "", { data: MockAsset.bytecode }),
        "TransparentUpgradableProxy": new web3.eth.Contract(TransparentUpgradableProxy.abi, "", { data: TransparentUpgradableProxy.bytecode }),
        "CometInterface": new web3.eth.Contract(CometInterface.abi, "", { data: CometInterface.bytecode }),
        "LiquidatableQuery": new web3.eth.Contract(LiquidatableQuery.abi, "", { data: LiquidatableQuery.bytecode }),
        "OnChainLiquidator": new web3.eth.Contract(OnChainLiquidator.abi, "", { data: OnChainLiquidator.bytecode }),
        /** Uniswap v4 */
        "PoolManager": new web3.eth.Contract(PoolManager.abi, "", { data: PoolManager.bytecode }),
        "BasicHook": new web3.eth.Contract(BasicHook.abi, "", { data: BasicHook.bytecode }),
        /* ens messages*/
        "MessagesENS": new web3.eth.Contract(MessagesENS.abi, "", { data: MessagesENS.bytecode }),
        // uuid connect
        "UUIDConnect": new web3.eth.Contract(UUIDConnect.abi, "", { data: UUIDConnect.bytecode }),
        // PublicKeys
        "PublicKeys": new web3.eth.Contract(PublicKeys.abi, "", { data: PublicKeys.bytecode }),
        // Call
        "Call": new web3.eth.Contract(Call.abi, "", { data: Call.bytecode }),
        // Name
        "Name": new web3.eth.Contract(Name.abi, "", { data: Name.bytecode }),
    };
};
