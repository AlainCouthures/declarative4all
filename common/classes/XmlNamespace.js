import { NAMESPACE_NODE } from "../utils/constants.js";

export class XmlNamespace {
  constructor(URI, prefix) {
    this.nodeType = NAMESPACE_NODE;
    this.URI = URI ?? '';
    this.prefix = prefix ?? '';
  }
}