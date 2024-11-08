import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

whichData = "Retweets"

data_dir = "C:/Users/joey5/OneDrive/Documents/Projects/Matzan/data_train/tweets.csv"

df = pd.read_csv(data_dir)
df["RetweetsLog"] = np.log1p(df["Retweets"])

plt.hist(df["RetweetsLog"], bins=30, edgecolor='black')
plt.title("Histogram of " + whichData)
plt.xlabel(whichData)
plt.ylabel("Frequency")
plt.show()
