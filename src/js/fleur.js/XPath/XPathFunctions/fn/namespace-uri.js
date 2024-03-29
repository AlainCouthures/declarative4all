"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_namespace$_uri_0 = function() {
  return this.current().fn_namespace$_uri_1();
};
Fleur.Context.prototype.fn_namespace$_uri_1 = function() {
  const node = this.item;
  if (node.isNotEmpty()) {
    const newitem = new Fleur.Text("");
    newitem.schemaTypeInfo = Fleur.Type_string;
    if (node.nodeType !== Fleur.Node.DOCUMENT_NODE && node.nodeType !== Fleur.Node.COMMENT_NODE && node.nodeType !== Fleur.Node.TEXT_NODE) {
      newitem.data = node.namespaceURI;
    }
    this.item = newitem;
  }
  return this;
};

Fleur.XPathFunctions_fn["namespace-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:namespace-uri", Fleur.Context.prototype.fn_namespace$_uri_0,
  [], Fleur.SequenceType_anyURI_01);

Fleur.XPathFunctions_fn["namespace-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:namespace-uri", Fleur.Context.prototype.fn_namespace$_uri_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_anyURI_01);
/*
  function(ctx) {
    if (ctx._curr === null) {
      return null;
    }
    if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
      return "";
    }
    return ctx._curr.namespaceURI;
  },
  null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Type_anyURI});
*/
/*
  function(node) {
    if (node === null) {
      return null;
    }
    if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
      return "";
    }
    return node.namespaceURI;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
*/