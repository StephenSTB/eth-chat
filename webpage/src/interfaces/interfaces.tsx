export interface idchain{
    [chain: string]: string
}

export const chains = {
    "1337": "Ganache",
    "8545": "Base",
    "11155111" : "Sepolia"
} as idchain

export interface UnreadMessage{
    avatar: string;
    name: string;
    follow: boolean
    unread: number
}

export interface Message{
    sender: string;
    value: number;
    message: string;
    image: string;
    iv : string;
    ephemPublicKey: string;
    ciphertext: string;
    mac: string;
}

