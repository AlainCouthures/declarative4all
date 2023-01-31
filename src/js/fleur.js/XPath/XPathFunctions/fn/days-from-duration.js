"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_days$_from$_duration_1 = function() {
  if (this.item.isNotEmpty()) {
    const a = this.item;
    let signedd = 0;
    if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
      const d = Fleur.toJSONDayTimeDuration(a.data);
      signedd = d.sign * d.day;
    }
    if (a.schemaTypeInfo !== Fleur.Type_yearMonthDuration) {
      const d = Fleur.toJSONDuration(a.data);
      signedd = d.sign * d.day;
    }
    const res = new Fleur.Text();
    res.schemaTypeInfo = Fleur.Type_integer;
    res.data = Number(signedd);
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["days-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:days-from-duration", Fleur.Context.prototype.fn_days$_from$_duration_1,
  [Fleur.SequenceType_duration_01], Fleur.SequenceType_integer_01);
/*
  function(arg) {
    var a = Fleur.Atomize(arg);
    var d;
    if (a === Fleur.EmptySequence) {
      return null;
    }
    if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
      return 0;
    }
    if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
      d = Fleur.toJSONDayTimeDuration(a.data);
      return d.sign * d.day;
    }
    if (a.schemaTypeInfo === Fleur.Type_duration) {
      d = Fleur.toJSONDuration(a.data);
      return d.sign * d.day;
    }
    var e = new Error("");
    e.name = "XPTY0004";
    return e;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
*/