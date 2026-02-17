
import {WebSocket, WebSocketServer} from 'ws'

const sendJson=(socket,payload)=>{
    if(socket.readyState!==WebSocket.OPEN) return;

    try {
        socket.send(JSON.stringify(payload));
    } catch (err) {
        console.error('Failed to send WebSocket message:', err);
    }
}

const broadcast= (wss,payload)=>{
    for(const client of wss.clients){
        if(client.readyState!==WebSocket.OPEN) continue;
        client.send(JSON.stringify(payload));
    }
}


export const attachWebSocketServer = (server)=>{
    const wss = new WebSocketServer({
        server,
        path:"/ws",
        maxPayload:1024*1024,
    });

    wss.on("connection",(socket)=>{
        sendJson(socket,{type:"Welcome"});

        socket.on("error",console.error);
    });

    function broadcastMatchCreated(match){
        broadcast(wss,{type:"match_created", data:match})
    }

    return {broadcastMatchCreated}
}