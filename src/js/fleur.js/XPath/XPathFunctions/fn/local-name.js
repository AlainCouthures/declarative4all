"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_local$_name_0 = function() {
  return this.current().fn_local$_name_1();
};
Fleur.Context.prototype.fn_local$_name_1 = function() {
  const node = this.item;
  if (node.isNotEmpty()) {
    const newitem = new Fleur.Text("");
    newitem.schemaTypeInfo = Fleur.Type_string;
    if (node.nodeType !== Fleur.Node.DOCUMENT_NODE && node.nodeType !== Fleur.Node.COMMENT_NODE && node.nodeType !== Fleur.Node.TEXT_NODE) {
      newitem.data = node.localName;
    }
    this.item = newitem;
  }
  return this;
};

Fleur.XPathFunctions_fn["local-name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:local-name", Fleur.Context.prototype.fn_local$_name_0,
  [], Fleur.SequenceType_string_01);

Fleur.XPathFunctions_fn["local-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:local-name", Fleur.Context.prototype.fn_local$_name_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_string_01);
/*
  function(ctx) {
    if (ctx._curr === Fleur.EmptySequence) {
      return null;
    }
    if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
      return "";
    }
    return ctx._curr.localName;
  },
  null, [], true, false, {type: Fleur.Type_string});
*/
/*
  function(node) {
    if (node === Fleur.EmptySequence) {
      return null;
    }
    if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
      return "";
    }
    return node.localName;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/