import os
import subprocess
import sys
import joblib
from tensorflow.keras.models import load_model
from cleanse_data import cleanse_df
from vectorize import get_text_embedding
import pandas as pd
from flask import Blueprint, request, jsonify

columns = ["Text", "Followers", "Likes", "Retweets", "Urgency", "Credibility"]
model = load_model("../models/matzan.keras")

matzan_blueprint = Blueprint('matzan_blueprint', __name__)

@matzan_blueprint.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        text = data["text"]
        followers = data["followers"]
        likes = data["likes"]
        retweets = data["retweets"]

        data_df = [[text, followers, likes, retweets, 0, 0]]
        raw_df = pd.DataFrame(data=data_df, columns=columns)
        print(raw_df)
        cleansed_df = cleanse_df(raw_df)
        cleansed_df["TextEmbedding"] = cleansed_df["ParsedText"].apply(get_text_embedding)
        vectorized_test_df = pd.DataFrame(cleansed_df["TextEmbedding"].tolist(), index=cleansed_df.index)
        x_test = pd.concat([cleansed_df[["FollowersLog", "LikesLog", "RetweetsLog"]], vectorized_test_df], axis=1).values

        predictions = model.predict(x_test)

        scaler = joblib.load("../data/scaler.save")

        y_pred = scaler.inverse_transform(predictions)

        response = {
            "Urgency": 0,
            "Credibility": 0
        }

        for i, pred in enumerate(y_pred):
            print(f"Sample {i + 1}: Predicted Urgency = {pred[0]}, Predicted Credibility = {pred[1]}")
            response = {
                "Urgency": int(round(pred[0])),
                "Credibility": int(round(pred[1])),
            }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@matzan_blueprint.route("/train", methods=["PUT"])
def train():
    try:
        cleansed_data = cleanse_df(pd.read_csv("../../data_train/tweets.csv"))
        cleansed_data.to_csv("../data/cleansed_data.csv", index=False)
        subprocess.run(["python", "vectorize.py"])
        os.execv(sys.executable, ["python", "main.py"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500





