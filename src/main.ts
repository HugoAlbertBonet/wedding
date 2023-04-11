import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { selectSpeech, startRecording, stopRecording } from './sendAudio'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Microphone Test</h1>
    <div class="card">
      <button id="start" type="button">Start Recording</button>
      <p id="result"><b>Hyperloop UPV es un equipo universitario que se dedica a desarrollar el quinto medio de transporte.</b><br/>
      Este transporte se desplaza levitando por un tubo de vacío, por lo que se ahorra el rozamiento con el aire y con la superficie.<br/>
      Cada año participamos en una competición universitaria, siendo el primer año en Valencia y el segundo en Delft.<br/>
      Este último año fuimos el equipo más premiado de toda la competición, y el primero en levitar en vacío.<br/>
      Este año hemos conseguido ya más de 80 patrocinadores y tenemos un presupuesto líquido estimado de 82000 euros.<br/>
      Si conseguimos cubrir todo el presupuesto, iremos a por el objetivo 100 de 100.</p>
      <button id="stop" type="button">Stop Recording</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
selectSpeech(document.querySelector<HTMLParagraphElement>('#result')!)
startRecording(document.querySelector<HTMLButtonElement>('#start')!, document.querySelector<HTMLParagraphElement>('#result')!, document.querySelector<HTMLButtonElement>('#stop')!)
stopRecording(document.querySelector<HTMLButtonElement>('#stop')!, document.querySelector<HTMLParagraphElement>('#result')!, document.querySelector<HTMLButtonElement>('#start')!)