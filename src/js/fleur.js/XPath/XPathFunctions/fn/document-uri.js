"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_document$_uri_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData("urn:from-string");
  item.schemaTypeInfo = Fleur.Type_anyURI;
  this.item = item;
  return this;
};
Fleur.Context.prototype.fn_document$_uri_1 = function() {
  const item = new Fleur.Text();
  item.appendData("urn:from-string");
  item.schemaTypeInfo = Fleur.Type_anyURI;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["document-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:document-uri", Fleur.Context.prototype.fn_document$_uri_0,
  [], Fleur.SequenceType_anyURI_01, {dynonly: true});

Fleur.XPathFunctions_fn["document-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:document-uri", Fleur.Context.prototype.fn_document$_uri_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_anyURI_01, {dynonly: true});
/*  function(ctx) {
    return Fleur.XPathFunctions_fn["document-uri#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_anyURI});
*/
/*
  function(node) {
    if (node === Fleur.EmptySequence) {
      return null;
    }
    if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
      var e = new Error("");
      e.name = "XPTY0004";
      return e;
    }
    return "";
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
*/