"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_encode$_for$_uri_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    res.data = encodeURIComponent(this.item.data).replace(/[!'()*]/g, function(c) {return '%' + c.charCodeAt(0).toString(16).toUpperCase();});
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["encode-for-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:encode-for-uri", Fleur.Context.prototype.fn_encode$_for$_uri_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(uripart) {
    return uripart !== null ? encodeURIComponent(uripart).replace(/[!'()*]/g, function(c) {return '%' + c.charCodeAt(0).toString(16).toUpperCase();}) : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/