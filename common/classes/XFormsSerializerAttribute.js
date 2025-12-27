import { xhtmlURI, eventsURI, svgURI } from "../utils/constants.js";

const reservedHtmlAttributes = new Set([
  'class',
  'id',
  'style',
  'autocomplete'
]);

export class XFormsSerializerAttribute {
  constructor(namespaceURI, qualifiedName, value, element) {
    if (value.includes('{') && (element.namespaceURI === xhtmlURI || element.namespaceURI === svgURI)) {
      if (!element.avt) {
        element.setAttribute('xf-avt', '');
        element.avt = true;
      }
      qualifiedName = 'xf-template-' + qualifiedName;
    }
    if (element.nodeName.startsWith('xforms-')) {
      if (namespaceURI === null) {
        if (!reservedHtmlAttributes.has(qualifiedName)) {
          qualifiedName = 'xf-' + (qualifiedName === 'nodeset' ? 'ref' : qualifiedName);
        }
      } else if (namespaceURI === eventsURI) {
        const parts = qualifiedName.split(':');
        qualifiedName = 'ev-' + (parts.length > 1 ? parts[1] : parts[0]);
        namespaceURI = null;
      }
    }
    this.nodeName = qualifiedName;
    if (namespaceURI) {
      this.namespaceURI = namespaceURI;
      const parts = qualifiedName.split(':');
      this.prefix = parts.length > 1 ? parts[0] : '';
      this.localName = parts.length > 1 ? parts[1] : parts[0];
    } else {
      this.namespaceURI = null;
      this.prefix = '';
      this.localName = qualifiedName;
    }
    this.name = qualifiedName;
    this.value = value;
  }
}