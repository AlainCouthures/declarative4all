/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["adjust-time-to-timezone#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-time-to-timezone",
	function(arg) {
		if (arg === null) {
			return null;
		}
		var dt = Fleur.toTime(arg);
		var jstz = dt.d.getTimezoneOffset();
		var timezone = {
			sign: jstz < 0 ? 1 : -1,
			day: 0,
			hour: Math.floor(Math.abs(jstz) / 60),
			minute: Math.abs(jstz) % 60,
			second: 0
		};
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Type_time, occurence: "?"});

Fleur.XPathFunctions_fn["adjust-time-to-timezone#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-time-to-timezone",
	function(arg, timezone) {
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}, {type: Fleur.Type_dayTimeDuration, occurence: "?"}], false, false, {type: Fleur.Type_time, occurence: "?"});