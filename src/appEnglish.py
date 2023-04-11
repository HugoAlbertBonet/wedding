from flask import Flask, request
from flask_cors import CORS
import json
import os
import torch
from transformers import pipeline
import subprocess

pipe = pipeline(
  "automatic-speech-recognition",
  model="openai/whisper-small",
  chunk_length_s=5
)
        
def inference(audio):
    result = pipe(audio, return_timestamps=True)["chunks"][0]['text']
    print(result)

app = Flask(__name__)
CORS(app)

@app.route('/audio', methods=['POST', 'OPTIONS'])
def handle_key_data():
    if request.method == 'OPTIONS':
        response = app.response_class(
            status=200,
            mimetype='application/json'
        )
    else:
        input_file = request.files['file'].stream.read()
        with open('recording.webm', 'wb') as f:
            f.write(input_file)
        subprocess.run(["ffmpeg", "-i", "recording.webm", "-ac", "1", "-f", "wav", "my_recording.wav", "-y", "-hide_banner", "-loglevel", "panic"], check=True)
        with open("my_recording.wav", 'rb') as f:
            data = f.read()
        inference(data)
        """content = ''
        for line in data.stream.readlines():
		        content += line.decode("audio/webm;codecs=opus")"""
        #print(f"Received {data['key']} key {'down' if data['isPressed'] else 'up'} event")
        response = app.response_class(
            status=200,
            mimetype='application/json'
        )
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
         
        
    return response


if __name__ == '__main__':
    app.run(port=5050, debug=True)