import {Client, EmbedBuilder, GatewayIntentBits} from "discord.js";
import config from "./config.json";
import {listOfTweetsRaw, parseTweetText} from "./scrape/scrape";
import fs from "fs"
import * as mongoose from "mongoose";
import {DataModel} from "./schema/data";
import axios from "axios";
import {Prediction} from "./interfaces";

process.title = "Data Training";

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

client.on("ready", () => {
    console.log(client.user?.username + " is ready!");
});

client.on("messageCreate", async (message) => {
    if(message.content === "test"){
        const listTweets = await listOfTweetsRaw();
        if(!listTweets) return message.reply({content: "Could not generate tweets!"})
        let i = 0;

        for (const randomTweet of listTweets){
            if(await DataModel.findOne({id: randomTweet.tweet.id})) continue;
            const parsedText = parseTweetText(randomTweet.tweet.textRaw)

            const prediction: Prediction = (await axios.post("http://localhost:5000/predict", {
                text: parsedText,
                followers: randomTweet.user.followers,
                likes: randomTweet.tweet.likes,
                retweets: randomTweet.tweet.retweets
            })).data;

            const tweetEmbed = new EmbedBuilder()
                .setTitle("Provide Tweet Scores")
                .setDescription(parsedText)
                .addFields([
                    {name: "Views", value: randomTweet.tweet.views},
                    {name: "Likes", value: randomTweet.tweet.likes.toString()},
                    {name: "User's Followers", value: randomTweet.user.followers.toString(), inline: true},
                    {name: "Retweets", value: randomTweet.tweet.retweets.toString(), inline: true},
                ])
                .setFooter({text: `${prediction.error ? prediction.error : "ML Prediction: " + prediction.Urgency + "," + prediction.Credibility}`})

            const askMessage = await message.reply({content: "Provide your tweet scores with the following syntax:\n`urgency,credibility`\n**Say \"stop\" to end**\n", embeds: [tweetEmbed]})

            const tweetScore = (await message.channel.awaitMessages({filter: (msg) => msg.author.id === message.author.id, max: 1})).first()
            if(!tweetScore) return message.reply({content: "You did not send an answer!"});
            if(tweetScore.content === "stop") {
                askMessage.delete();tweetScore.delete();message.delete();
                break;
            }
            const [urgencyScore, credScore] = tweetScore?.content.split(',').map(Number)
            fs.appendFileSync("./tweets.csv", `${randomTweet.user.username},${parsedText},${randomTweet.user.followers},${randomTweet.tweet.likes},${randomTweet.tweet.retweets},${urgencyScore},${credScore}\n`)
            await askMessage.delete();
            await tweetScore.delete();
            const newData = new DataModel({id: randomTweet.tweet.id, text: parsedText, userID: randomTweet.user.id});
            await newData.save();
            i++;
        }
        message.channel.send(`You have finished the list of data!\n**You completed \`${i}\` out of \`${listTweets.length}\` tweets**`)
    }
});

async function main() {
    await mongoose.connect(config.mongoDB);
    console.log("Connected to the database!");
}

main().catch(err => console.log(err));


client.login(config.botToken)