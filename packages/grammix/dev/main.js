import './style.css';
import * as grammix from '../src/index.js';

/*
import { EarleyXmlLexer } from '../../../common/classes/EarleyXmlLexer.js';
import { XmlDocument } from '../../../common/classes/XmlDocument.js';
const testLexer = new EarleyXmlLexer();
testLexer.reset(new XmlDocument('<root attr1="v1" attr0="v0">a<set><child attr2="v2"/></set>b</root'));
console.log('xmlLexer test:', Array.from(testLexer).map(value => value.char ?? (value.startName ? `<${value.startName}${Object.entries(value.attributes).map(([name, value]) => ` ${name}="${value}"`).join('')}>` : `</${value.endName}${Object.entries(value.attributes).map(([name, value]) => ` ${name}="${value}"`).join('')}>`)).join(''));
*/

const app = document.querySelector('#app');
app.innerHTML = `
  <div style="display: flex; gap: 16px;">
    <div>
      <label for="grammar">Invisible XML Grammar</label>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <select id="grammars">
        <option value="">-- Select a sample --</option>
      </select>
      <br>
      <textarea id="grammar" rows="15" cols="90" spellcheck="false" required placeholder="Enter your grammar"></textarea>
      <br>
      <button id="clear-grammar">Clear</button>
      <button id="normalized">Normalized Grammar</button>
      <button id="expanded">Expanded Grammar</button>
      <button id="xml-notation">XML Notation</button>
      <button id="rules">Rules</button>
      <br>
      <label for="input">Text</label>
      <br>
      <textarea id="input" rows="10" cols="90" spellcheck="false" placeholder="Enter your text"></textarea>
      <br>
      <button id="clear-input">Clear</button>
      <button id="copy-input">to Clipboard</button>
      <br>
      <label for="xml">XML</label>
      <br>
      <textarea id="xml" rows="20" cols="90" spellcheck="false" placeholder="Enter your xml"></textarea>
      <br>
      <button id="copy-xml">to Clipboard</button>
    </div>
    <pre id="output"></pre>
  </div>
`;

globalThis.grammix = grammix;
let currentGrammar = null;
const grammarsSelect = document.querySelector('#grammars');
const grammarTextArea = document.querySelector('#grammar');
const clearGrammarButton = document.querySelector('#clear-grammar');
const normalizedButton = document.querySelector('#normalized');
const expandedButton = document.querySelector('#expanded');
const xmlNotationButton = document.querySelector('#xml-notation');
const rulesButton = document.querySelector('#rules');
const inputTextArea = document.querySelector('#input');
const clearInputButton = document.querySelector('#clear-input');
const copyInputButton = document.querySelector('#copy-input');
const xmlTextArea = document.querySelector('#xml');
const copyXmlButton = document.querySelector('#copy-xml');
const outputPre = document.querySelector('#output');

let rawOutput = false;

const disableButtons = () => {
  normalizedButton.disabled = true;
  expandedButton.disabled = true;
  xmlNotationButton.disabled = true;
  rulesButton.disabled = true;
};

const enableButtons = () => {
  normalizedButton.disabled = false;
  expandedButton.disabled = false;
  xmlNotationButton.disabled = false;
  rulesButton.disabled = false;
};

const checkGrammarValidity = () => {
  let valid = grammarTextArea.value !== '';
  clearGrammarButton.disabled = !valid;
  if (valid) {
    currentGrammar = grammix.fromIXml(grammarTextArea.value);
    valid = currentGrammar.rules.length !== 0;
  } else {
    currentGrammar = null;
  }
  if (valid) {
    grammarTextArea.setCustomValidity('');
    grammarTextArea.removeAttribute('aria-invalid');
    enableButtons();
    outputPre.textContent = '';
    outputPre.classList.remove('error');
    checkInputValidity();
  } else {
    grammarsSelect.value = '';
    grammarTextArea.setCustomValidity('Syntax Error');
    grammarTextArea.setAttribute('aria-invalid', 'true');
    disableButtons();
    outputPre.textContent = currentGrammar?.toIndentedString() ?? '';
    outputPre.classList.add('error');
  }
};
grammarTextArea.addEventListener('input', checkGrammarValidity);
checkGrammarValidity();

const checkInputValidity = () => {
  clearInputButton.disabled = inputTextArea.value === '';
  copyInputButton.disabled = inputTextArea.value === '';
  copyXmlButton.disabled = xmlTextArea.value === '';
  if (currentGrammar) {
    const parseResult = currentGrammar.parse(inputTextArea.value);
    if (parseResult.documentElement.getAttributeNS('http://invisiblexml.org/NS', 'state') === 'failed') {
      inputTextArea.setCustomValidity('Syntax Error');
      inputTextArea.setAttribute('aria-invalid', 'true');
      outputPre.textContent = parseResult.toIndentedString();
      outputPre.classList.add('error');
    } else {
      inputTextArea.setCustomValidity('');
      inputTextArea.removeAttribute('aria-invalid');
      xmlTextArea.value = parseResult.toIndentedString();
      copyXmlButton.disabled = xmlTextArea.value === '';
      xmlTextArea.setCustomValidity('');
      xmlTextArea.removeAttribute('aria-invalid');
      outputPre.textContent = '';
      outputPre.classList.remove('error');
    }
  } else {
    inputTextArea.setCustomValidity('');
    inputTextArea.removeAttribute('aria-invalid');
    outputPre.textContent = '';
    outputPre.classList.remove('error');
  } 
};
inputTextArea.addEventListener('input', checkInputValidity);
checkInputValidity();

xmlTextArea.addEventListener('input', () => {
  if (currentGrammar) {
    try {
      const canonicalizeResult = currentGrammar.canonicalize(xmlTextArea.value);
      xmlTextArea.setCustomValidity('');
      xmlTextArea.removeAttribute('aria-invalid');
      inputTextArea.setCustomValidity('');
      inputTextArea.removeAttribute('aria-invalid');
      inputTextArea.value = canonicalizeResult;
      outputPre.textContent = '';
      outputPre.classList.remove('error');
    } catch (error) {
      xmlTextArea.setCustomValidity('Syntax Error');
      xmlTextArea.setAttribute('aria-invalid', 'true');
      outputPre.textContent = error.message;
      outputPre.classList.add('error');
    }
  }
});

const grammarOptions = new Map([
  ['classes', { label: 'classes', content: `input: line*.
-line: name, s, amount, newline.
name: word++([Zs]+).
-word:[L]+.
amount: currency, number.
@currency: [Sc].
-number: [Nd]+.
-newline: s?, (-#a; -#d)+.
-s: -[Zs]+.` }],
  ['data', { label: 'data', content: `data: value++-",", @source.
source: +"ixml".
value: pos; neg.
-pos: +"+", digit+.
-neg: +"-", -"(", digit+, -")".
-digit: ["0"-"9"].` }],
  ['date', { label: 'date', content: `date: day, -" ", month, -" ", year.
@day: digit, digit?.
-digit: "0"; "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9".
@month: "January"; "February"; "March"; "April"; "May"; "June";
        "July"; "August"; "September"; "October"; "November"; "December".
@year: digit, digit, digit, digit.` }],
  ['dates', { label: 'dates', content: `dates: s?, date+.
date: day, s, month, s, year, s?.
day: digit, digit?.
-digit: "0"; "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9".
month: "January"; "February"; "March";
       "April"; "May"; "June";
       "July"; "August"; "September";
       "October"; "November"; "December".
year: digit, digit, digit, digit.
-s: (-" "; -#d; -#9; -#a)+.` }],
  ['strings', { label: 'strings', content: `strings: s?, string**(-",", s).
string: -'"', ~['"']*, -'"'.
-s: -" "*.` }],
  ['url', { label: 'url', content: `url: scheme, ":", authority, path.
scheme: letter+.
authority: "//", host.
host: sub++".".
sub: letter+.
path: ("/", seg)+.
seg: fletter*.
-letter: ["a"-"z"]; ["A"-"Z"]; ["0"-"9"].
-fletter: letter; ".".` }],
  ['expr', { label: 'expr', content: `expr: open, -arith, @close, -";".
@open: "(".
close: ")".
arith: left, op, ^right>second.
left>first: operand.
-right: operand.
-operand: name; -number.
@name: ["a"-"z"].
@number: ["0"-"9"].
-op: sign.
@sign>operator: "+"; "-".` }],
  ['ixml', { label: 'ixml', content: `         ixml: s, (prolog, RS)?, rule++RS, s.

           -s: (whitespace; comment)*. {Optional spacing}
          -RS: (whitespace; comment)+. {Required spacing}
  -whitespace: -[Zs]; tab; lf; cr.
         -tab: -#9.
          -lf: -#a.
          -cr: -#d.
      comment: -"{", (cchar; comment)*, -"}".
       -cchar: ~["{}"].
     
       prolog: version.
      version: -"ixml", RS, -"version", RS, string, s, -'.' .
     
         rule: naming, -["=:"], s, -alts, -".".
      -naming: (mark, s)?, name, s, (-">", s, alias, s)?.
        @name: namestart, namefollower*.
   -namestart: ["_"; L].
-namefollower: namestart; ["-.·‿⁀"; Nd; Mn].
     
       @alias: name.
         alts: alt++(-[";|"], s).
          alt: term**(-",", s).
        -term: factor;
               option;
               repeat0;
               repeat1.
      -factor: terminal;
               nonterminal;
               insertion;
               -"(", s, alts, -")", s.
      repeat0: factor, (-"*", s; -"**", s, sep).
      repeat1: factor, (-"+", s; -"++", s, sep).
       option: factor, -"?", s.
        @mark: ["@^-"].
          sep: factor.
  nonterminal: naming.
    -terminal: literal; 
               charset.
      literal: quoted;
               encoded.
      -quoted: (tmark, s)?, string, s.
     
       @tmark: ["^-"].
      @string: -'"', dchar+, -'"';
               -"'", schar+, -"'".
        dchar: ~['"'; Cc];
               '"', -'"'. {all characters except controls; quotes must be doubled}
        schar: ~["'"; Cc];
               "'", -"'". {all characters except controls; quotes must be doubled}
     -encoded: (tmark, s)?, -"#", hex, s.
         @hex: ["0"-"9"; "a"-"f"; "A"-"F"]+.
     
     -charset: inclusion; 
               exclusion.
    inclusion: (tmark, s)?,          set.
    exclusion: (tmark, s)?, -"~", s, set.
         -set: -"[", s,  (member, s)**(-[";|"], s), -"]", s.
       member: string;
               -"#", hex;
               range;
               class.
       -range: from, s, -"-", s, to.
        @from: character.
          @to: character.
   -character: -'"', dchar, -'"';
               -"'", schar, -"'";
               "#", hex.
       -class: code.
        @code: capital, letter?.
     -capital: ["A"-"Z"].
      -letter: ["A"-"Z"; "a"-"z"].
    insertion: -"+", s, (string; -"#", hex), s.`}],
  ['ixmlns', { label: 'ixmlns', content: `ixml xmlns="http://invisiblexml.org/NS": s, (prolog, RS)?, rule++RS, s.

           -s: (whitespace; comment)*. {Optional spacing}
          -RS: (whitespace; comment)+. {Required spacing}
  -whitespace: -[Zs]; tab; lf; cr.
         -tab: -#9.
          -lf: -#a.
          -cr: -#d.
      comment: -"{", (cchar; comment)*, -"}".
       -cchar: ~["{}"].
     
       prolog: version.
      version: -"ixml", RS, -"version", RS, string, s, -'.' .
     
         rule: naming, (RS, ns)*, -["=:"], s, -alts, -".".
      -naming: (mark, s)?, name, s, (-">", s, alias, s)?.
        @name: namestart, namefollower*, (":", namestart, namefollower*)?.
   -namestart: ["_"; L].
-namefollower: namestart; ["-.·‿⁀"; Nd; Mn].
     
       @alias: name.
           ns: -"xmlns", (-":", prefix)?, s, -"=", s, uri.
      @prefix: namestart, namefollower*.
         @uri: string; -'""'; -"''".
         alts: alt++(-[";|"], s).
          alt: term**(-",", s).
        -term: factor;
               option;
               repeat0;
               repeat1.
      -factor: terminal;
               nonterminal;
               attribute;
               insertion;
               -"(", s, alts, -")", s.
      repeat0: factor, (-"*", s; -"**", s, sep).
      repeat1: factor, (-"+", s; -"++", s, sep).
       option: factor, -"?", s.
        @mark: ["@^-"].
          sep: factor.
  nonterminal: naming.
    -terminal: literal; 
               charset;
               starttag;
               endtag.
      literal: quoted;
               encoded.
      -quoted: (tmark, s)?, string, s.

       @tmark: ["^-"].
      @string: -'"', dchar+, -'"';
               -"'", schar+, -"'".
        dchar: ~['"'; Cc];
               '"', -'"'. {all characters except controls; quotes must be doubled}
        schar: ~["'"; Cc];
               "'", -"'". {all characters except controls; quotes must be doubled}
     -encoded: (tmark, s)?, -"#", hex, s.
         @hex: ["0"-"9"; "a"-"f"; "A"-"F"]+.

     -charset: inclusion; 
               exclusion.
    inclusion: (tmark, s)?,          set.
    exclusion: (tmark, s)?, -"~", s, set.
         -set: -"[", s,  (member, s)**(-[";|"], s), -"]", s.
       member: string;
               -"#", hex;
               range;
               class.
       -range: from, s, -"-", s, to.
        @from: character.
          @to: character.
   -character: -'"', dchar, -'"';
               -"'", schar, -"'";
               "#", hex.
       -class: code.
        @code: capital, letter?.
     -capital: ["A"-"Z"].
      -letter: ["A"-"Z"; "a"-"z"].

     starttag: -"<", s, name, (RS, ns)*, s, -">", s.
       endtag: -"</", s, name, s, -">", s.
    attribute: -"<@", s, name, s, -">", s.

    insertion: -"+", s, (string; -"#", hex), s.`}],
  ['Javascript to XSLT Transpiler', { label: 'js2xslt', content: `xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform":
    -"import * as xslt4all from './xslt4all.mjs';", -#a,
    -"export const transform = xmlInput => {", -#a,
    -"  const xsltStylesheet = xslt4all.stylesheet();", -#a,
    -"  return xsltStylesheet.transform(xmlInput);", -#a,
    -"};"
    .`}]
]);
grammarOptions.forEach((data, key) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = data.label;
  grammarsSelect.appendChild(option);
});
grammarsSelect.addEventListener('change', (event) => {
  const selectedOption = grammarOptions.get(event.target.value);
  if (selectedOption) {
    grammarTextArea.value = selectedOption.content;
    checkGrammarValidity();
    checkInputValidity();
  } else {
    grammarTextArea.value = '';
    checkGrammarValidity();
    checkInputValidity();
  }
});
clearGrammarButton.addEventListener('click', () => {
  grammarTextArea.value = '';
  checkGrammarValidity();
});
normalizedButton.addEventListener('click', () => {
  grammarsSelect.value = '';
  grammarTextArea.value = currentGrammar.toCanonicalIXml();
  checkGrammarValidity();
});
expandedButton.addEventListener('click', () => {
  grammarsSelect.value = '';
  grammarTextArea.value = currentGrammar.toExpandedIXml();
  checkGrammarValidity();
});
xmlNotationButton.addEventListener('click', () => {
  outputPre.textContent = currentGrammar.toIndentedString();
  outputPre.classList.remove('error');
});
rulesButton.addEventListener('click', () => {
  let ser = currentGrammar.rules.reduce((ser, rule, index) => ser + (index !== 0 ? ',\n ' : ' ') + grammix.richJSONstringify(rule).replace(/\\/g, '\\'), '[\n');
  ser += '\n]';
  outputPre.textContent = ser;
  outputPre.classList.remove('error');
});
clearInputButton.addEventListener('click', () => {
  inputTextArea.value = '';
  checkInputValidity;
});
copyInputButton.addEventListener('click', () => {
  navigator.clipboard.writeText(inputTextArea.value)
    .then(() => {})
    .catch(err => {
      alert('Failed to copy to clipboard');
  });
});
copyXmlButton.addEventListener('click', () => {
  navigator.clipboard.writeText(xmlTextArea.value)
    .then(() => {})
    .catch(err => {
      alert('Failed to copy to clipboard');
  });
});