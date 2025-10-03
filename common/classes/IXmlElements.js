import { ixmlQuoted } from "../utils/misc.js";

export class IXmlElement {
  textContent = '';
  toParentNode() {
    return this.textContent;
  }
  appendChild(node) {
    this.textContent += node.toParentNode(this);
  }
  setAttributeNS(namespaceURI, qualifiedName, value) {
    this[`$$${qualifiedName}`] = value;
  }
}

export class IXmlElementIxml extends IXmlElement {
  appendChild(node) {
    this.textContent += (node instanceof IXmlElementComment ? ' ' : this.textContent && '\n') + node.toParentNode(this);
  }
}

export class IXmlElementComment extends IXmlElement {
  toParentNode() {
    return `{${this.textContent}}`;
  }
}

export class IXmlElementProlog extends IXmlElement {
  toParentNode() {
    return `ixml ${this.textContent}.`;
  }
  appendChild(node) {
    this.textContent += (this.textContent && ' ') + node.toParentNode(this);
  }
}

export class IXmlElementVersion extends IXmlElement {
  toParentNode() {
    return `version ${ixmlQuoted(this.$$string)}`;
  }
}

export class IXmlElementRule extends IXmlElement {
  toParentNode() {
    return `${this.$$mark ?? ''}${this.$$name}${this.$$alias ? `>${this.$$alias}` : ''}: ${this.textContent}.`;
  }
  appendChild(node) {
    this.textContent += (this.textContent && '; ') + node.toParentNode(this);
  }
}

export class IXmlElementAlts extends IXmlElement {
  toParentNode() {
    return `(${this.textContent})`;
  }
  appendChild(node) {
    this.textContent += (this.textContent && '; ') + node.toParentNode(this);
  }
}

export class IXmlElementAlt extends IXmlElement {
  appendChild(node) {
    this.textContent += (this.textContent && ', ') + node.toParentNode(this);
  }
}

export class IXmlElementOption extends IXmlElement {
  toParentNode() {
    return `${this.textContent}?`;
  }
}

export class IXmlElementRepeat0 extends IXmlElement {
  constructor() {
    super();
    this.hasSeparator = false;
  }
  toParentNode() {
    return this.textContent + (this.hasSeparator ? '' : '*');
  }
  appendChild(node) {
    this.textContent += (node instanceof IXmlElementSep ? '**' : '') + node.toParentNode(this);
    this.hasSeparator = node instanceof IXmlElementSep;
  }
}

export class IXmlElementRepeat1 extends IXmlElement {
  constructor() {
    super();
    this.hasSeparator = false;
  }
  toParentNode() {
    return this.textContent + (this.hasSeparator ? '' : '+');
  }
  appendChild(node) {
    this.textContent += (node instanceof IXmlElementSep ? '++' : '') + node.toParentNode(this);
    this.hasSeparator = node instanceof IXmlElementSep;
  }
}

export class IXmlElementSep extends IXmlElement {}

export class IXmlElementLiteral extends IXmlElement {
  toParentNode() {
    return (this.$$tmark ?? '') + (this.$$string ? ixmlQuoted(this.$$string) : `#${this.$$hex}`);
  }
}

export class IXmlElementInclusion extends IXmlElement {
  toParentNode() {
    return `${this.$$tmark ?? ''}[${this.textContent}]`;
  }
  appendChild(node) {
    this.textContent += (this.textContent && '; ') + node.toParentNode(this);
  }
}

export class IXmlElementExclusion extends IXmlElement {
  toParentNode() {
    return `${this.$$tmark ?? ''}~[${this.textContent}]`;
  }
  appendChild(node) {
    this.textContent += (this.textContent && '; ') + node.toParentNode(this);
  }
}

export class IXmlElementMember extends IXmlElement {
  toParentNode() {
    return this.$$string ? ixmlQuoted(this.$$string) : this.$$hex ? `#${this.$$hex}` : this.$$from ? `${this.$$from.startsWith('#') ? this.$$from : ixmlQuoted(this.$$from)}-${this.$$to.startsWith('#') ? this.$$to : ixmlQuoted(this.$$to)}` : this.$$code;
  }
}

export class IXmlElementNonterminal extends IXmlElement {
  toParentNode() {
    return `${this.$$mark ?? ''}${this.$$name}${this.$$alias ? `>${this.$$alias}` : ''}`;
  }
}

export class IXmlElementInsertion extends IXmlElement {
  toParentNode() {
    return `+${this.$$string ? ixmlQuoted(this.$$string) : this.$$hex}`;
  }
}

export const IXmlElements = {
  "IXmlElementIxml": IXmlElementIxml,
  "IXmlElementComment": IXmlElementComment,
  "IXmlElementProlog": IXmlElementProlog,
  "IXmlElementVersion": IXmlElementVersion,
  "IXmlElementRule": IXmlElementRule,
  "IXmlElementAlts": IXmlElementAlts,
  "IXmlElementAlt": IXmlElementAlt,
  "IXmlElementOption": IXmlElementOption,
  "IXmlElementRepeat0": IXmlElementRepeat0,
  "IXmlElementRepeat1": IXmlElementRepeat1,
  "IXmlElementSep": IXmlElementSep,
  "IXmlElementLiteral": IXmlElementLiteral,
  "IXmlElementInclusion": IXmlElementInclusion,
  "IXmlElementExclusion": IXmlElementExclusion,
  "IXmlElementMember": IXmlElementMember,
  "IXmlElementNonterminal": IXmlElementNonterminal,
  "IXmlElementInsertion": IXmlElementInsertion
};