import BN from "bn.js"

export interface TruffleContract{
    new : any;
    address: string;
    at(address: string) : any;
    deployed() : any,
    transactionHash: string,
    link(instance: any): any
    link(name: string, address: string): any
    link(object: any): any;
    networks(): any;
    setProvider(provider: any): void;
    setNetwork(network_id: number): void;
    setWallet(wallet: any): void;
    hasNetwork(network_id: number): boolean;
    defaults(new_defaults: Array<any>): any;
    clone(network_id: number): any;
    numberFormat(): BN;
    timeout(block_timeout: number) : void;
    autoGas: boolean,
    gasMultiplier(gas_multiplier: number) : void
}