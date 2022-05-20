import { encode, decode } from 'base-64';
import * as monaco from 'monaco-editor';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import JavasScript from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);
window.MonacoEnvironment = {
  getWorker (_, label){
    if(label === 'html'){
      return HtmlWorker();
    }
    if(label === 'css'){
      return CssWorker(); 
    }
    if(label === 'javascript'){
      return JavasScript(); 
    }
  }
};

const iframe = select('iframe');
const htmlEl = select('#html');
const cssEl = select('#css');
const jsEl = select('#js');
const headerItems = selectAll('.header-item');

const htmlEditor = monaco.editor.create(htmlEl, {
  value: '',
  language: 'html',
  fontSize: 16,
  theme: 'vs-dark',
  automaticLayout: true,
});

const cssEditor = monaco.editor.create(cssEl, {
  value: '',
  language: 'css',
  fontSize: 16,
  theme: 'vs-dark',
  automaticLayout: true,
});

const jsEditor = monaco.editor.create(jsEl, {
  value: '',
  language: 'javascript',
  fontSize: 16,
  theme: 'vs-dark',
  automaticLayout: true,
})

htmlEditor.onDidChangeModelContent(() => {
  updateUrl();
  iframe.srcdoc = htmlGenerate();
});

cssEditor.onDidChangeModelContent(() => {
  updateUrl();
  iframe.srcdoc = htmlGenerate();
})

cssEl.addEventListener('input', () => {
  updateUrl();
  iframe.srcdoc = htmlGenerate();
});

jsEl.addEventListener('input', () => {
  updateUrl();
  iframe.srcdoc = htmlGenerate();
});



function htmlGenerate(){
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          ${cssEditor.getValue()}
        </style>
      </head>
      <body>
        ${htmlEditor.getValue()}
        <script>
        ${jsEditor.getValue()}
        </script>
      </body>
    </html>
  `;
}

function updateUrl(){
  const hashCode = `${encode(htmlEditor.getValue())}|${encode(jsEditor.getValue())}|${encode(cssEditor.getValue())}`;
  window.history.replaceState(null, null, hashCode);
};

function init() {
  const { pathname } = window.location;
  const [ html, js, css ] = pathname.slice(1).split('%7C');
  htmlEditor.setValue(html ? decode(html) : '');
  jsEditor.setValue(js ? decode(js) : '');
  cssEditor.setValue(css ? decode(css) : '');

  select('iframe').srcdoc = htmlGenerate();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});


const handleElementDisplay = (element, typeElement) => {
  const TYPES_IDS = {
    html: 'html-header',
    css: 'css-header',
    js: 'js-header'
  }
  if(typeElement === TYPES_IDS.html) {
    cssEl.classList.replace('box-code-flex','box-code');
    jsEl.classList.replace('box-code-flex','box-code');

    htmlEl.classList[0] === 'box-code' ? 
      htmlEl.classList.replace('box-code', 'box-code-flex') : 
      htmlEl.classList.replace('box-code-flex','box-code');
  }

  if(typeElement === TYPES_IDS.css) {
    htmlEl.classList.replace('box-code-flex','box-code');
    jsEl.classList.replace('box-code-flex','box-code');

    cssEl.classList[0] === 'box-code' ? 
      cssEl.classList.replace('box-code', 'box-code-flex') : 
      cssEl.classList.replace('box-code-flex','box-code');
  }

  if(typeElement === TYPES_IDS.js) {
    cssEl.classList.replace('box-code-flex','box-code');
    htmlEl.classList.replace('box-code-flex','box-code');
    
    jsEl.classList[0] === 'box-code' ? 
      jsEl.classList.replace('box-code', 'box-code-flex') : 
      jsEl.classList.replace('box-code-flex','box-code');
  }
}
function handleClickHeaderItems(headerItems = []){
  headerItems.forEach(element => {
    element.addEventListener('click', (e) => {
      handleElementDisplay(e.target, e.target.id);
    })
  })
}
handleClickHeaderItems(headerItems);