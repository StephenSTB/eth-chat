// Blockchain
/*
import { MerkleTree } from 'merkletreejs'
import {v4 as uuidV4} from "uuid"
import {Peer} from "peerjs";*/


let god = 1_000_000_000_000_000; // gazilion

interface Block{
    id: number;
    timestamp: number;
    data_root: string;
    god_root: string;
    transactions: Transaction;
    coinbase: Coinbase;
    hash: string
}

interface Coinbase{
    client: Client;
    god: 10;
}

interface ValueTransaction{
    client1: Client;
    client2: Client;
    value: number;

}

interface DataTransactionCrossVerification{
    Transactions: Transaction[];
    signer: string;
    signature: string;
}

interface Transaction{
    client1: Client;
    client2: Client;
    method: string; // has sytax name(type arg1, type arg2, type arg3, {...}) // text, video, audio, value 
    /*
    * valid method strings to be verified 
            data({"",""}:client, {"",""}:client, "":string) send string text
            sith("":number)
           
    */
    execute: string; // has syntax name(arg1, arg2, arg3, {...}){ text = ""; video="", audio="", value=0}
    sith: number;
    signature: string;
}

interface Client{
    address: string;
    uuid: string;
    signer: string;
}

/*
const uuid1 =  uuidV4()
const uuid2 = uuidV4()
console.log(uuid1)
const peer1 = new Peer(uuid1, {config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    
  ]} /* Sample servers, please use appropriate ones */
/*});
const peer2 = new Peer(uuid2);

console.log(peer1.id)

console.log(peer1.connect(peer2.id))

const testing = async () =>{

}
testing()*/

// call peer 2 answer call peer 1 answer

/*
con.on('open', function(){
    //const block = {timestamp: 0, id: 0, data_root: "",  } as Block
    con.send("msg")
})

/*
peer1.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });*/

// disconnect


// account falcon
/*
while(true){
    // peerjs get transaction
    // transaction cross verification
    // add to block
    // validate block time
    // add to chains / data / transaction
    process.exit(0)
}*/

// transaction chat video sith

