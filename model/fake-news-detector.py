import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
import joblib

# reading dataset from csv file
df = pd.read_csv("news_data.csv")

# converting text into numbers
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    max_features=500
)

X = vectorizer.fit_transform(df["headline"])
y = df["label"]

# splitting training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# training the model
model = MultinomialNB()
model.fit(X_train, y_train)

# accuracy score
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Model Accuracy:", accuracy)

# demo (checking with unseen headline)
def predict_news(headline):
    vector = vectorizer.transform([headline])
    prediction = model.predict(vector)[0]
    probability = model.predict_proba(vector).max()

    if prediction == 1:
        return f"Fake News (Confidence: {probability:.2f})"
    else:
        return f"Real News (Confidence: {probability:.2f})"


print(predict_news("Scientists warn about new virus outbreak"))
print(predict_news("Supreme Court hears case on data privacy laws"))

# saving model and vectorizer in files
joblib.dump(model, "fake_news_model.pkl")
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")
