"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_parse$_md_1 = function() {
  if (this.item.isNotEmpty()) {
    const parser = new Fleur.DOMParser();
    this.item = parser.parseFromString(this.item.data, "text/markdown");
  }
  return this;
};

Fleur.XPathFunctions_fn["parse-md#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-md", Fleur.Context.prototype.fn_parse$_md_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_document_01);
/*
  function(arg) {
    var parser = new Fleur.DOMParser();
    return arg !== null ? parser.parseFromString(arg, "text/markdown") : null;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
*/