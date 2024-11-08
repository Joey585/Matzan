import {Client, GatewayIntentBits} from "discord.js";
import {wsListen} from "./wsListen";
import config from "./config.json"

process.title = "Discord Bot";

const client = new Client({
    intents: [
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
});

client.on("ready", async () => {
    console.log(client.user?.username + " is ready!");
    await wsListen(client)
});

client.login(config.discordToken)