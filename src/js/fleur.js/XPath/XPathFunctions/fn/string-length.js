"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_string$_length_0 = function() {
  return this.current().fn_string$_length_1();
};
Fleur.Context.prototype.fn_string$_length_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    res.data = Fleur.Type_integer.canonicalize(String(this.item.data.length));
  } else {
    res.data = "0";
  }
  res.schemaTypeInfo = Fleur.Type_integer;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["string-length#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length", Fleur.Context.prototype.fn_string$_length_0,
  [], Fleur.SequenceType_integer_1);

Fleur.XPathFunctions_fn["string-length#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length", Fleur.Context.prototype.fn_string$_length_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_integer_1);
/*
  function(ctx) {
    if (!ctx._curr) {
      return 0;
    }
    var a = Fleur.Atomize(ctx._curr);
    return a.data.length;
  },
  null, [], true, false, {type: Fleur.Type_integer});
  function(arg) {
    return !arg ? 0 : arg.length;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer});
*/