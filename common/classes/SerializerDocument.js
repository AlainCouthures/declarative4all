import { SerializerElement } from "./SerializerElement.js";
import { SerializerAttribute } from "./SerializerAttribute.js";
import { SerializerTextNode } from "./SerializerTextNode.js";

export class SerializerDocument {
  constructor(indent) {
    this.textContent = '';
    this.indent = indent;
  }
  createElement(name) {
    const elt = new SerializerElement('', name);
    elt.ownerDocument = this;
    return elt;
  }
  createElementNS(namespaceURI, qualifiedName) {
    const elt = new SerializerElement(namespaceURI, qualifiedName);
    elt.ownerDocument = this;
    return elt;
  }
  createAttribute(attrName) {
    return new SerializerAttribute('', attrName);
  }
  createAttributeNS(namespaceURI, qualifiedName) {
    return new SerializerAttribute(namespaceURI, qualifiedName);
  }
  createTextNode(text) {
    return new SerializerTextNode(text);
  }
  appendChild(node) {
    this.textContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + node.toParentNode();
  }
}