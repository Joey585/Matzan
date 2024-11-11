export interface TimelineResult {
    data: {
        search_by_raw_query: {
            search_timeline: {
                timeline: {
                    instructions: [{
                        type: string,
                        entries: Array<TimelineEntry>
                    }]
                }
            }
        }
    }
}

interface TimelineEntry {
    entryId: string,
    sortIndex: string,
    content: {
        entryType: string,
        __typename: string,
        itemContent?: {
            itemType: string,
            __typename: string,
            tweet_results: {
                result: TweetResult | LimitedTweetResult,
            },
            tweetDisplayType: string
            highlights: {
                textHighlights: Array<TextHighlight>
            }
        },
        clientEventInfo?: {
            component: string,
            element: string,
            details: {
                timelinesDetails: {
                    controllerData: string
                }
            }
        }
    }
}

export interface LimitedTweetResult {
    __typename: string,
    tweet: TweetResult
    limitedActionResults: Array<LimitedActionResult>,

}

interface LimitedActionResult {
    action: string,
    prompt: {
        __typename: string,
        cta_type: string,
        headline: {
            text: string,
            entities: string[]
        },
        subtext: {
            text: string,
            entities: string[]
        }
    }
}

export interface TweetResult {
    __typename: string,
    rest_id: string,
    core: {
        user_results: {
            result: UserResult
        }
    },
    unmention_data: Object,
    views: {
        count: string,
        state: string
    },
    source: string,
    note_tweet?: {
        is_expandable: boolean,
        note_tweet_results: {
            result: NoteTweetResult
        }
    },
    legacy: {
        bookmark_count: number,
        bookmarked: boolean,
        created_at: string,
        conversation_id_str: string,
        display_text_range: Array<number>,
        entities: TweetEntities,
        extended_entities: {
            media: Array<TweetMedia>
        },
        favorite_count: number,
        favorited: boolean,
        full_text: string,
        is_quote_status: boolean,
        lang: string,
        possibly_sensitive?: boolean,
        possibly_sensitive_editable?: boolean,
        quote_count: number,
        reply_count: number,
        retweet_count: number
        retweeted: boolean,
        user_id_str: string,
        id_str: string,
    }
}

interface TweetMedia {
    display_url: string,
    expanded_url: string,
    id_str: string,
    indices: number[],
    media_key: string,
    media_url_https: string,
    type: "video" | "photo",
    additional_media_info?: {
        monetizable: boolean
    }
    ext_media_availability: {
        status: string
    },
    sizes: {
        large: MediaSize,
        medium: MediaSize,
        small: MediaSize,
        thumb: MediaSize,
    },
    original_info: {
        height: number,
        width: number,
        focus_rects: Array<FocusRect> | []
    },
    media_results: {
        result: {
            media_key: string
        }
    }
}

interface FocusRect {
    x: number,
    y: number,
    w: number,
    h: number
}

interface MediaSize {
    h: number,
    w: number,
    resize: string
}

interface TweetEntities {
    hashtags: Array<HashtagTweet> | []
    media?: TweetMedia,
    symbols: Array<any>,
    timestamps: Array<any>,
    urls: Array<TwitterURL> | [],
    user_mentions: Array<any>
}

interface HashtagTweet {
    indices: number[],
    text: string,
}

interface NoteTweetResult {
    id: string,
    text: string,
    entity_set: {
        hashtags: Array<any>,
        symbols: Array<any>,
        urls: Array<any>,
        user_mentions: Array<any>
    },
    richtext?: {
        richtext_tags: Array<any>,
    },
    media?: {
        inline_media: Array<any>
    }
}

interface UserResult {
    __typename: string,
    id: string,
    rest_id: string,
    affiliates_highlighted_label: AffiliatesLabel | null,
    has_graduated_access: boolean,
    is_blue_verified: boolean,
    profile_image_shape: "Circle" | "Square",
    legacy: UserLegacyResult,
    professional?: {
        rest_id: string,
        professional_type: "Creator" | "Business",
        category: Array<ProfessionalCategory> | null,
    },
    super_follow_eligible?: boolean,
}

interface AffiliatesLabel {
    label: {
        url: {
            url: string,
            urlType: string,
        },
        badge: {
            url: string,
        },
        description: string,
        userLabelType: string,
        userLabelDisplayType: string,
    }
}

interface TextHighlight {
    startIndex: number,
    endIndex: number,
}

interface UserLegacyResult {
    following: boolean,
    can_dm: boolean,
    can_media_tag: boolean,
    created_at: string,
    default_profile: boolean,
    default_profile_image: boolean,
    description: string,
    entities: {
        description: {
            urls: Array<TwitterURL> | null,
        },
        url: {
            urls: Array<TwitterURL> | null,
        }
    },
    fast_followers_count: number,
    favourites_count: number,
    followers_count: number,
    friends_count: number,
    has_custom_timelines: boolean,
    is_translator: boolean,
    listed_count: number,
    location: string,
    media_count: number,
    name: string,
    normal_followers_count: number,
    pinned_tweet_ids_str: Array<string> | null,
    possibly_sensitive: boolean,
    profile_banner_url: string,
    profile_image_url_https: string,
    profile_interstitial_type: string,
    screen_name: string,
    statuses_count: number,
    translator_type: string,
    url?: string,
    verified: boolean,
    want_retweets: boolean,
    withheld_in_countries: Array<any>
}

interface TwitterURL {
    display_url: string,
    expanded_url: string,
    url: string,
    indices: number[]
}

interface ProfessionalCategory {
    id: number,
    name: string,
    icon_name: string,
}

export interface ParsedTweetData {
    user: {
        id: string,
        username: string,
        followers: number,
    },
    tweet: {
        id: string,
        textRaw: string,
        likes: number,
        retweets: number,
        views: string
    }
}

export interface TwitterSearchQuery {
    rawQuery: string,
    count: number,
    querySource: string,
    product: "Top" | "Latest" | "People" | "Media" | "Lists"
}

export interface Prediction {
    Urgency?: number,
    Credibility?: number
    error?: string
}