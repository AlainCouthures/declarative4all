import { JsonSerializerElement } from "./JsonSerializerElement.js";
import { JsonSerializerTextNode } from "./JsonSerializerTextNode.js";

export class JsonSerializerDocument {
  textContent = '';
  indent = 0;
  constructor(indent) {
    this.indent = indent;
  }
  createElement(name) {
    const elt = new JsonSerializerElement('', name, this.indent);
    elt.ownerDocument = this;
    return elt;
  }
  createElementNS(namespaceURI, qualifiedName) {
    const elt = new JsonSerializerElement(namespaceURI, qualifiedName, this.indent);
    elt.ownerDocument = this;
    return elt;
  }
  createTextNode(text) {
    const txt = new JsonSerializerTextNode(text, this.indent);
    txt.ownerDocument = this;
    return txt;
  }
  appendChild(node) {
    this.textContent = node.toParentNode();
  }
}