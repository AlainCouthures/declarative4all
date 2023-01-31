"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_string$_to$_codepoints_1 = function() {
  if (this.item.isNotEmpty() && this.item.data !== "") {
    const arg = this.item.data;
    if (arg.length === 1) {
      const res = new Fleur.Text();
      res.data = arg.codePointAt(0);
      res.schemaTypeInfo = Fleur.Type_integer;
      this.item = res;
    } else {
      this.item = new Fleur.Sequence();
      const l = arg.length;
      for (let i = 0; i < l; i++) {
        const cp = new Fleur.Text(String(arg.codePointAt(i)));
        cp.schemaTypeInfo = Fleur.Type_integer;
        this.item.appendChild(cp);
      }
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["string-to-codepoints#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-to-codepoints", Fleur.Context.prototype.fn_string$_to$_codepoints_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_integer_0n, {dynonly: true});
/*
  function(arg) {
    if (!arg || arg === "") {
      return null;
    }
    if (arg.length === 1) {
      return arg.codePointAt(0);
    }
    var ret = [];
    var i, l;
    for (i = 0, l = arg.length; i < l; i++) {
      ret.push(arg.codePointAt(i));
    }
    return ret;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "*"});
*/