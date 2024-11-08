import config from "../config.json";
import {WebsocketMessage} from "../interfaces/Websocket";
import {authWS, MatzanWS} from "../classes/MatzanWS";
import {WebSocket} from "ws";

/* Operation Codes (client-->server):
0: authenticate
1: heartbeat
 */

/* Operation Codes (server-->client):
0: authentication successful
1: requesting ping
2: received ping
3: Welcome
 */

export function parseOp(op: number, d: any, ws: WebSocket): WebsocketMessage {
    switch (op){
        case 0:
            const heartbeat = Math.floor(Math.random() * 10000) + 2000
            // in between 2 seconds and 10 seconds

            if(d.password === config.wsPassword){
                const authMatzan = new MatzanWS(ws);
                authWS.set(ws, authMatzan);
                authMatzan.authenticate(heartbeat);
                setInterval(() => {
                    authMatzan.ping();
                }, heartbeat)

                return {op: 0, d: {heartbeat}};
            }

            return {op: 9, err: "No authentication"};
        case 1:
            const authMatzan = authWS.get(ws);
            if(!authMatzan) return {op: 9, err: "Not Authed"}
            if(!authMatzan.heartbeatRequired) return {op: 9, err: "You don't need to ping"}
            authMatzan.heartbeat(Date.now());
            return {op: 2, d: "thank you"}
        default:
            return {op: 9, err: "Something went wrong"}


    }
}