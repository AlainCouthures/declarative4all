"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_format$_time_2 = function() {
  return this.emptySequence().emptySequence().emptySequence().fn_format$_dateTime_5(true, false);
};
Fleur.Context.prototype.fn_format$_time_5 = function() {
  return this.fn_format$_dateTime_5(true, false);
};

Fleur.XPathFunctions_fn["format-time#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-time", Fleur.Context.prototype.fn_format$_time_2,
  [Fleur.SequenceType_time_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_01);
/*
function(value, picture, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, false, true);
  },
  null, [{type: Fleur.Type_time, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
*/

Fleur.XPathFunctions_fn["format-time#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-time", Fleur.Context.prototype.fn_format$_time_5,
[Fleur.SequenceType_time_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_string_01);
/*
function(value, picture, language, calendar, place, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, language, calendar, place, ctx, false, true);
  },
  null, [{type: Fleur.Type_time, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});
*/