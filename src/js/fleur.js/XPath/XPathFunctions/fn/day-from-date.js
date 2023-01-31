"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_day$_from$_date_1 = function() {
  if (this.item.isNotEmpty()) {
    const res = new Fleur.Text();
    res.data = String(parseInt(this.item.data.match(/^\d{4}-\d{2}-(\d{2})(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10));
    res.schemaTypeInfo = Fleur.Type_integer;
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["day-from-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:day-from-date", Fleur.Context.prototype.fn_day$_from$_date_1,
  [Fleur.SequenceType_date_01], Fleur.SequenceType_integer_01);
/*
  function(arg) {
    return arg !== null ? parseInt(arg.match(/^\d{4}-\d{2}-(\d{2})(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
  },
  null, [{type: Fleur.Type_date, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
*/