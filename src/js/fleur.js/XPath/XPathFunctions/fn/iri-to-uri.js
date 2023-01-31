"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_iri$_to$_uri_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    res.data = this.item.data.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {
      return encodeURIComponent(c);
    });
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["iri-to-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:iri-to-uri", Fleur.Context.prototype.fn_iri$_to$_uri_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(iri) {
    return iri !== null ? iri.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {return encodeURIComponent(c);}) : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/