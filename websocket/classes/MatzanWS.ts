import {EventEmitter} from "node:events";
import {WebSocket} from "ws";
import {generateRandomString} from "../utils/Random";

export let authWS: Map<WebSocket, MatzanWS> = new Map


export class MatzanWS extends EventEmitter {
    private ws: WebSocket;
    public heartbeatInter: number;
    public heartbeatRequired: boolean;
    public lastHeartbeat: number;

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;
        this.heartbeatInter = 0;
        this.heartbeatRequired = false;
        this.lastHeartbeat = 0;
    }

    authenticate(heartbeat: number){
        this.heartbeatInter = heartbeat;
        this.lastHeartbeat = Date.now();
        this.emit("authenticated", heartbeat);
    }

    ping(){
        this.ws.send(JSON.stringify({op: 1, d: "ping"}))
        this.heartbeatRequired = true;
    }

    heartbeat(date: number){
        this.heartbeatRequired = false;
        this.lastHeartbeat = date;
    }

    kill(reason: string){
        authWS.delete(this.ws);
        this.ws.close(3008, reason);
    }

    broadcast(op: number, d: any){
        this.ws.send(JSON.stringify({op, d}))
    }

}