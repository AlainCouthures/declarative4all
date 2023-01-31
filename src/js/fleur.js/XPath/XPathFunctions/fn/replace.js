"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_replace_3 = function() {
  return this.emptySequence().fn_replace_4();
};
Fleur.Context.prototype.fn_replace_4 = function() {
  const flags = this.item;
  const replacement = this.itemstack.pop();
  const pattern = this.itemstack.pop();
  const input = this.itemstack.pop();
  this.item = new Fleur.Text("");
  this.item.schemaTypeInfo = Fleur.Type_string;
  if (input.isNotEmpty()) {
    try {
      const re = new RegExp(pattern.data, flags.isNotEmpty() ? flags.data + "g" : "g");
      this.item.data = input.data.replace(re, replacement.data);
    } catch (e) {
      this.item.data = input.data;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["replace#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:replace", Fleur.Context.prototype.fn_replace_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_1], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["replace#4"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:replace", Fleur.Context.prototype.fn_replace_4,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_1, Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(input, pattern, replacement) {
    return Fleur.XPathFunctions_fn["replace#4"].jsfunc(input, pattern, replacement);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
*/
/*
  function(input, pattern, replacement, flags) {
      input = input || "";
      flags = (flags || "") + "g";
      try {
        var re = new RegExp(pattern, flags);
        return input.replace(re, replacement);
      } catch (e) {
        return input;
      }
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/