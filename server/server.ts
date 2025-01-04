import express from "express"
import {ExpressPeerServer} from "peer"
import http from "http";

// Express app creatiion
const app = express();

const port = 3001;
const  httpServer = http.createServer(app)

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });

const peerServer = ExpressPeerServer(httpServer, {
    path: "/eth-chat",
});

peerServer.on('connection', (client) => {console.log(`Client Connected: ${client.getId()}`)});
peerServer.on('disconnect', (client) => {console.log(`Client Disconnected: ${client.getId()}`)});

app.use("/", peerServer);