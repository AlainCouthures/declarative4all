import { IXmlXmlDocument } from '../classes/IXmlXmlDocument.js';
import { parseWithGrammar } from './parseWithGrammar.js';
import { iXmlGrammar } from './iXmlGrammar.js';
import { EarleyGrammar } from "../classes/EarleyGrammar.js";
import { replicate } from "./replicate.js";
import { ELEMENT_NODE, TEXT_NODE, ATTRIBUTE_NODE } from "./constants.js";

export const fromIXml = source => {
  const grammar = new IXmlXmlDocument();
  parseWithGrammar(iXmlGrammar, source, null, null, grammar);
  grammar.generateRules();
  if (grammar.rules.length !== 0) {
    const undefinedSymbols = [];
    const earleyGrammar = new EarleyGrammar(grammar.rules);
    const definedSymbols = earleyGrammar.rules.map(r => r.name);
    for (const rule of earleyGrammar.rules) {
      for (const symbol of rule.symbols) {
        if (symbol.name && !definedSymbols.includes(symbol.name) && !undefinedSymbols.includes(symbol.name)) {
          undefinedSymbols.push(symbol.name);
        }
      }
    }
    if (undefinedSymbols.length > 0) {
      const message = `Undefined symbols: ${undefinedSymbols.join(', ')}`;
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
      replicate(r, grammar);
      grammar.rules = [];
    }
  }
  return grammar;
};