import { kebabToPascalCase } from "../utils/misc.js";
import { IXmlElements } from "./IXmlElements.js";
import { IXmlTextNode } from "./IXmlTextNode.js";

export class IXmlDocument {
  textContent = "";
  createElementNS(namespaceURI, qualifiedName) {
    const elt = new IXmlElements[`IXmlElement${kebabToPascalCase(qualifiedName.substring(qualifiedName.indexOf(":") + 1))}`]();
    elt.ownerDocument = this;
    return elt;
  }
  createTextNode(text) {
    return new IXmlTextNode(text);
  }
  appendChild(node) {
    this.textContent = node.toParentNode();
  }
}