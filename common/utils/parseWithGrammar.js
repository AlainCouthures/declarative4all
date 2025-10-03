import { EarleyParser } from "../classes/EarleyParser.js";
import { EarleyGrammar } from "../classes/EarleyGrammar.js";
import { EarleyStreamLexer } from "../classes/EarleyStreamLexer.js";
import { EarleyXmlLexer } from "../classes/EarleyXmlLexer.js";
import { replicate } from "./replicate.js";
import { ELEMENT_NODE, TEXT_NODE, ATTRIBUTE_NODE, ARRAY_NODE } from "./constants.js";

export const parseWithGrammar = (grammar, input, namespaceURI, prefix, node) => {
  const stringInput = typeof input === 'string';
  try {
    const parser = new EarleyParser(new EarleyGrammar(grammar), stringInput ? new EarleyStreamLexer() : new EarleyXmlLexer());
    parser.feed(input);
    const results = parser.finish();
    let r = results[0];
    if (r?.nodeType === ARRAY_NODE && r?.childNodes.length === 1) {
      r = r.childNodes[0];
    }
    if (stringInput && r?.nodeType !== ELEMENT_NODE) {
      throw new Error('Parse error');
    }
    if (results.length > 1 && stringInput) {
      const prefix = r.lookupNamespaceURI('') === 'http://invisiblexml.org/NS' ? '' : r.lookupPrefix('http://invisiblexml.org/NS') ?? 'ixml';
      if (prefix === 'ixml' && !r.lookupPrefix('http://invisiblexml.org/NS')) {
        r.setNamespace('http://invisiblexml.org/NS', 'xmlns:ixml');
      }
      r.attributes.push({
        nodeType: ATTRIBUTE_NODE,
        namespaceURI: 'http://invisiblexml.org/NS',
        prefix: prefix,
        name: (prefix === '' ? '' : prefix + ':') + 'state',
        value: 'ambiguous'
      });
    }
    replicate(r, node);
  } catch ({message}) {
    const r = {
      nodeType: ELEMENT_NODE,
      attributes: [],
      childNodes: [],
      nodeName: 'ixml',
      localName: 'ixml',
      appendChild: function(child) {
        this.childNodes.push(child);
      },
      getAttribute: function(name) {
        const attr = this.attributes.find(attr => attr.name === name);
        return attr?.value ?? '';
      },
      setAttribute: function(name, value) {
        const attr = this.attributes.find(attr => attr.name === name);
        if (attr) {
          attr.value = value;
        } else {
          this.attributes.push({
            nodeType: ATTRIBUTE_NODE,
            name,
            value
          });
        }
      }
    };
    r.attributes.push({
      nodeType: ATTRIBUTE_NODE,
      namespaceURI: 'http://invisiblexml.org/NS',
      prefix: r.namespaceURI === 'http://invisiblexml.org/NS' ? r.prefix ?? null : 'ixml',
      name: (r.namespaceURI === 'http://invisiblexml.org/NS' ? (r.prefix ? r.prefix + ':' : '') : 'ixml:') + 'state',
      value: 'failed'
    });
    r.appendChild({
      nodeType: TEXT_NODE,
      textContent: message
    });
    replicate(r, node);
  }
};