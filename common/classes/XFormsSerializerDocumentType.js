import { DOCUMENT_TYPE_NODE } from "../utils/constants.js";

export class XFormsSerializerDocumentType {
  nodeType = DOCUMENT_TYPE_NODE;
  constructor(qualifiedName, publicId, systemId, doc) {
    this.name = qualifiedName;
    this.publicId = publicId;
    this.systemId = systemId;
    this.ownerDocument = doc;
  }
  serialize(offset = '') {
    return `${offset}<!DOCTYPE ${this.name}${this.publicId ? ` PUBLIC "${this.publicId}"` : ''}${this.systemId ? ` "${this.systemId}"` : ''}>`;
  }
}