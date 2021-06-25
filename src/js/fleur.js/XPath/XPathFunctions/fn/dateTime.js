"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_dateTime_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_dateTime,
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
      schemaTypeInfo: Fleur.Type_time,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["dateTime#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:dateTime",
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