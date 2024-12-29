export interface Providers{
    [provider: string] : Provider;
}

export interface Provider{
    url: string;
    chain_id: number;
    asset: string;
}

import prvdrs from "./Providers.json" assert {"type" : "json"};

export const providers : Providers = prvdrs;

 /*"wss://rpc-mainnet.maticvigil.com/ws/v1/857bd788405149815e9bed09e4e0ef2b41777537",*/
