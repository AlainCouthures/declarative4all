"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_dateTime_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  if (arg1.isEmpty()) {
    this.item = arg1;
  } else if (!arg2.isEmpty()) {
    const res = new Fleur.Text();
    const dt = Fleur.toDate(arg1.data);
    const tm = Fleur.toTime(arg2.data);
    if (dt.tz === null) {
      dt.tz = tm.tz;
    } else if (dt.tz !== tm.tz && tm.tz !== null) {
      Fleur.XQueryError_xqt("FORG0008", null, "Different time zones");
    }
    dt.d.setHours(tm.d.getHours());
    dt.d.setMinutes(tm.d.getMinutes());
    dt.d.setSeconds(tm.d.getSeconds());
    dt.d.setMilliseconds(tm.d.getMilliseconds());
    res.schemaTypeInfo = Fleur.Type_dateTime;
    res.data = Fleur.dateToDateTime(dt);
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["dateTime#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:dateTime", Fleur.Context.prototype.fn_dateTime_2,
  [Fleur.SequenceType_date_01, Fleur.SequenceType_time_01], Fleur.SequenceType_dateTime_01);
/*
  function(arg1, arg2) {
    if (arg1 === null || arg2 === null) {
      return null;
    }
    var dt = Fleur.toDate(arg1);
    var tm = Fleur.toTime(arg2);
    if (dt.tz === null) {
      dt.tz = tm.tz;
    } else if (dt.tz !== tm.tz && tm.tz !== null) {
      var e = new Error();
      e.name = "FORG0008";
      return e;
    }
    dt.d.setHours(tm.d.getHours());
    dt.d.setMinutes(tm.d.getMinutes());
    dt.d.setSeconds(tm.d.getSeconds());
    dt.d.setMilliseconds(tm.d.getMilliseconds());
    return Fleur.dateToDateTime(dt);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Type_dateTime, occurence: "?"});
*/