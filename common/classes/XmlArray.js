import { ARRAY_NODE } from '../utils/constants.js';

export class XmlArray {
  constructor() {
    this.nodeType = ARRAY_NODE;
    this.childNodes = [];
  }
  appendChild(node) {
    if (node) {
      this.childNodes.push(node);
    }
  }
}