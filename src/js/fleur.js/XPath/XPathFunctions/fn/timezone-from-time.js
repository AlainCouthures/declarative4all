"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_timezone$_from$_time_1 = function() {
  return this.fn_timezone$_from$_date_1(false, true);
};

Fleur.XPathFunctions_fn["timezone-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-time", Fleur.Context.prototype.fn_timezone$_from$_time_1,
  [Fleur.SequenceType_time_01], Fleur.SequenceType_dayTimeDuration_1);
/*
  function(arg) {
    return Fleur.XPathFunctions_fn["timezone-from-dateTime#1"].jsfunc(arg, false, true);
  },
  null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
*/