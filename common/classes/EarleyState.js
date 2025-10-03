import { ELEMENT_NODE, TEXT_NODE, ATTRIBUTE_NODE, ARRAY_NODE, NAMESPACE_NODE, ELEMENT_MARK, ATTRIBUTE_MARK, DELETED_MARK, INHERITED_MARK } from "../utils/constants.js";
import { EarleyStreamLexer } from './EarleyStreamLexer.js';
import { EarleyParser, fail } from './EarleyParser.js';

export class EarleyState {
  data = [];
  constructor(rule, dot, reference, wantedBy, parser) {
    Object.assign(this, {rule, dot, reference, wantedBy, parser});
    this.isComplete = this.dot === rule.symbols.length;
    //console.log("new State: " + this.toString());
  }
  toString() {
    return `{${this.rule.toString(this.dot)}}, from: ${this.reference || 0}, wantedBy: ${this.wantedBy.map(state => state.rule.name).join(', ')}`;
  }
  expectingState(symbol, reference, value, parser) {
    if (symbol) {
      if ('string' in symbol) {
        return this.nextState({data: symbol.string, reference: reference}, value, parser);
      } else if ('attributeName' in symbol && 'attributes' in value && symbol.alias in value.attributes) {
        const attributeParser = new EarleyParser(parser.grammar, new EarleyStreamLexer(), symbol.attributeName);
        attributeParser.feed(value.attributes[symbol.alias]);
        const results = attributeParser.finish();
        if (results.length > 0) {
          return this.nextState({
            data: {
              attributeName: symbol.alias,
              resultingValue: results[0].childNodes[0]?.textContent ?? ''
            },
            reference: this.reference
          }, value, parser);
        } else {
          return null;
        }
      } else if (parser.lexer instanceof EarleyStreamLexer && ('startName' in symbol || 'endName' in symbol)) {
        return this.nextState({data: '', reference: reference}, value, parser);
      } else {
        return this;
      }
    } else {
      return this;
    }
  }
  nextState(child, value, parser) {
    //console.log("current State: " + this.toString());
    let dot = this.dot + 1;
    const state = new EarleyState(this.rule, dot, this.reference, this.wantedBy, parser);
    state.left = this;
    state.right = child;
    if (state.isComplete) {
      state.data = state.build();
      state.right = undefined;
    } else {
      return state.expectingState(this.rule.symbols[dot], this.reference, value, parser);
    }
    return state;
  }
  build() {
    const children = [];
    for (let node = this; node.left; node = node.left) {
      if (node.right?.data !== null) {
        children.unshift(node.right.data);
      }
    }
    return children;
  }
  finish() {
    const nodeCreators = {
      [ELEMENT_MARK]: () => EarleyState.createElement(this.rule.alias, this.rule.ns),
      [ATTRIBUTE_MARK]: () => EarleyState.createAttribute(this.rule.alias), 
      [DELETED_MARK]: () => EarleyState.createArray()
    };
    if (!this.#appendFromSymbols(nodeCreators[this.rule.mark]?.())) {
      this.data = fail;
    }
  }
  static getTextContent(node) {
    switch (node.nodeType) {
      case ELEMENT_NODE:
      case ARRAY_NODE:
        return node.childNodes.reduce((s, child) => s + EarleyState.getTextContent(child), '');
      case ATTRIBUTE_NODE:
        return node.value;
      case TEXT_NODE:
        return node.textContent;
    }
  }
  static appendToNode(node, child) {
    switch (child.nodeType) {
      case ELEMENT_NODE: {
        if (node.nodeType == ATTRIBUTE_NODE) {
          node.value += EarleyState.getTextContent(child);
        } else {
          node.appendChild(child);
        } 
        break;
      }
      case ATTRIBUTE_NODE: {
        if (node.nodeType == ATTRIBUTE_NODE) {
          node.value += EarleyState.getTextContent(child);
        } else if (node.nodeType == ELEMENT_NODE) {
          node.attributes.push(child);
        } else {
          node.appendChild(child);
        }
        break;
      }
      case TEXT_NODE: {
        switch (node.nodeType) {
          case ELEMENT_NODE:
          case ARRAY_NODE: {
            if (node.childNodes.at(-1)?.nodeType === 3) {
              node.childNodes.at(-1).textContent += EarleyState.getTextContent(child);
            } else {
              node.appendChild(EarleyState.createTextNode(EarleyState.getTextContent(child)));
            }
            break;
          } 
          case ATTRIBUTE_NODE: {
            node.value += EarleyState.getTextContent(child);
            break;
          }
        }
        break;
      }
      case ARRAY_NODE: {
        child.childNodes.forEach(c => EarleyState.appendToNode(node, c));
        if (child.attributes && node.nodeType === ARRAY_NODE) {
          child.attributes.forEach(attr => node.setAttribute(attr.name, attr.value));
        }
        break;
      }
    }
  }
  #appendFromSymbols(node) {
    let tIndex = 0;
    let remainingAttributes = {}
    let preservedAttributes = [];
    for (const symbol of this.rule.symbols) {
      const tItem = this.data[tIndex];
      if (typeof tItem === 'object' && tItem !== null && 'startName' in tItem) {
        Object.keys(tItem.attributes).forEach(attrName => {
          remainingAttributes[attrName] = '';
        });
        preservedAttributes = node.attributes;
        node.attributes = [];
      } else if (typeof tItem === 'object' && tItem !== null && 'endName' in tItem) {
        node.attributes.forEach(attr => {
          delete remainingAttributes[attr.name];
        });
        node.attributes = preservedAttributes;
        if (Object.keys(remainingAttributes).length > 0) {
          return false;
        }
      } else if (typeof tItem === 'object' && tItem !== null && 'attributeName' in tItem) {
        EarleyState.appendToNode(node, EarleyState.createTextNode(tItem.resultingValue));
        node.setAttribute(tItem.attributeName, tItem.resultingValue);
      } else if (tItem || symbol.string || symbol.attributeName) {
        switch (symbol.mark) {
          case DELETED_MARK: {
            if (symbol.name) {
              switch (tItem.nodeType) {
                case ELEMENT_NODE: {
                  tItem.attributes.forEach(attr => EarleyState.appendToNode(node, attr));
                  tItem.childNodes.forEach(child => EarleyState.appendToNode(node, child));
                  break;
                }
                case ARRAY_NODE: {
                  tItem.childNodes.forEach(child => EarleyState.appendToNode(node, child));
                  if (node.nodeType === ARRAY_NODE && tItem.attributes) {
                    tItem.attributes.forEach(attr => node.setAttribute(attr.name, attr.value));
                  }
                  break;
                }
                case ATTRIBUTE_NODE: {
                  EarleyState.appendToNode(node, EarleyState.createTextNode(tItem.value));
                  break;
                }
              }
            }
            break;
          }
          case INHERITED_MARK: {
            const child = symbol.name ? tItem : symbol.regExp || symbol.attributeName ? EarleyState.createTextNode(tItem) : EarleyState.createTextNode(symbol.char || symbol.string);
            EarleyState.appendToNode(node, child);
            break;
          }
          case ELEMENT_MARK: {
            if (tItem.nodeType === ARRAY_NODE) {
              const newElement = EarleyState.createElement(symbol.alias);
              tItem.childNodes.forEach(c => EarleyState.appendToNode(newElement, c));
              EarleyState.appendToNode(node, newElement);
            } else {
              EarleyState.appendToNode(node, tItem);
            }
            break;
          }
          case ATTRIBUTE_MARK: {
            if ([ARRAY_NODE, ELEMENT_NODE, TEXT_NODE].includes(tItem.nodeType)) {
              const newAttr = EarleyState.createAttribute(symbol.alias);
              newAttr.value = EarleyState.getTextContent(tItem);
              EarleyState.appendToNode(node, newAttr);
            } else {
              EarleyState.appendToNode(node, tItem);
            }
            break;
          }
        }
      }
      tIndex++;
    }
    this.data = node;
    return true;
  }
  static createElement(nodeName, namespaces) {
    return {
      nodeType: ELEMENT_NODE,
      attributes: [],
      namespaces: namespaces || [],
      childNodes: [],
      nodeName,
      localName: nodeName,
      appendChild: function(child) {
        this.childNodes.push(child);
      },
      getAttribute: function(name) {
        const attr = this.attributes.find(attr => attr.name === name);
        return attr?.value ?? "";
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
      },
      setNamespace(URI, prefix) {
        this.namespaces.push({
          nodeType: NAMESPACE_NODE,
          prefix,
          URI
        });
      },
      lookupNamespaceURI(prefix) {
        const ns = this.namespaces.find(ns => ns.prefix === prefix);
        return ns ? ns.URI : null;
      },
      lookupPrefix(namespaceURI) {
        const ns = this.namespaces.find(ns => ns.URI === namespaceURI);
        return ns ? ns.prefix : null;
      }
    };
  }
  static createAttribute(name) {
    return {
      nodeType: ATTRIBUTE_NODE,
      name,
      value: ''
    };
  }
  static createTextNode(text) {
    return {
      nodeType: TEXT_NODE,
      textContent: text
    };
  }
  static createArray() {
    return {
      nodeType: ARRAY_NODE,
      attributes: [],
      childNodes: [],
      appendChild: function(child) {
        this.childNodes.push(child);
//        if (child.attributes) {
//          child.attributes.forEach(attr => this.setAttribute(attr.name, attr.value));
//        }
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
  }
}