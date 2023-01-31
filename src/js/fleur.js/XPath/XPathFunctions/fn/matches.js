"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_matches_2 = function() {
  return this.emptySequence().fn_matches_3();
};
Fleur.Context.prototype.fn_matches_3 = function() {
  const flags = this.item;
  const pattern = this.itemstack.pop();
  const input = this.itemstack.pop();
  const inputdata = input.data || "";
  const flagsdata = flags.data || "";
  const newitem = new Fleur.Text("false");
  try {
    var re = new RegExp(pattern.data, flagsdata);
    newitem.data = String(re.test(inputdata));
  } catch (e) {}
  newitem.schemaTypeInfo = Fleur.Type_boolean;
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["matches#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:matches", Fleur.Context.prototype.fn_matches_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_1);

Fleur.XPathFunctions_fn["matches#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:matches", Fleur.Context.prototype.fn_matches_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_1);
/*
  function(input, pattern) {
    return Fleur.XPathFunctions_fn["matches#3"].jsfunc(input, pattern);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
*/
/*
  function(input, pattern, flags) {
      input = input || "";
      flags = flags || "";
      try {
        var re = new RegExp(pattern, flags);
        return re.test(input);
      } catch (e) {
        return false;
      }
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
*/