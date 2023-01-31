"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.Context.prototype.fn_id_1 = function() {
  return this.current().fn_id_2();
};
Fleur.Context.prototype.fn_id_2 = function() {
  let node = this.item;
  const arg = this.itemstack.pop();
  node = node.ownerDocument || node;
  let elts;
  if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
    var res = [];
    arg.childNodes.forEach(function(id) {
      var elt = node.getElementById(id);
      if (elt) {
        res.push(elt);
      }
    });
    elts =  res.length === 0 ? null : res.length === 1 ? res[0] : node.sortNodes(res);
  } else {
    elts =  node.getElementById(arg);
  }
  if (elts) {
    if (elts instanceof Array) {
      this.item = new Fleur.Sequence();
      this.item.childNodes = elts;
    } else {
      this.item = elts;
    }
  } else {
    this.item = new Fleur.Sequence();
  }
  return this;
};

Fleur.XPathFunctions_fn["id#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:id", Fleur.Context.prototype.fn_id_1,
  [Fleur.SequenceType_string_0n], Fleur.SequenceType_element_0n);

Fleur.XPathFunctions_fn["id#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:id", Fleur.Context.prototype.fn_id_2,
  [Fleur.SequenceType_string_0n, Fleur.SequenceType_item_1], Fleur.SequenceType_element_0n);
/*
  function(arg, ctx) {
    return Fleur.XPathFunctions_fn["id#2"].jsfunc(arg, ctx._curr);
  },
  null, [{type: Fleur.Type_string, occurence: "*"}], true, false, {type: Fleur.Node, occurence: "*"});
*/
/*

  function(arg, node) {
    if (!arg || !node || (!node.ownerDocument && node.nodeType !== Fleur.Node.DOCUMENT_NODE)) {
      return null;
    }
    node = node.ownerDocument || node;
    if (arg instanceof Array) {
      var res = [];
      arg.forEach(function(id) {
        var elt = node.getElementById(id);
        if (elt) {
          res.push(elt);
        }
      });
      return res.length === 0 ? null : res.length === 1 ? res[0] : node.sortNodes(res);
    }
    return node.getElementById(arg);
  },
  null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Node}], false, false, {type: Fleur.Node, occurence: "*"});
*/