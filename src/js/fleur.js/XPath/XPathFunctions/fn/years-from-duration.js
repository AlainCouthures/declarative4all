/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["years-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:years-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		var d;
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			d = Fleur.toJSONYearMonthDuration(a.data);
			return d.sign * d.year;
		}
		if (a.schemaTypeInfo === Fleur.Type_duration) {
			d = Fleur.toJSONDuration(a.data);
			return d.sign * d.year;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});