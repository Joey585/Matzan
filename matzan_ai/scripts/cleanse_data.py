import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def cleanse_df(df):
    lemmatizer = WordNetLemmatizer()

    nltk.download("wordnet")
    nltk.download('stopwords')
    stop = stopwords.words('english')

    df["FollowersLog"] = np.log1p(df["Followers"].astype(int))
    df["LikesLog"] = np.log1p(df["Likes"].astype(int))
    df["RetweetsLog"] = np.log1p(df["Retweets"].astype(int))

    df["ParsedText"] = df["Text"].str.lower()
    df["ParsedText"] = df["ParsedText"].str.replace(r'http\S+|www.\S+', '', regex=True)
    df["ParsedText"] = df["ParsedText"].str.replace(r'@\w+|#\w+', '', regex=True)
    df["ParsedText"] = df["ParsedText"].str.replace(r'[^\w\s]', ' ', regex=True)
    df["ParsedText"] = df["ParsedText"].str.strip()
    df["ParsedText"] = df["ParsedText"].str.replace(r'\s+', ' ', regex=True)
    df["ParsedText"] = df["ParsedText"].str.replace(r'[^\x00-\x7F]+', '', regex=True)
    df["ParsedText"] = df["ParsedText"].apply(lambda x: " ".join([word for word in x.split() if word not in stop]))
    df["ParsedText"] = df["ParsedText"].apply(lambda x: " ".join([lemmatizer.lemmatize(word) for word in x.split()]))


    new_df = df[["ParsedText", "FollowersLog", "LikesLog", "RetweetsLog", "Urgency", "Credibility"]]
    return new_df