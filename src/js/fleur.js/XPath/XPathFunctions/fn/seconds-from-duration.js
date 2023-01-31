"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_seconds$_from$_dateTime_1 = function() {
  if (this.item.isNotEmpty()) {
    const a = this.item;
    let signedd = 0;
    if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
      const d = Fleur.toJSONDayTimeDuration(a.data);
      signedd = d.sign * d.second;
    }
    if (a.schemaTypeInfo !== Fleur.Type_yearMonthDuration) {
      const d = Fleur.toJSONDuration(a.data);
      signedd = d.sign * d.second;
    }
    const res = new Fleur.Text();
    res.schemaTypeInfo = Fleur.Type_decimal;
    res.data = Number(signedd);
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["seconds-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-duration", Fleur.Context.prototype.fn_seconds$_from$_dateTime_1,
  [Fleur.SequenceType_duration_01], Fleur.SequenceType_decimal_01);
/*
  function(arg) {
    var a = Fleur.Atomize(arg);
    if (a === Fleur.EmptySequence) {
      return null;
    }
    if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
      return 0;
    }
    if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
      var d = Fleur.toJSONDayTimeDuration(a.data);
      return d.sign * d.second;
    }
    var e = new Error("");
    e.name = "XPTY0004";
    return e;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_decimal, occurence: "?"});
*/