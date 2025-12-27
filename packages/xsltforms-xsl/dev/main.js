import './style.css';
import * as xsltforms_xsl from '../src/index.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <div style="display: flex; gap: 16px;">
    <div>
      <label for="source">XHTML+XForms source</label>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <select id="sources">
        <option value="">-- Select a sample --</option>
      </select>
      <br>
      <textarea id="source" rows="15" cols="90" spellcheck="false" required placeholder="Enter your XHTML+XForms source"></textarea>
      <br>
      <button id="clear-source">Clear</button>
      <button id="transform">to HTML+JavaScript</button>
      <br>
      <label for="html">HTML+JavaScript</label>
      <br>
      <textarea id="html" rows="20" cols="90" spellcheck="false" placeholder="Resulting HTML+JavaScript"></textarea>
      <br>
      <button id="copy-html">to Clipboard</button>
    </div>
    <pre id="output"></pre>
  </div>
`;

globalThis.xsltforms_xsl = xsltforms_xsl;
let currentSource = null;
const sourcesSelect = document.querySelector('#sources');
const sourceTextArea = document.querySelector('#source');
const clearSourceButton = document.querySelector('#clear-source');
const transformButton = document.querySelector('#transform');
const htmlTextArea = document.querySelector('#html');
const copyHtmlButton = document.querySelector('#copy-html');
//const outputPre = document.querySelector('#output');

let rawOutput = false;

const sourceOptions = new Map([
  ['hello', { label: 'Hello World!', content: `<?xml-stylesheet href="xsltforms.xsl" type="text/xsl"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:xf="http://www.w3.org/2002/xforms" lang="en">
   <head>
      <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover"/>
      <title>Hello World in XForms</title>
      <xf:model>
         <xf:instance>
            <data xmlns="">
               <PersonGivenName/>
            </data>
         </xf:instance>
      </xf:model>
   </head>
   <body>
      <p>Type your first name in the input box. <br/>
        If you are running XForms, the output should be displayed in the output area.</p>   
			 <xf:input ref="PersonGivenName" incremental="true">
					<xf:label>Please enter your first name: </xf:label>
			 </xf:input>
			 <br />
			 <xf:output value="concat('Hello ', PersonGivenName, '. We hope you like XForms!')">
					<xf:label>Output: </xf:label>
			 </xf:output>
   </body>
</html>`}]
]);
sourceOptions.forEach((data, key) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = data.label;
  sourcesSelect.appendChild(option);
});
sourcesSelect.addEventListener('change', (event) => {
  htmlTextArea.value = '';
  const selectedOption = sourceOptions.get(event.target.value);
  if (selectedOption) {
    sourceTextArea.value = selectedOption.content;
  } else {
    sourceTextArea.value = '';
  }
});
clearSourceButton.addEventListener('click', () => {
  sourceTextArea.value = '';
  checkSourceValidity();
});
transformButton.addEventListener('click', () => {
  htmlTextArea.value = xsltforms_xsl.fromXhtmlToHtml(sourceTextArea.value);
});
copyHtmlButton.addEventListener('click', () => {
  navigator.clipboard.writeText(htmlTextArea.value)
    .then(() => {})
    .catch(err => {
      alert('Failed to copy to clipboard');
  });
});