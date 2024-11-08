import {Client} from "discord.js";
import {WebSocket} from "ws";

export async function wsListen(client: Client) {
    const ws = new WebSocket("ws://127.0.0.1:5005/");

    ws.onopen = () => {
        ws.send(JSON.stringify({op: 0, d: {password: "ndF9y57pE??akQ7A"}}));
    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data.toString());
        switch (data.op) {
            case 0:
                setInterval(() => {
                    ws.send(JSON.stringify({op: 1, d: "pong"}))
                }, data.d.heartbeat)
                break;
            case 4:
                console.log(data);
        }
    }
}