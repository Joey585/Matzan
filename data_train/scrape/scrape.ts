import config from "../config.json"
import axios from "axios"
import {ParsedTweetData, TimelineResult, TweetResult} from "../interfaces";

const getRawTweetSearch = () => new Promise((resolve, reject): Promise<TimelineResult> | null => {
    const variables = generateQuery(2, 10, 50)
    axios.get(`${config.searchTweetsEndpoint}?variables=${variables}&features=${config.searchFeatures}`, {
        headers: {
            "Authorization": "Bearer " + config.bearerToken,
            "Cookie": `auth_token=${config.authToken};ct0=${config.csrfToken}`,
            "X-Csrf-Token": config.csrfToken
        }
    }).catch((err) => {
        console.log(err)
        reject(err)
    }).then((res) => {
        resolve(res?.data)
    })

    return null
});

export async function listOfTweetsRaw(): Promise<Array<ParsedTweetData> | null> {
    const rawData = await getRawTweetSearch();
    if(!rawData) return null;
    const timelineData = rawData as TimelineResult;
    const entries = timelineData.data.search_by_raw_query.search_timeline.timeline.instructions[0].entries;
    let tweetList: Array<ParsedTweetData> = [];

    for (const entry of entries) {
        if(!entry.content.itemContent) {
            continue;
        }
        const result = entry.content.itemContent.tweet_results.result;
        let parsedTweet: TweetResult | null = null;

        if (result.hasOwnProperty("tweet")) {
            if ("tweet" in result) {
                parsedTweet = result.tweet as TweetResult;
            }
        } else {
            parsedTweet = result as TweetResult;
        }

        if(parsedTweet){
            const fullText = parsedTweet.note_tweet ? parsedTweet.note_tweet.note_tweet_results.result.text : parsedTweet.legacy.full_text;

            const tweetObj: ParsedTweetData = {
                tweet: {
                    views: parsedTweet.views.count,
                    id: parsedTweet.legacy.id_str,
                    likes: parsedTweet.legacy.favorite_count,
                    textRaw: fullText,
                    retweets: parsedTweet.legacy.retweet_count
                },
                user: {
                    username: parsedTweet.core.user_results.result.legacy.screen_name,
                    id: parsedTweet.core.user_results.result.id,
                    followers: parsedTweet.core.user_results.result.legacy.followers_count
                }
            }
            tweetList.push(tweetObj);
        }


    }

    return tweetList;
}

function generateQuery(minReplies: number, minLikes: number, count: number): string {
    const today = new Date();
    const formattedDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() -1);

    let basicQuery = `{"rawQuery":"israel (palestine OR breaking) min_replies:${minReplies} min_faves:${minLikes} lang:en since:${formattedDate} -filter:links -filter:replies","count":${count},"querySource":"typed_query","product":"Latest"}`


    return encodeURI(basicQuery).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

export function parseTweetText(rawTweet: string): string {
    const formatRegex = /(https:\/\/\S+)|([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])|(,)/g
    return rawTweet.replaceAll(formatRegex, "").replaceAll(/(\n)/g, " ");
}


