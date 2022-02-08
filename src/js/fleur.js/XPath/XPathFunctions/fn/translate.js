"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_translate_3 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    }
  ]
};

Fleur.Context.prototype.fn_translate_3 = function() {
  const arg3 = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  if (arg1.isNotEmpty()) {
    const tl = arg3.data.length;
    let res = "";
    for (let i = 0, l = arg1.data.length; i < l; i++) {
      const j = arg2.data.indexOf(arg1.data.charAt(i));
      if (j !== -1) {
        if (j < tl) {
          res += arg3.data.charAt(j);
        }
      } else {
        res += arg1.data.charAt(i);
      }
    }
    this.item.data = res;
  } else {
    this.item = new Fleur.Text();
    this.item.data = "";
  }
  this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};

Fleur.XPathFunctions_fn["translate#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:translate",
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