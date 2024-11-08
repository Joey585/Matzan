import gensim.downloader as api
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import Dropout
from sklearn.preprocessing import MinMaxScaler
import joblib

data_dir = "../data/cleansed_data.csv"

df = pd.read_csv(data_dir)
wv = api.load("word2vec-google-news-300")

def get_text_embedding(text):
    words = text.split()
    word_vectors = [wv[word] for word in words if word in wv]
    if len(word_vectors) == 0:
        return np.zeros(wv.vector_size)
    return np.mean(word_vectors, axis=0)

df["TextEmbedding"] = df["ParsedText"].apply(get_text_embedding)

vectorized_df = pd.DataFrame(df["TextEmbedding"].tolist(), index=df.index)

x = pd.concat([df.drop(columns=["TextEmbedding", "ParsedText", "Urgency", "Credibility"]), vectorized_df], axis=1)
y = df[["Urgency", "Credibility"]]

X_train, X_test, y_train, y_test = train_test_split(x.values, y.values, test_size=0.2, random_state=42)

scaler = MinMaxScaler(feature_range=(0,1))
y_train_scaled = scaler.fit_transform(y_train)
y_test_scaled = scaler.transform(y_test)

model = Sequential([
    Dense(256, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.3),
    Dense(128, activation='relu'),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dropout(0.3),
    Dense(2)
])

model.compile(optimizer=Adam(learning_rate=0.0001), loss="mse")

early_stop = EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)

history = model.fit(
    X_train, y_train_scaled,
    epochs=100,
    batch_size=64,
    validation_split=0.2,
    callbacks=[early_stop],
    verbose=1
)

model.save("../models/matzan.keras")
joblib.dump(scaler, "../data/scaler.save")

plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.title('Training and Validation Loss Over Epochs')
plt.savefig("../plots/plot.png")

