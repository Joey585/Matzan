import WebSocket, {WebSocketServer} from "ws"
import {WebsocketMessage} from "./interfaces/Websocket";
import {parseOp} from "./utils/ParseWebsocket";
import {authWS} from "./classes/MatzanWS";

export function runWebsocketServer(): void {
    const wss = new WebSocketServer({
        port: 5005
    });

    wss.on("connection", (ws: WebSocket) => {
        ws.send(JSON.stringify({op: 3, d: "Please send authentication data"}));

        ws.on("message", data => {
            const parsedData: WebsocketMessage = JSON.parse(data.toString());
            if(!parsedData) return ws.send(JSON.stringify({op: 9, err: "not a valid message"}));

            const wsResponse: WebsocketMessage = parseOp(parsedData.op, parsedData.d, ws);
            ws.send(JSON.stringify(wsResponse));
        });

        ws.on("close", () => {
            const authedWS = authWS.get(ws);
            if(!authedWS) return;
            authedWS.kill("close");
        })
    });

    setInterval(() => {
        authWS.forEach((ws) => {
            if(ws.heartbeatRequired && (Date.now() - ws.lastHeartbeat ) > 900){
                ws.kill("Did not pong in time");
            }
        })
    }, 1000)
}

