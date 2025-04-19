from flask import Flask, request, jsonify, send_from_directory
from gradio_client import Client
from flask_cors import CORS  # <-- NEW
import os

app = Flask(__name__, static_folder="public")
CORS(app)  # <-- NEW (Enable CORS so frontend JS can connect)

# Connect to your Hugging Face Space
client = Client("https://giomflo81-SmartCrew.hf.space/")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Communicate with Hugging Face model
        bot_reply = client.predict(user_message, api_name="/chat")
        return jsonify({'reply': bot_reply})
    except Exception as e:
        print(f"Error communicating with Hugging Face: {e}")
        return jsonify({'error': 'Chatbot service is temporarily unavailable. Please try again later.'}), 503

# Serve your frontend static files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))
    app.run(host="0.0.0.0", port=port)
