/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-dateTime-to-timezone",
	function(arg) {
		if (arg === null) {
			return null;
		}
		var dt = Fleur.toDateTime(arg);
		var jstz = dt.d.getTimezoneOffset();
		var timezone = {
			sign: jstz < 0 ? 1 : -1,
			day: 0,
			hour: Math.floor(Math.abs(jstz) / 60),
			minute: Math.abs(jstz) % 60,
			second: 0
		};
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, false, false);
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], false, false, {type: Fleur.Type_dateTime, occurence: "?"});

Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-dateTime-to-timezone",
	function(arg, timezone, notime, nodate) {
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
		if (timezone) {
			if (timezone.second !== 0 || timezone.day !== 0 || timezone.hour > 14 || (timezone.hour === 14 && timezone.minute !== 0)) {
				var e = new Error("");
				e.name = "FODT0003";
				return e;
			}
			if (dt.tz !== null) {
				dt.d.setHours(dt.d.getHours() + timezone.sign * timezone.hour - Math.floor(dt.tz / 60));
				dt.d.setMinutes(dt.d.getMinutes() + timezone.sign * timezone.minute - (dt.tz % 60));
			}
			dt.tz = timezone.sign * (timezone.hour * 60 + timezone.minute);
		} else {
			dt.tz = null;
		}
		var res;
		if (notime) {
			res = Fleur.dateToDate(dt);
		} else if (nodate) {
			res = Fleur.dateToTime(dt);
		} else {
			res = Fleur.dateToDateTime(dt);
		}
		return res;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_dayTimeDuration, occurence: "?"}], false, false, {type: Fleur.Type_dateTime, occurence: "?"});