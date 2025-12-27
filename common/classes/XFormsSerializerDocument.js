import { TEXT_NODE } from "../utils/constants.js";
import { XFormsSerializerElement } from "./XFormsSerializerElement.js";
import { XFormsSerializerAttribute } from "./XFormsSerializerAttribute.js";
import { XFormsSerializerTextNode } from "./XFormsSerializerTextNode.js";
import { XFormsSerializerComment } from "./XFormsSerializerComment.js";
import { XFormsSerializerDocumentType } from "./XFormsSerializerDocumentType.js";

export class XFormsSerializerDocument {
  xmlPart = false;
  textContent = '';
  models = [];
  options = [];
  afterMetas = [];
  childNodes = [];
  implementation = {
    createDocumentType: (qualifiedName, publicId, systemId) => {
      return new XFormsSerializerDocumentType(qualifiedName, publicId, systemId);
    }
  };
  constructor(path) {
    this.path = path;
    this.childNodes.push(this.implementation.createDocumentType('html', '', '', this));
  }
  createElement(name) {
    return new XFormsSerializerElement('', name, this);
  }
  createElementNS(namespaceURI, qualifiedName) {
    return new XFormsSerializerElement(namespaceURI, qualifiedName, this);
  }
  createAttribute(attrName) {
    return new XFormsSerializerAttribute('', attrName);
  }
  createAttributeNS(namespaceURI, qualifiedName) {
    return new XFormsSerializerAttribute(namespaceURI, qualifiedName);
  }
  createTextNode(text) {
    return new XFormsSerializerTextNode(text);
  }
  createCDATASection(data) {
    return new XFormsSerializerTextNode(data);
  }
  createProcessingInstruction(target, data) {
    if (target === 'xsltforms-options') {
      const s = data;
      const seps = [' ', '\t', '\n', '\r'];
      const seps_attr = [' ', '\t', '\n', '\r', '='];
      let offset = 0;
      const end = s.length;
      let c = s.charAt(offset++);
      while (offset !== end) {
        while (seps.indexOf(c) !== -1) {
          c = s.charAt(offset++);
        }
        if (seps_attr.indexOf(c) !== -1 || offset === end) {
          break;
        }
        let attrname = '';
        let attrvalue = '';
        let ii;
        while (seps_attr.indexOf(c) === -1 && offset !== end) {
          attrname += c;
          c = s.charAt(offset++);
        }
        if (attrname !== '') {
          while (seps.indexOf(c) !== -1 && offset !== end) {
            c = s.charAt(offset++);
          }
          if (c === '=') {
            c = s.charAt(offset++);
            while (seps.indexOf(c) !== -1 && offset !== end) {
              c = s.charAt(offset++);
            }
            attrvalue = '';
            if (c === "'" || c === '"') {
              attrvalue = '';
              ii = offset;
              const attrend = s.indexOf(c, offset);
              if (attrend !== -1) {
                while (ii < attrend) {
                  attrvalue += s.charAt(ii++);
                }
                offset += attrvalue.length + 1;
                c = s.charAt(offset++);
              } else {
                offset = end;
              }
            } else {
              while (offset !== end) {
                attrvalue += c;
                c = s.charAt(offset++);
              }
            }
          } else {
            attrvalue = attrname;
          }
          const attr = this.createAttribute('xf-' + attrname);
          attr.value = attrvalue;
          this.options.push(attr);
        }
      }
    }
    return null;
  }
  createComment(data) {
    return new XFormsSerializerComment(data);
  }
  appendChild(node) {
    if (node) {
      this.childNodes.push(node);
    }
  }
  serialize(offset = '', spaces = '') {
    this.indent = spaces !== '';
    let s = '';
    let firstChild = true;
    for (const child of this.childNodes) {
      if (this.indent && (child.nodeType !== TEXT_NODE || child.textContent.trim() !== '')) {
        s += child.serialize(firstChild ? '' : offset, spaces);
        firstChild = false;
      }
    }
    return s;
  }
}