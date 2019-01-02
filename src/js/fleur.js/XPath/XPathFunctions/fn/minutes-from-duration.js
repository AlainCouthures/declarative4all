/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["minutes-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:minutes-from-duration",
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
			return d.sign * d.minute;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});