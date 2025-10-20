import { XmlDocument } from "./XmlDocument.js";
import { richJSONstringify } from "../utils/richJSONstringify.js";

export class IXmlExpandedXmlDocument extends XmlDocument {
  globalNamespaceURI = "";
  globalPrefix = "";
  rules = [];
  normalizingRules = [];
  toArray() {
    return this.rules;
  }
  toJSON() {
    return richJSONstringify(this.rules);
  }
  addNamespace(namespaceURI, prefix) {
    this.globalNamespaceURI = namespaceURI;
    this.globalPrefix = prefix;
  }
}