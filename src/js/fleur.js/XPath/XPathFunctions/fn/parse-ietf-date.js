"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_parse$_ietf$_date_1 = function() {
  if (this.item.isNotEmpty()) {
    const d = new Date(this.item.data);
    const dtz = {
      d: d,
      tz: d.getTimezoneOffset() 
    };
    const res = new Fleur.Text();
    res.data = Fleur.dateToDateTime(dtz);
    res.schemaTypeInfo = Fleur.Type_dateTime;
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["parse-ietf-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-ietf-date", Fleur.Context.prototype.fn_parse$_ietf$_date_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_dateTime_01);
/*
  function(value) {
    return value ? new Date(value) : null;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_dateTime});
*/