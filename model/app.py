from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)   # 👈 THIS IS CRITICAL

model = joblib.load("fake_news_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    headline = data["headline"]

    vector = vectorizer.transform([headline])
    prediction = model.predict(vector)[0]
    probability = model.predict_proba(vector).max()

    return jsonify({
        "label": "Fake" if prediction == 1 else "Real",
        "confidence": round(float(probability), 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
