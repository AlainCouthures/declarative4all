import { encodeEntities } from "../utils/encodeEntities.js";
import { XmlAttribute } from "./XmlAttribute.js";

export class SerializerElement {
  textContent = "";
  attributes = [];
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
  toParentNode() {
    if (this.nodeName) {
      let s = '<' + this.nodeName;
      if (this.attributes.length !== 0) {
        const namespaceDeclarations = [];
        const otherAttributes = [];
        this.attributes.forEach(attr => {
          if (attr.name === 'xmlns') {
            namespaceDeclarations.unshift(attr);
          } else if (attr.name.startsWith('xmlns:')) {
            namespaceDeclarations.push(attr);
          } else {
            otherAttributes.push(attr);
          }
        });
        namespaceDeclarations.sort((a, b) => a.name === 'xmlns' ? -1 : b.name === 'xmlns' ? 1 : a.name.localeCompare(b.name));
        otherAttributes.sort((a, b) => {
          const aParts = a.name.split(':');
          const bParts = b.name.split(':');
          const aPrefix = aParts.length > 1 ? aParts[0] : '';
          const aLocalName = aParts.length > 1 ? aParts[1] : aParts[0];
          const bPrefix = bParts.length > 1 ? bParts[0] : '';
          const bLocalName = bParts.length > 1 ? bParts[1] : bParts[0];
          return aPrefix < bPrefix ? -1 : aPrefix > bPrefix ? 1 : aLocalName.localeCompare(bLocalName);
        });
        for (let i = 0, l = namespaceDeclarations.length; i < l; i++) {
          s += ' ' + namespaceDeclarations[i].name + '="' + encodeEntities(namespaceDeclarations[i].value) + '"';
        }
        for (let i = 0, l = otherAttributes.length; i < l; i++) {
          s += ' ' + otherAttributes[i].name + '="' + encodeEntities(otherAttributes[i].value) + '"';
        }
      }
      if (this.textContent) {
        s += '>' + this.textContent + (this.ownerDocument.indent && this.textContent.startsWith('\n')? '\n' : '') + '</' + this.nodeName + '>';
      } else {
        s += '/>';
      }
      return s;
    }
    return this.textContent;
  }
  appendChild(node) {
    const ser = node.toParentNode(this);
    if (this.ownerDocument.indent) {
      const spaces = ' '.repeat(this.ownerDocument.indent);
      if (ser.startsWith('<') || this.textContent) {
        if (this.textContent && !this.textContent.startsWith('\n')) {
          this.textContent = '\n' + spaces + this.textContent;
        }
        this.textContent += '\n' + spaces + ser.replace(/\n/g, '\n' + spaces);
      } else {
        this.textContent += ser;
      }
    } else {
      this.textContent += ser;
    }
  }
  setAttributeNS(namespaceURI, qualifiedName, value) {
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
  }
  setAttributeNodeNS(attr) {
    this.attributes.push(attr);
  }
}