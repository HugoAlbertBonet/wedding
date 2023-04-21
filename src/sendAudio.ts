var recording = false;
var position = 0;
var mediaRecorder:MediaRecorder;
var chunks:Array<Blob> = [];
//var parrafoResult:HTMLParagraphElement;
var discurso = new Array("Hyperloop UPV es un equipo universitario que se dedica a desarrollar el quinto medio de transporte.",
"Este transporte se desplaza levitando por un tubo de vacío, por lo que se ahorra el rozamiento con el aire y con la superficie.",
"Cada año participamos en una competición universitaria, siendo el primer año en Valencia y el segundo en Delft.",
"Este último año fuimos el equipo más premiado de toda la competición, y el primero en levitar en vacío.",
"Este año hemos conseguido ya más de 80 patrocinadores y tenemos un presupuesto líquido estimado de 82000 euros.",
"Si conseguimos cubrir todo el presupuesto, iremos a por el objetivo 100 de 100"); 



export function selectSpeech(parrafo: HTMLParagraphElement){
  parrafo
  parrafo.innerHTML = discurso.join("<br/>")
}

export function startRecording(botonstart: HTMLButtonElement) {
  let value = botonstart.innerHTML;
  const setValue = (text: string) => {
    value = text;
    botonstart.innerHTML = value;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      recording = true;
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", event => {
        if (recording){
        chunks.push(event.data);
        console.log(chunks);
        if (chunks.length > 0) {
          sendData(botonstart);
        }}
      });
      recordAudioChunk(stream);
    });
  }
  botonstart.addEventListener('click', () => setValue('Recording...'))
}

function recordAudioChunk(stream:MediaStream){
  mediaRecorder.start();

  setTimeout(function() {
    if(mediaRecorder.state == "recording")
      mediaRecorder.stop();

      recordAudioChunk(stream);
  }, 3000); // 3 seconds audios
}

function sendData(botonstart: HTMLButtonElement) {
  //This line checks if the recording flag is false. If so, it returns from the function, because there is no data to send.
  if (!recording) {
      return;
  }

  //This line creates a Blob object from the chunks array, which contains the audio data that has been recorded 
  //since the last time data was sent to the backend.
  let blob = new Blob(chunks, {type : 'audio/webm;codecs=opus'});
  console.log(blob)
  //This line creates a new FormData object and appends the Blob object to it. 
  //The append() method takes three arguments: the field name ("audio"), the Blob object, and the filename ("recording.webm").
  let formData = new FormData();
  formData.append("file", blob, "recording.webm");
  
  //This line sends the FormData object to the /api/increment endpoint of the backend server using the fetch() method. 
  //The fetch() method returns a promise that resolves to the server's response. 
  //In this case, we're assuming that the server will respond with JSON data containing a position property.
  //The response is parsed as JSON using the json() method and the resulting position value is assigned to the position variable. 
  //Finally, the updateResult() function is called to highlight the word at the specified position on the webpage.
  fetch("/audio", {
      method: "POST",
      body: formData
  }).then(response => {
      return response.json();
  }).then(data => {
      console.log(data)
      position = data.position;
      updateResult();
      if (position === -1)
        recording = false
        botonstart.innerHTML = 'Start recording'
        mediaRecorder.stop();
  });
  
  chunks = [];
}

function updateResult() {

  //This line gets a reference to the HTML element with an ID of "result" and assigns it to the result variable.
  let result = document.getElementById("result");

  //This line splits the test sentence into an array of individual words using the split() method. 
  //The separator used to split the string is a single space character.
  let sentences = [...discurso]

  //This line gets the word at the specified position in the words array, 
  //which corresponds to the word that should be highlighted on the webpage. 
  //The position variable is assumed to contain the index of the word to highlight.
  let sentence = sentences[position];

  //This line initializes an empty string that will be used to build the bolded text to display on the webpage.
  let boldText = "";

  //This loop iterates over each word in the words array and either adds it to the boldText string as-is, 
  //or adds it wrapped in <b> and </b> tags if it is the word that should be highlighted.
  for (let i = 0; i < sentences.length; i++) {
      if (i === position) {
          boldText += "<b>" + sentence + "</b> "+ "<br/>";
      } else {
          boldText += sentences[i] + "<br/>";
      }
  }

  //This line sets the HTML content of the result element to the boldText string, 
  //effectively updating the webpage to show the highlighted word.
  if (result !== null)
   result.innerHTML = boldText;
}

export function stopRecording(botonstop: HTMLButtonElement, botonstart: HTMLButtonElement) {
  let value = botonstart.innerHTML
  const setValue = (text: string) => {
    value = text
    botonstart.innerHTML = value
    mediaRecorder.stop();
    recording = false;
  }
  botonstop.addEventListener('click', () => setValue('Start Recording'))
}



