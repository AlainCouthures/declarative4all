import { ATTRIBUTE_NODE } from "../utils/constants.js";

export class XmlAttribute {
  constructor(namespaceURI, qualifiedName) {
    this.nodeType = ATTRIBUTE_NODE;
    this.nodeName = qualifiedName;
    if (namespaceURI) {
      this.namespaceURI = namespaceURI;
      const parts = qualifiedName.split(':');
      this.prefix = parts.length > 1 ? parts[0] : '';
      this.localName = parts.length > 1 ? parts[1] : parts[0];
    } else {
      this.namespaceURI = '';
      this.prefix = '';
      this.localName = qualifiedName;
    }
    this.name = qualifiedName;
    this.value = '';
  }
  appendChild(node) {
    if (node) {
      this.value += node.textContent || '';
    }
  }
}