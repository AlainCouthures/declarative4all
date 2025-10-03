import { jsQuoted } from "../utils/misc.js";

export class JsonSerializerTextNode {
  textContent = '';
  ownerDocument = null;
  constructor(text, indent) {
    this.textContent = `"nodeType": 3,${indent ? '\n' : ' '}"textContent": ${jsQuoted(text)}`;
  }
  toParentNode() {
    const { indent } = this.ownerDocument;
    const shortsep = indent ? '\n' : '';
    let body = `${shortsep}${this.textContent}`;
    if (indent) {
      const spaces = " ".repeat(indent);
      body = body.replaceAll('\n', `\n${spaces}`);
    }
    return `{${body}${shortsep}}`;
  }
}