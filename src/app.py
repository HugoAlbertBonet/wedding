from flask import Flask, request, json
from flask_cors import CORS
import whisper
#from transformers import pipeline, WhisperProcessor,WhisperForConditionalGeneration
import subprocess
#from scipy.io.wavfile import read as read_wav
from transformers import AutoTokenizer, AutoModel #,AutoModelForTokenClassification,AutoModelForSequenceClassification,T5Tokenizer, T5ForConditionalGeneration, TrainingArguments, AdamW
import torch
import torch.nn.functional as F
from sklearn.metrics.pairwise import cosine_similarity
#from sentence_transformers import SentenceTransformer

finished = False
discurso = """Hyperloop UPV es un equipo universitario que se dedica a desarrollar el quinto medio de transporte.
Este transporte se desplaza levitando por un tubo de vacío, por lo que se ahorra el rozamiento con el aire y con la superficie.
Cada año participamos en una competición universitaria, siendo el primer año en Valencia y el segundo en Delft.
Este último año fuimos el equipo más premiado de toda la competición, y el primero en levitar en vacío.
Este año hemos conseguido ya más de 80 patrocinadores y tenemos un presupuesto líquido estimado de 82000 euros.
Si conseguimos cubrir todo el presupuesto, iremos a por el objetivo 100 de 100."""

frases = discurso.split('\n')
model = whisper.load_model("base")

tokenizerMiniLM = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
modelMiniLM = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
contador = 0

def transcribe(audio):
    
    # load audio and pad/trim it to fit 30 seconds
    audio = whisper.load_audio(audio)
    audio = whisper.pad_or_trim(audio)

    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    # detect the spoken language
    _, probs = model.detect_language(mel)
    #print(f"Detected language: {max(probs, key=probs.get)}")

    # decode the audio
    options = whisper.DecodingOptions(fp16 = False, language="es")
    result = whisper.decode(model, mel, options)
    return result.text

def mean_pooling( model_output, attention_mask):
      """This method performs a mean pooling operation on the output of a language model.
      It takes as input the output of the model (which should contain embeddings for each token in the input sequence)
      and an attention mask indicating which tokens should be attended to. It returns the mean of the embeddings of the
      unmasked tokens in the input sequence."""

      # Extract token embeddings from the model output
      token_embeddings = model_output[0] #First element of model_output contains all token embeddings

      # Expand the attention mask tensor to have the same shape as the token embeddings tensor,
      # to enable element-wise multiplication with the embeddings tensor
      input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()

      # Compute the sum of the element-wise product of the embeddings tensor and the expanded attention mask tensor
      # along the second dimension (i.e., the tokens dimension), to zero out the embeddings corresponding to masked tokens.
      # Then divide the result by the sum of the expanded attention mask tensor along the second dimension, to get
      # the mean of the embeddings of the unmasked tokens in the input sequence.
      return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

def sentence_similarity(lista):
    encoded_input = tokenizerMiniLM(lista, padding=True, truncation=True, return_tensors='pt')

    # Compute token embeddings
    with torch.no_grad():
        model_output = modelMiniLM(**encoded_input)

    # Perform pooling
    sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

    # Normalize embeddings
    sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)

    cos = cosine_similarity(sentence_embeddings[0].reshape(1, -1), sentence_embeddings[1].reshape(1, -1))
    return (1, cos) if cos > 0.5 else (0,cos)

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
        global contador
        global finished
        input_file = request.files['file'].stream.read()
        with open('recording.webm', 'wb') as f:
            f.write(input_file)
        subprocess.run(["ffmpeg", "-i", "recording.webm", "-ac", "1", "-f", "wav","-ar", "16000", "my_recording.wav", "-y", "-hide_banner", "-loglevel", "panic"], check=True)
        #sampling_rate, data=read_wav("my_recording.wav")
        frase = transcribe("my_recording.wav")
        suma, cos = sentence_similarity([frase, frases[contador][-40:]])
        print(frase)
        print(frases[contador][-40:],suma, cos)
        contador += suma
        if contador >= len(frases):
            finished = True
            contador = -1
        #print(f"Received {data['key']} key {'down' if data['isPressed'] else 'up'} event")
        response = app.response_class(
            status=200,
            mimetype='application/json',
            response=json.dumps({"position" : contador})
        )
        if contador == -1:
            contador = 0
        #response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        #print(response)
        
    return response

@app.route('/line', methods=['GET', 'OPTIONS'])
def followSpeech():
    if request.method == 'OPTIONS':
        response = app.response_class(
            status=200,
            mimetype='application/json'
        )
    else:
        global contador
        global finished
        if finished:
            contador = -1
        response = app.response_class(
            status=200,
            mimetype='application/json',
            response=json.dumps({"position" : contador})
        )
        #response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        #print(response)
        if contador == -1:
            contador = 0
            finished = False
    return response


if __name__ == '__main__':
    app.run(port=5050, debug=True)