# Run this colab file for running the story generation model
# https://colab.research.google.com/drive/1gqNKDzQKkUffBQ8QB7xV6VBe_383Au3j?usp=sharing#scrollTo=Q8adTgBHWRZw

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import io
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Optionally, restrict to specific origins like this:
# CORS(app, origins=["http://localhost:5173"])

API_URL = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image"
headers = {"Authorization": "API_KEY"}

def query(prompt):
    response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

@app.route('/generate-images', methods=['POST'])
def generate_images():
    try:
        # Get 'prompts' from request JSON
        prompts = request.json.get('prompts', [])
        print("Received prompts:", prompts)
        if not prompts:
            return jsonify({"error": "No prompts provided"}), 400
        
        images = []
        for prompt in prompts:
            count=count+1
            image_bytes = query(prompt)
            image = Image.open(io.BytesIO(image_bytes))
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
            images.append(image_base64)
        print()
        return jsonify({"images": images})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
