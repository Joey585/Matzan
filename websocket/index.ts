import axios from "axios";
import config from "./config.json";
import {AlarmCurrent, WebsocketAlarm} from "./interfaces/Alarm"
import {authWS} from "./classes/MatzanWS";
import {runWebsocketServer} from "./websocket";
import {HttpsProxyAgent} from "https-proxy-agent";

export let currentAlerts: Array<WebsocketAlarm> = [];

runWebsocketServer();
process.title = "Websocket Server";

const agent = new HttpsProxyAgent(`http://${config.proxy.username}:${config.proxy.password}@${config.proxy.ip}:3128`)

const alertPolling = setInterval(async () => {
    const result: AlarmCurrent | null = (await axios.get("https://www.oref.org.il/warningMessages/alert/Alerts.json", {
        httpsAgent: agent
    })).data;

    if(!result) {
        console.log("Couldn't access website");
        return;
    }

    if(!result.data) return;

    console.log(result)

    if(currentAlerts.length === 0) return currentAlerts.push({...result, time: Date.now()})
    console.log("There are active alerts")
    if(Date.now() - currentAlerts[currentAlerts.length -1].time < 30 * 1000){
        //Alerts exist in the past 30 seconds
        console.log("Alerts exist in the past 30 seconds")
        for (const alert of currentAlerts){
            console.log(alert.data + " compared with " + result.data)
            console.log(alert.data !== result.data)
            if(alert.cat === result.cat && alert.data !== result.data){
                console.log("The same category alert exists and the new alert has different zones")
                const zoneSet = new Set(result.data);
                console.log("All of the new alert's zones: \n" + zoneSet)
                alert.data.filter(zone => !zoneSet.has(zone)).forEach((zone) => alert.data.push(zone))
                console.log("Adding new zones")
            } else if (alert.cat !== result.cat){
                console.log("Adding new category of alert")
                currentAlerts.push({...result, time: Date.now()})
            }
        }
    } else {
        console.log("Alerts expired, adding fresh new one")
        currentAlerts = [];
        currentAlerts.push({...result, time: Date.now()})
    }

    authWS.forEach((ws) => {
        ws.broadcast(4, currentAlerts)
    })

}, 5000)