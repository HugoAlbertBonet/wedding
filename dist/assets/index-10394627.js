(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function n(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(e){if(e.ep)return;e.ep=!0;const i=n(e);fetch(e.href,i)}})();const m="/assets/typescript-f6ead1af.svg",f="/vite.svg";var l=!1,c=0,s,a=[],u=new Array("Hyperloop UPV es un equipo universitario que se dedica a desarrollar el quinto medio de transporte.","Este transporte se desplaza levitando por un tubo de vacío, por lo que se ahorra el rozamiento con el aire y con la superficie.","Cada año participamos en una competición universitaria, siendo el primer año en Valencia y el segundo en Delft.","Este último año fuimos el equipo más premiado de toda la competición, y el primero en levitar en vacío.","Este año hemos conseguido ya más de 80 patrocinadores y tenemos un presupuesto líquido estimado de 82000 euros.","Si conseguimos cubrir todo el presupuesto, iremos a por el objetivo 100 de 100");function g(t){t.innerHTML=u.join("<br/>")}function v(t){let o=t.innerHTML;const n=r=>{o=r,t.innerHTML=o,navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(e=>{l=!0,a=[],s=new MediaRecorder(e),s.addEventListener("dataavailable",i=>{l&&(a.push(i.data),console.log(a),a.length>0&&y(t))}),p()})};t.addEventListener("click",()=>n("Recording..."))}function p(t){s.start(),setTimeout(function(){s.state=="recording"&&s.stop(),p()},3e3)}function y(t){if(!l)return;let o=new Blob(a,{type:"audio/webm;codecs=opus"});console.log(o);let n=new FormData;n.append("file",o,"recording.webm"),fetch("http://localhost:5050/audio",{method:"POST",body:n}).then(r=>r.json()).then(r=>{console.log(r),c=r.position,b(),c===-1&&(l=!1),t.innerHTML="Start recording",s.stop()}),a=[]}function b(){let t=document.getElementById("result"),o=[...u],n=o[c],r="";for(let e=0;e<o.length;e++)e===c?r+="<b>"+n+"</b> <br/>":r+=o[e]+"<br/>";t!==null&&(t.innerHTML=r)}function h(t,o){let n=o.innerHTML;const r=e=>{n=e,o.innerHTML=n,s.stop(),l=!1};t.addEventListener("click",()=>r("Start Recording"))}document.querySelector("#app").innerHTML=`
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${f}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${m}" class="logo vanilla" alt="TypeScript logo" />
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
`;g(document.querySelector("#result"));v(document.querySelector("#start"));h(document.querySelector("#stop"),document.querySelector("#start"));
