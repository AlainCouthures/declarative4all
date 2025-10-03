export class IXmlTextNode {
  textContent = '';
  constructor(textContent) {
    this.textContent = textContent ?? '';
  }
  toParentNode() {
    return this.textContent;
  }
}