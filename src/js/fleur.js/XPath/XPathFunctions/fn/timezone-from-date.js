"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_timezone$_from$_date_1 = function() {
  return this.fn_timezone$_from$_date_1(true, false);
};

Fleur.XPathFunctions_fn["timezone-from-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-date", Fleur.Context.prototype.fn_timezone$_from$_date_1,
  [Fleur.SequenceType_date_01], Fleur.SequenceType_dayTimeDuration_01);
/*
  function(arg) {
    return Fleur.XPathFunctions_fn["timezone-from-dateTime#1"].jsfunc(arg, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
*/