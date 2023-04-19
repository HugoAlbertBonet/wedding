var position = 0;
//var parrafoResult;
var follow = false;
var discurso = new Array("Hyperloop UPV is a universitary team whose aim is to develop the fifth mean of transport.",
"These means of transport moves levitating through a tube of vacuum, forgetting about the air and surface friction.",
"Every year, we participate in a competition, taking place in Valencia for the first time and Delft for the second edition.",
"Last year we were the most awarded team and the first to ever levitate in a vacuum environment.",
"This year we have accomplished more than 80 partners and we have an estimated economic budget of 82000 euros.",
"If we reach the whole objective, we will look for the 100 out of 100 objective."); 


export function selectSpeech(parrafo: HTMLParagraphElement){
  parrafo
  parrafo.innerHTML = discurso.join("<br/>")
}

export function activateFollowSpeech(botonstart: HTMLButtonElement) {
  let value = botonstart.innerHTML
  const setValue = (text: string) => {
    value = text
    botonstart.innerHTML = value
    follow = true;
    followSpeech(botonstart);
  }
  botonstart.addEventListener('click', () => setValue('Following speech...'))
}

function followSpeech(botonstart: HTMLButtonElement){
  setTimeout(function() {
    if(follow)
      getData(botonstart)
      followSpeech(botonstart);
  }, 3000); // 2 seconds audios
}

function getData(botonstart: HTMLButtonElement) {
  //This line sends the FormData object to the /api/increment endpoint of the backend server using the fetch() method. 
  //The fetch() method returns a promise that resolves to the server's response. 
  //In this case, we're assuming that the server will respond with JSON data containing a position property.
  //The response is parsed as JSON using the json() method and the resulting position value is assigned to the position variable. 
  //Finally, the updateResult() function is called to highlight the word at the specified position on the webpage.
  fetch("https://wedding-delta-henna.vercel.app/line", {
      method: "GET"
  }).then(response => {
      return response.json();
  }).then(data => {
      console.log(data)
      position = data.position;
      updateResult();
      if (position === -1)
        deactivateFollowSpeech(botonstart);
  });
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


export function deactivateFollowSpeech(botonstart: HTMLButtonElement) {
  botonstart.innerHTML = 'Follow speech'
  follow = false
}


