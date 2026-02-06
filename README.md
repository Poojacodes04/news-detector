## Run the AI model (Flask prediction API)

This repo includes a small Python/Flask API in `model/app.py` that loads the trained artifacts:

- `model/fake_news_model.pkl`
- `model/tfidf_vectorizer.pkl`

The frontend calls the API at **`http://127.0.0.1:5000/predict`**.

### Prerequisites

- **Node.js + npm** (for the UI) — install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Python 3.10+** (for the model API)

### Start the prediction server

Open a terminal and run:

```sh
cd model

# Create and activate a virtualenv (recommended)
python3 -m venv .venv
source .venv/bin/activate

# Install Python deps
pip install -r requirements.txt

# Run the API (serves http://127.0.0.1:5000)
python app.py
```

### (Optional) Retrain the model

This will retrain from `model/news_data.csv` and overwrite the `.pkl` files:

```sh
cd model
source .venv/bin/activate
python fake-news-detector.py
```

## Run the web app (React/Vite)

In another terminal (project root):

```sh
npm i
npm run dev
```

Then open the Vite URL (usually **`http://localhost:5173`**) and try an investigation. If you see a connection error, confirm the Flask server is running at **`http://127.0.0.1:5000`**.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
