import { TEXT_NODE } from "../utils/constants.js";

export class XmlTextNode {
  constructor(text) {
    this.nodeType = TEXT_NODE;
    this.textContent = text ?? '';
  }
}