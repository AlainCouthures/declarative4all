"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_timezone$_from$_dateTime_1 = function(nodate, notime) {
  if (this.item.isNotEmpty()) {
    let dt;
    if (notime) {
      dt = Fleur.toDate(this.item);
    } else if (nodate) {
      dt = Fleur.toTime(this.item);
    } else {
      dt = Fleur.toDateTime(this.item);
    }
    if (dt.tz === null) {
      this.item = new Fleur.Sequence();
    } else {
      const res = new Fleur.Text();
      res.schemaTypeInfo = Fleur.Type_dayTimeDuration;
      res.data = Fleur.msToDayTimeDuration(dt.tz * 60 * 1000);
      this.item = res;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["timezone-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-datTime", Fleur.Context.prototype.fn_timezone$_from$_dateTime_1,
  [Fleur.SequenceType_dateTime_01], Fleur.SequenceType_dayTimeDuration_01);
/*
  function(arg, nodate, notime) {
    var dt;
    if (arg === null) {
      return null;
    }
    if (notime) {
      dt = Fleur.toDate(arg);
    } else if (nodate) {
      dt = Fleur.toTime(arg);
    } else {
      dt = Fleur.toDateTime(arg);
    }
    if (dt.tz === null) {
      return null;
    }
    var a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_dayTimeDuration;
    a.data = Fleur.msToDayTimeDuration(dt.tz * 60 * 1000);
    return a;
  },
  null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
*/