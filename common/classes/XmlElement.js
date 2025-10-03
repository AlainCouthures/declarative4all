import { ELEMENT_NODE } from "../utils/constants.js";
import { XmlAttribute } from "./XmlAttribute.js";
import { XmlNamespace } from "./XmlNamespace.js";

export class XmlElement {
  attributes = [];
  namespaces = [];
  childNodes = [];
  nodeType = ELEMENT_NODE;
  parentNode = null;
  previousSibling = null;
  nextSibling = null;
  constructor(namespaceURI, qualifiedName) {
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
  }
  appendChild(node) {
    if (node) {
      node.previousSibling = this.childNodes[this.childNodes.length - 1];
      if (node.previousSibling) {
        node.previousSibling.nextSibling = node;
      }
      this.childNodes.push(node);
      node.parentNode = this;
    }
  }
  removeChild(node) {
    if (node.previousSibling) {
      node.previousSibling.nextSibling = node.nextSibling;
    }
    this.childNodes = this.childNodes.filter(child => child !== node);
  }
  getAttribute(attrname) {
    for (let i = 0, l = this.attributes.length; i < l; i++) {
      if (this.attributes[i].name === attrname) {
        return this.attributes[i].value;
      }
    }
    return '';
  }
  getAttributeNS(namespaceURI, qualifiedName) {
    const parts = qualifiedName.split(':');
    const localName = parts.length > 1 ? parts[1] : parts[0];
    for (let i = 0, l = this.attributes.length; i < l; i++) {
      if (this.attributes[i].namespaceURI === namespaceURI && this.attributes[i].localName === localName) {
        return this.attributes[i].value;
      }
    }
    return '';
  }
  setAttributeNS(namespaceURI, qualifiedName, value) {
    if (namespaceURI === 'http://www.w3.org/2000/xmlns/') {
      this.setNamespace(value, qualifiedName === 'xmlns' ? '' : qualifiedName.slice(6));
    } else {
      const parts = qualifiedName.split(':');
      const localName = parts.length > 1 ? parts[1] : parts[0];
      for (let i = 0, l = this.attributes.length; i < l; i++) {
        if (this.attributes[i].namespaceURI === namespaceURI && this.attributes[i].localName === localName) {
          this.attributes[i].value = value;
          return;
        }
      }
      const attr = new XmlAttribute(namespaceURI, qualifiedName);
      attr.value = value;
      this.attributes.push(attr);
      attr.ownerElement = this;
    }
  }
  setAttribute(attrname, value) {
    this.setAttributeNS('', attrname, value);
  }
  setAttributeNodeNS(attr) {
    for (let i = 0, l = this.attributes.length; i < l; i++) {
      if (this.attributes[i].namespaceURI === attr.namespaceURI && this.attributes[i].localName === attr.localName) {
        this.attributes[i] = attr;
        return;
      }
    }
    this.attributes.push(attr);
    attr.ownerElement = this;
  }
  setAttributeNode(attr) {
    this.setAttributeNodeNS(attr);
  }
  removeAttribute(attrname) {
    this.attributes = this.attributes.filter(attr => attr.name !== attrname);
  }
  setNamespace(namespaceURI, prefix) {
    const ns = new XmlNamespace(namespaceURI, prefix);
    this.namespaces.push(ns);
  }
}