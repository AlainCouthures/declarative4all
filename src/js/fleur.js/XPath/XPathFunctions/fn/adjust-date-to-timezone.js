"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_adjust$_date$_to$_timezone_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_date,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_date,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_dayTimeDuration,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.fn_adjust$_date$_to$_timezone_1 = function() {
  if (this.item.isNotEmpty()) {
    var dt = Fleur.toDate(this.item.data);
    var jstz = dt.d.getTimezoneOffset();
    this.itemstack.push(this.item);
    this.item = new Fleur.Text();
    this.item.data = Fleur.msToDayTimeDuration(-jstz * 60 * 1000);
    this.item.schemaTypeInfo = Fleur.Type_dayTimeDuration;
    this.fn_adjust$_dateTime$_to$_timezone_2(true);
  }
  return this;
};
Fleur.Context.prototype.fn_adjust$_date$_to$_timezone_2 = function() {
  this.fn_adjust$_dateTime$_to$_timezone_2(true);
  return this;
};

Fleur.XPathFunctions_fn["adjust-date-to-timezone#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-date-to-timezone",
  function(arg) {
    if (arg === null) {
      return null;
    }
    var dt = Fleur.toDate(arg);
    var jstz = dt.d.getTimezoneOffset();
    var timezone = {
      sign: jstz < 0 ? 1 : -1,
      day: 0,
      hour: Math.floor(Math.abs(jstz) / 60),
      minute: Math.abs(jstz) % 60,
      second: 0
    };
    return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}], false, false, {type: Fleur.Type_date, occurence: "?"});

Fleur.XPathFunctions_fn["adjust-date-to-timezone#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-date-to-timezone",
  function(arg, timezone) {
    return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_dayTimeDuration, occurence: "?"}], false, false, {type: Fleur.Type_date, occurence: "?"});