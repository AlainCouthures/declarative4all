/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["timezone-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-datTime",
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