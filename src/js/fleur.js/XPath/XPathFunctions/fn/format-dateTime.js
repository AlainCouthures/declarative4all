/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["format-dateTime#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-dateTime",
	function(value, picture, ctx, notime, nodate) {
		return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, notime, nodate);
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_fn["format-dateTime#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-dateTime",
	function(value, picture, language, calendar, place, ctx, notime, nodate) {
		var s = "";
		var i = 0, l = picture.length;
		var format = "";
		var pdate = false;
		var ptime = false;
		var valueDate = notime ? Fleur.toDate(value) : nodate ? Fleur.toTime(value) : Fleur.toDateTime(value);
		language = language || Fleur.defaultLanguage;
		while (i < l) {
			var c = picture.charAt(i);
			var prec = "";
			while (c !== "[" && i < l) {
				if (c !== "]") {
					s += c;
				} else if (prec === c) {
					s += c;
					c = "";
				}
				prec = c;
				c = picture.charAt(++i);
			}
			if (c === "[") {
				c = picture.charAt(++i);
				if (c === "[") {
					s += c;
					i++;
				} else {
					format = "";
					while (c !== "]" && i < l) {
						format += c;
						c = picture.charAt(++i);
					}
					if (c === "]") {
						var intvalue = null, stringvalue = null;
						switch(format.charAt(0)) {
							case "Y":
								pdate = true;
								if (format.charAt(1).toLowerCase() === "i") {
									stringvalue = Fleur.convertToRoman(parseInt(value.substr(0, 4), 10));
									if (format.charAt(1) === "i") {
										stringvalue = stringvalue.toLowerCase();
									}
								} else {
									intvalue = parseInt(value.substr(0, 4), 10);
								}
								break;
							case "M":
								pdate = true;
								if (format.charAt(1).toLowerCase() === "i") {
									stringvalue = Fleur.convertToRoman(parseInt(value.substr(5, 2), 10));
									if (format.charAt(1) === "i") {
										stringvalue = stringvalue.toLowerCase();
									}
								} else if (format.charAt(1).toLowerCase() === "n") {
									stringvalue = Fleur.getMonthName(language, valueDate);
									if (format.charAt(1) === "N") {
										if (format.charAt(2) === "n") {
											stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
										} else {
											stringvalue = stringvalue.toUpperCase();
										}
									} else {
										stringvalue = stringvalue.toLowerCase();
									}
								} else {
									intvalue = parseInt(value.substr(5, 2), 10);
								}
								break;
							case "D":
								pdate = true;
								intvalue = parseInt(value.substr(8, 2), 10);
								break;
							case "d":
								break;
							case "F":
								pdate = true;
								stringvalue = Fleur.getDayName(language, valueDate);
								if (format.charAt(1) === "N") {
									if (format.charAt(2) === "n") {
										stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
									} else {
										stringvalue = stringvalue.toUpperCase();
									}
								} else {
									stringvalue = stringvalue.toLowerCase();
								}
								break;
							case "W":
								break;
							case "w":
								break;
							case "H":
								break;
							case "h":
								ptime = true;
								intvalue = parseInt(value.substr(nodate ? 0 : 11, 2), 10);
								break;
							case "P":
								break;
							case "m":
								ptime = true;
								intvalue = parseInt(value.substr(nodate ? 3 : 14, 2), 10);
								break;
							case "s":
								ptime = true;
								intvalue = parseInt(value.substr(nodate ? 6 : 17, 2), 10);
								break;
							case "f":
								break;
							case "Z":
								break;
							case "z":
								break;
							case "C":
								break;
							case "E":
								break;
						}
						if ((ptime && notime) || (pdate && nodate)) {
							return Fleur.error(ctx, "FOFD1350");
						}
						if (intvalue !== null || stringvalue !== null) {
							format = format.split(',');
							var maxw, minw;
							if (format[1]) {
								var ws = format[1].split('-');
								minw = ws[0] === "*" ? 1 : parseInt(ws[0], 10);
								maxw = !ws[1] || ws[1] === "*" ? Infinity : parseInt(ws[1], 10);
							} else {
								minw = Math.max(format[0].length - 1, 1);
								maxw = Infinity;
							}
							if (intvalue !== null) {
								stringvalue = String(intvalue);
							}
							stringvalue = "0".repeat(Math.max(minw - stringvalue.length, 0)) + stringvalue;
							if (stringvalue.length > maxw) {
								if (format[0].charAt(0) === 'Y') {
									stringvalue = stringvalue.substr(stringvalue.length - maxw);
								}
							}
						}
						if (stringvalue !== null) {
							s += stringvalue;
						}
						i++;
					}
				}
			}
		}
		return s;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});