const peer = require("peerjs")
const uuidV4 = require("uuid")
console.log()

const uuid1  = uuidV4.v4()
const uuid2  = uuidV4.v4()

console.log(uuid1)

const p1 = new peer.Peer(uuid1,  {config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    
  ]} /* Sample servers, please use appropriate ones */});
const p2 = new peer.Peer(uuid2, {config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    
  ]} /* Sample servers, please use appropriate ones */})

let con = p1.connect(uuid2)

new Peer(id, {config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    
  ]} /* Sample servers, please use appropriate ones */})
