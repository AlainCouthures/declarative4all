"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_anyKindTest = function() {
  return this.inst("xqx_anyKindTest()");
};

Fleur.Context.nodeTest_ = [];

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_ANCESTOR] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if (item.ownerElement) {
    item = item.ownerElement;
    if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
      newitem.appendChild(item);
    }
  }
  while (item.parentNode) {
    item = item.parentNode;
    if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
      newitem.appendChild(item);
    }
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_ANCESTOR_OR_SELF] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
    newitem.appendChild(item);
  }
  if (item.ownerElement) {
    item = item.ownerElement;
    if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
      newitem.appendChild(item);
    }
  }
  while (item.parentNode) {
    item = item.parentNode;
    if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
      newitem.appendChild(item);
    }
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_ATTRIBUTE] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if (item.attributes) {
    item.attributes.forEach(
      it => {
        if ((namespaceURI === null || it.namespaceURI === namespaceURI) && (!localName || it.localName === localName)) {
          newitem.appendChild(it);
        }
      }
    );
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_CHILD] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if (item.childNodes) {
    item.childNodes.forEach(
      it => {
        if ((!nodeType || it.nodeType === nodeType) && (namespaceURI === null || it.namespaceURI === namespaceURI) && (!localName || it.localName === localName)) {
          newitem.appendChild(it);
        }
      }
    );
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_DESCENDANT] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
    newitem.appendDescendants(item);
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_DESCENDANT_OR_SELF] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
    newitem.appendChild(item);
    newitem.appendDescendants(item);
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_FOLLOWING] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if (item.ownerElement) {
    item = item.ownerElement;
  }
  while (item.parentNode) {
    while (item.nextSibling) {
      item = item.nextSibling;
      if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
        newitem.appendChild(item);
        newitem.appendDescendants(item);
      }
    }
    item = item.parentNode;
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_FOLLOWING_SIBLING] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  while (item.nextSibling) {
    item = item.nextSibling;
    if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
      newitem.appendChild(item);
    }
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_PARENT] = (item, nodeType, namespaceURI, localName) => {
  if (item.parentNode && (!nodeType || item.parentNode.nodeType === nodeType) && (namespaceURI === null || item.parentNode.namespaceURI === namespaceURI) && (!localName || item.parentNode.localName === localName)) {
    return item.parentNode;
  }
  if (item.ownerElement && (!nodeType || item.ownerElement.nodeType === nodeType) && (namespaceURI === null || item.ownerElement.namespaceURI === namespaceURI) && (!localName || item.ownerElement.localName === localName)) {
    return item.ownerElement;
  }
  return new Fleur.Sequence();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_PRECEDING] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  if (item.ownerElement) {
    item = item.ownerElement;
  }
  while (item.parentNode) {
    while (item.previousSibling) {
      item = item.previousSibling;
      if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
        newitem.appendDescendantsRev(item);
        newitem.appendChild(item);
      }
    }
    item = item.parentNode;
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_PRECEDING_SIBLING] = (item, nodeType, namespaceURI, localName) => {
  let newitem = new Fleur.Sequence();
  while (item.previousSibling) {
    item = item.previousSibling;
    if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
      newitem.appendChild(item);
    }
  }
  return newitem.singleton();
};

Fleur.Context.nodeTest_[Fleur.Context.XPATHAXIS_SELF] = (item, nodeType, namespaceURI, localName) => {
  if ((!nodeType || item.nodeType === nodeType) && (namespaceURI === null || item.namespaceURI === namespaceURI) && (!localName || item.localName === localName)) {
    return item;
  }
  return new Fleur.Sequence();
};

Fleur.Context.prototype.nodeTest = function(nodeType, namespaceURI, localName) {
  if (this.item.isSingle()) {
    this.item = Fleur.Context.nodeTest_[this.xpathAxis](this.item, nodeType, namespaceURI, localName);
    return this;
  }
  const seq = new Fleur.Sequence();
  seq.internals = new Set();
  const l = this.item.childNodes.length;
  const children = this.item.childNodes;
  for (let i = 0; i < l; i++) {
    const item = Fleur.Context.nodeTest_[this.xpathAxis](children[i], nodeType, namespaceURI, localName);
    seq.merge(item);
  }
  this.item = seq.singleton();
};

Fleur.Context.prototype.xqx_anyKindTest = function() {
  return this.nodeTest(null, null, null);
};

Fleur.XQueryEngine[Fleur.XQueryX.anyKindTest] = function(ctx, children, callback) {
  //console.log("anyKindTest - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
  Fleur.callback(function() {callback(ctx._curr);});
};