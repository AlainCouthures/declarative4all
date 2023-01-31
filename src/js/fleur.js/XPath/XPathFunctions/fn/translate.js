"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_translate_3 = function() {
  const arg3 = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg1.isNotEmpty()) {
    const tl = arg3.data.length;
    let sres = "";
    for (let i = 0, l = arg1.data.length; i < l; i++) {
      const j = arg2.data.indexOf(arg1.data.charAt(i));
      if (j !== -1) {
        if (j < tl) {
          sres += arg3.data.charAt(j);
        }
      } else {
        sres += arg1.data.charAt(i);
      }
    }
    res.data = sres;
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["translate#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:translate", Fleur.Context.prototype.fn_translate_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_1], Fleur.SequenceType_string_01);
/*
  function(arg, mapString, transString) {
    var res = "", i, j, l, tl = transString.length;
    if (arg === null) {
      return "";
    }
    for (i = 0, l = arg.length; i < l; i++) {
      j = mapString.indexOf(arg.charAt(i));
      if (j !== -1) {
        if (j < tl) {
          res += transString.charAt(j);
        }
      } else {
        res += arg.charAt(i);
      }
    }
    return res;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
*/