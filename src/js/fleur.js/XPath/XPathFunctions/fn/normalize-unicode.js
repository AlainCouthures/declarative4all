"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_normalize$_unicode_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    res.data = this.item.data.normalize();
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};
Fleur.Context.prototype.fn_normalize$_unicode_2 = function() {
  const res = new Fleur.Text();
  const arg = this.itemstack.pop();
  if (arg.isNotEmpty()) {
    const normalizationForm = this.item.data.toUpperCase().trim();
    res.data = "";
    if (normalizationForm === "") {
      res.data = arg.data;
    } else {
      try {
        res.data = arg.data.normalize(normalizationForm);
      } catch(e) {
        res.data = arg.data;
      }
    }
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["normalize-unicode#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-unicode", Fleur.Context.prototype.fn_normalize$_unicode_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["normalize-unicode#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-unicode", Fleur.Context.prototype.fn_normalize$_unicode_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_1);
/*
  function(arg) {
    if (!arg) {
      return "";
    }
    return arg.normalize();
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/
/*
  function(arg, normalizationForm) {
    if (!arg) {
      return "";
    }
    normalizationForm = normalizationForm.toUpperCase().trim();
    if (normalizationForm === "") {
      return arg;
    }
    try {
      return arg.normalize(normalizationForm);
    } catch(e) {
      return arg;
    }
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
*/