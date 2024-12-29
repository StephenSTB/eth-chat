import ipfsConnect from './IpfsConnect.json' assert {"type" : "json"};
import { create } from 'ipfs';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { MemoryDatastore } from 'datastore-core'
import { MemoryBlockstore} from 'blockstore-core'
import { kadDHT } from '@libp2p/kad-dht'
import { bootstrap } from '@libp2p/bootstrap'
import { createHelia} from 'helia';

export const IpfsWebRTC = async (webrtc_star: string) =>{
    console.time('IPFS Started')
    let ipfs = await create({
								repo: "ipfs-browser-" + Math.random(),
								config: {
									Addresses: {
									Swarm: [
										'/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
										'/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
										webrtc_star
										]
									},
								},
								start: true,
								libp2p: {
									transports: [
										webSockets({
											filter: filters.dnsWss
										})
									]
								}
                            })
    console.timeEnd('IPFS Started')
    return ipfs;
}

const blockstore = new MemoryBlockstore();

const datastore = new MemoryDatastore();

const config_production = {
	datastore,
	transports:[
		webSockets({filter: filters.all})
	],
	connectionEncryption: [
		noise()
	],
	streamMuxers: [
		yamux(),
	],
	dht: kadDHT(),
	peerDiscovery : [
		bootstrap({
			list: [
				"/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
				"/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
				"/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
				"/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
				"/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
				"/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic",
				"/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6",
				"/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS",
				"/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN",
			]
		})
	]
}

const config_test = {
	datastore,
	transports:[
		webSockets({filter: filters.all})
	],
	connectionEncryption: [
		noise()
	],
	streamMuxers: [
		yamux(),
	],
}

export interface HeliaIPFS{
	node: any,
	fs: any
}

export const createHeliaIPFS = async (test : boolean) : Promise<HeliaIPFS> =>{
	const libp2p = await createLibp2p(test ? config_test : config_production )
	const node = await createHelia({});
	//const fs = unixfs(node);
	return { node } as HeliaIPFS
}

export { ipfsConnect}