from flask import Flask, request, jsonify, send_from_directory
from gradio_client import Client
import os

app = Flask(__name__, static_folder="public")

# Connect to your Hugging Face Space
client = Client("https://giomflo81-SmartCrew.hf.space/")

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Predict with all required arguments
        bot_reply = client.predict(
            user_message,
            "You are a helpful assistant",  # system prompt
            512,  # max tokens
            0.7,  # temperature
            0.95,  # top_p
            api_name="/chat"
        )

        return jsonify({'reply': bot_reply})

    except Exception as e:
        print(f"🔥 Error from Hugging Face call: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# Serve frontend files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))
    app.run(host="0.0.0.0", port=port)
