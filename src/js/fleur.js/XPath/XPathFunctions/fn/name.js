"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_name_0 = function() {
  return this.current().fn_name_1();
};
Fleur.Context.prototype.fn_name_1 = function() {
  const node = this.item;
  if (node.isNotEmpty()) {
    const newitem = new Fleur.Text("");
    newitem.schemaTypeInfo = Fleur.Type_string;
    if (node.nodeType !== Fleur.Node.DOCUMENT_NODE && node.nodeType !== Fleur.Node.COMMENT_NODE && node.nodeType !== Fleur.Node.TEXT_NODE) {
      newitem.data = node.nodeName;
    }
    this.item = newitem;
  }
  return this;
};

Fleur.XPathFunctions_fn["name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:name", Fleur.Context.prototype.fn_name_0,
  [], Fleur.SequenceType_string_01);

Fleur.XPathFunctions_fn["name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:name", Fleur.Context.prototype.fn_name_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_string_01);
/*  function(ctx) {
    if (ctx._curr === null) {
      return null;
    }
    if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
      return "";
    }
    return ctx._curr.nodeName;
  },
  null, [], true, false, {type: Fleur.Type_string});
*/
/*
  function(node) {
    if (node === null) {
      return null;
    }
    if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
      return "";
    }
    return node.nodeName;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/