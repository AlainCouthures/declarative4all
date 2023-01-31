"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_has$_children_0 = function() {
  return this.current().fn_has$_children_1();
};
Fleur.Context.prototype.fn_has$_children_1 = function() {
  const node = this.item;
  const newitem = new Fleur.Text();
  newitem.data = "false";
  newitem.schemaTypeInfo = Fleur.Type_boolean;
  if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
    Fleur.XQueryError_xqt("XPTY0004", null, "Invalid parameter");
  }
  if (node.nodeType !== Fleur.Node.SEQUENCE_NODE && node.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
    newitem.data = String(node.childNodes && node.childNodes.length !== 0);
  }
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["has-children#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:has-children", Fleur.Context.prototype.fn_has$_children_0,
  [], Fleur.SequenceType_boolean_1);

Fleur.XPathFunctions_fn["has-children#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:has-children", Fleur.Context.prototype.fn_has$_children_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_boolean_1);
/*
  function(ctx) {
    return Fleur.XPathFunctions_fn["has-children#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_boolean});
*/
/*
  function(node) {
    if (node === null) {
      return false;
    }
    if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
      var e = new Error("");
      e.name = "XPTY0004";
      return e;
    }
    if (node.nodeType !== Fleur.Node.SEQUENCE_NODE && node.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
      return node.childNodes && node.childNodes.length !== 0;
    }
    return false;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
*/