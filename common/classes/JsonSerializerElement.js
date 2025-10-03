export class JsonSerializerElement {
  textContent = '';
  attributes = '';
  childNodes = '';
  ownerDocument = null;
  constructor(namespaceURI, qualifiedName, indent) {
    const [prefix, localName] = namespaceURI && qualifiedName.includes(':')
      ? qualifiedName.split(':')
      : [null, qualifiedName];
    this.textContent = [
      `"nodeType": 1,`,
      `"nodeName": "${qualifiedName}",`,
      `"namespaceURI": ${JSON.stringify(namespaceURI || null)},`,
      `"prefix": ${JSON.stringify(prefix)},`,
      `"localName": "${localName}"`
    ].join(indent ? '\n' : ' ');
  }
  setAttributeNS(namespaceURI, qualifiedName, value) {
    const [prefix, localName] = namespaceURI && qualifiedName.includes(':')
      ? qualifiedName.split(':')
      : [null, qualifiedName];
    const { indent } = this.ownerDocument;
    let body = [
      `"nodeType": 2,`,
      `"nodeName": "${qualifiedName}",`,
      `"namespaceURI": ${JSON.stringify(namespaceURI || null)},`,
      `"prefix": ${JSON.stringify(prefix)},`,
      `"localName": "${localName}",`,
      `"value": ${JSON.stringify(value)}`
    ].join(indent ? '\n' : ' ');
    if (indent) {
      const spaces = ' '.repeat(indent);
      body = `\n${spaces}${body.replaceAll('\n', `\n${spaces}`)}\n${spaces}`;
      this.attributes += `${this.attributes ? ',\n' : '\n'}${spaces}{${body}}`;
    } else {
      this.attributes += `${this.attributes ? ', ' : ''}{${body}}`;
    }
  }
  appendChild(node) {
    const ser = node.toParentNode(this);
    const { indent } = this.ownerDocument;
    if (indent) {
      const spaces = ' '.repeat(this.ownerDocument.indent);
      this.childNodes += `${this.childNodes ? ',\n' : '\n'}${spaces}${ser.replaceAll('\n', `\n${spaces}`)}`;
    } else {
      this.childNodes += `${this.childNodes ? ', ' : ''}${ser}`;
      }
  }
  toParentNode() {
    const { indent } = this.ownerDocument;
    const shortsep = indent ? '\n' : '';
    let body = [
      `${shortsep}${this.textContent},`,
      `"attributes": [${this.attributes ? this.attributes + shortsep : ''}],`,
      `"childNodes": [${this.childNodes ? this.childNodes + shortsep : ''}]`
    ].join(indent ? "\n" : " ");
    if (indent) {
      const spaces = " ".repeat(indent);
      body = body.replaceAll('\n', `\n${spaces}`);
    }
    return `{${body}${shortsep}}`;
  }
}