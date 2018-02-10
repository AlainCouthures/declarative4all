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
		var s = "";
		var i = 0, l = picture.length;
		var format = "";
		var pdate = false;
		var ptime = false;
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
						var intvalue = null;
						switch(format.charAt(0)) {
							case "Y":
								intvalue = parseInt(value.substr(0, 4), 10);
								pdate = true;
								break;
							case "M":
								intvalue = parseInt(value.substr(5, 2), 10);
								pdate = true;
								break;
							case "D":
								intvalue = parseInt(value.substr(8, 2), 10);
								pdate = true;
								break;
							case "d":
								break;
							case "F":
								break;
							case "W":
								break;
							case "w":
								break;
							case "H":
								break;
							case "h":
								intvalue = parseInt(value.substr(nodate ? 0 : 11, 2), 10);
								ptime = true;
								break;
							case "P":
								break;
							case "m":
								intvalue = parseInt(value.substr(nodate ? 3 : 14, 2), 10);
								ptime = true;
								break;
							case "s":
								intvalue = parseInt(value.substr(nodate ? 6 : 17, 2), 10);
								ptime = true;
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
						if (intvalue !== null) {
							format = format.split(',');
							var maxw, minw;
							var svalue;
							if (format[1]) {
								var ws = format[1].split('-');
								minw = ws[0] === "*" ? 1 : parseInt(ws[0], 10);
								maxw = !ws[1] || ws[1] === "*" ? Infinity : parseInt(ws[1], 10);
							} else {
								minw = Math.max(format[0].length - 1, 1);
								maxw = Infinity;
							}
							svalue = "0".repeat(Math.max(minw - String(intvalue).length, 0)) + String(intvalue);
							if (svalue.length > maxw) {
								if (format[0].charAt(0) === 'Y') {
									svalue = svalue.substr(svalue.length - maxw);
								}
							}
							s += svalue;
						}
						i++;
					}
				}
			}
		}
		return s;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string});