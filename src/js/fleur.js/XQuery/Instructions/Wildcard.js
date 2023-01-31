"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_Wildcard = function(children) {
  if (children.length === 2) {
    if (children[1][0] === Fleur.XQueryX.NCName) {
      return this.inst("xqx_Wildcard_localName(\"" + children[1][1][0] + "\")");
    }
    if (children[0][0] === Fleur.XQueryX.NCName) {
      return this.inst("xqx_Wildcard_prefix(\"" + children[0][1][0] + "\")");
    }
    return this.inst("xqx_Wildcard_namespaceURI(\"" + children[0][1][0] + "\")");
  }
  return this.inst("xqx_Wildcard()");
};

Fleur.Context.prototype.xqx_Wildcard = function() {
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, null, null);
};

Fleur.Context.prototype.xqx_Wildcard_localName = function(localName) {
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, null, localName);
};

Fleur.Context.prototype.xqx_Wildcard_namespaceURI = function(namespaceURI) {
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, namespaceURI, null);
};

Fleur.Context.prototype.xqx_Wildcard_prefix = function(prefix) {
  const namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, namespaceURI, null);
};

Fleur.XQueryEngine[Fleur.XQueryX.Wildcard] = function(ctx, children, callback) {
  if (children[0]) {
    if (children[0][0] === Fleur.XQueryX.star && children[1][0] === Fleur.XQueryX.NCName) {
      if (ctx._curr.localName !== children[1][1][0]) {
        Fleur.callback(function() {callback(Fleur.EmptySequence);});
        return;
      }
    }
  }
  Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE && ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE && ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);});
};