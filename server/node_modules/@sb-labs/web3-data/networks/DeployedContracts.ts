export interface DeployedContracts{
    [network: string] : ContractAddresses;
}

export interface ContractAddresses{
    [contract: string] : ContractAt;
}

export interface ContractAt{
    address: string;
    block: number;
}

import deployedContracts from "./DeployedContracts.json" assert {"type": "json"};

export const deployed : DeployedContracts = deployedContracts;