"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_codepoints$_to$_string_1 = function() {
  const newitem = new Fleur.Text();
  newitem.schemaTypeInfo = Fleur.Type_string;
  if (this.item.isEmpty()) {
    newitem.appendData("");
  } else if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE) {
    newitem.appendData(this.item.childNodes.reduce((a, c) => {
      return a + String.fromCodePoint(Number(c.data));
    }, ""));
  } else {
    newitem.appendData(String.fromCodePoint(Number(this.item.data)));
  }
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["codepoints-to-string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:codepoints-to-string", Fleur.Context.prototype.fn_codepoints$_to$_string_1,
  [Fleur.SequenceType_codepoint_0n], Fleur.SequenceType_string_1);
/*
function(arg) {
    if (arg === null) {
      return "";
    }
    if (arg instanceof Array) {
      try {
        return arg.reduce(function(a, v) {
          if (v < 1 || v > 655535) {
            var e = new Error("codepoints-to-string(): the input contains an integer that is not the codepoint of a valid XML character");
            e.name = "FOCH0001";
            throw e;
          }
          return a + String.fromCodePoint(Number(v));
        }, "");
      } catch(err) {
        return err;
      }
    }
    if (arg < 1 || arg > 655535) {
      var e = new Error("codepoints-to-string(): the input contains an integer that is not the codepoint of a valid XML character");
      e.name = "FOCH0001";
      return e;
    }
    return String.fromCodePoint(Number(arg));
  },
  null, [{type: Fleur.Type_integer, occurence: "*"}], false, false, {type: Fleur.Type_string});
*/