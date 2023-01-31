"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_seconds$_from$_dateTime_1 = function() {
  if (this.item.isNotEmpty()) {
    const res = new Fleur.Text();
    res.data = String(parseFloat(this.data.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/)[1]));
    res.schemaTypeInfo = Fleur.Type_decimal;
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["seconds-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-dateTime", Fleur.Context.prototype.fn_seconds$_from$_dateTime_1,
  [Fleur.SequenceType_dateTime_01], Fleur.SequenceType_decimal_01);
/*
  function(arg) {
    return arg !== null ? parseFloat(arg.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/)[1]) : null;
  },
  null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_decimal, occurence: "?"});
*/