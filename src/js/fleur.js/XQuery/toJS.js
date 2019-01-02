/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.pad = function(number) {
	if (number < 10) {
		return '0' + String(number);
	}
 	return String(number);
};
Fleur.dateToDate = function(d) {
	return String(d.getFullYear()) + '-' + Fleur.pad(d.getMonth() + 1) + '-' + Fleur.pad(d.getDate());
};
Fleur.dateToDateTime = function(d) {
	return String(d.getFullYear()) + '-' + Fleur.pad(d.getMonth() + 1) + '-' + Fleur.pad(d.getDate()) + 'T' + Fleur.pad(d.getHours()) + ':' + Fleur.pad(d.getMinutes()) + ':' + Fleur.pad(d.getSeconds()) + '.' + (d.getMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};
Fleur.dateToTime = function(d) {
	return Fleur.pad(d.getHours()) + ':' + Fleur.pad(d.getMinutes()) + ':' + Fleur.pad(d.getSeconds()) + '.' + (d.getMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};
Fleur.toDate = function(s) {
	return new Date(parseInt(s.substr(0, 4), 10), parseInt(s.substr(5, 2), 10) - 1, parseInt(s.substr(8, 2), 10));
};
Fleur.toDateTime = function(s) {
	return new Date(parseInt(s.substr(0, 4), 10), parseInt(s.substr(5, 2), 10) - 1, parseInt(s.substr(8, 2), 10), parseInt(s.substr(11, 2), 10), parseInt(s.substr(14, 2), 10), parseInt(s.substr(17, 2), 10), s.charAt(19) === "." ? parseFloat("0." + s.substr(20).replace(/\+\-Z/, "Z").split("Z")[0]) * 1000 : 0);
};
Fleur.toTime = function(s) {
	return new Date(0, 0, 0, parseInt(s.substr(0, 2), 10), parseInt(s.substr(3, 2), 10), parseInt(s.substr(6, 2), 10), s.charAt(8) === "." ? parseFloat("0." + s.substr(9).replace(/\+\-Z/, "Z").split("Z")[0]) * 1000 : 0);
};
Fleur.toJSONDate = function(s) {
	return {
		year: parseInt(s.substr(0, 4), 10),
		month: parseInt(s.substr(5, 2), 10),
		day: parseInt(s.substr(8, 2), 10)
	};
};
Fleur.toJSONDateTime = function(s) {
	return {
		year: parseInt(s.substr(0, 4), 10),
		month: parseInt(s.substr(5, 2), 10),
		day: parseInt(s.substr(8, 2), 10),
		hour: parseInt(s.substr(11, 2), 10),
		minute: parseInt(s.substr(14, 2), 10),
		second: parseFloat(s.substr(17).replace(/\+\-Z/, "Z").split("Z")[0])
	};	
};
Fleur.toJSONTime = function(s) {
	return {
		hour: parseInt(s.substr(0, 2), 10),
		minute: parseInt(s.substr(3, 2), 10),
		second: parseFloat(s.substr(5).replace(/\+\-Z/, "Z").split("Z")[0])
	};	
};
Fleur.toJSONYearMonthDuration = function(s) {
	var m = s.match(/^-?P(?!$)(([0-9]+)Y)?(([0-9]+)M)?$/);
	var retvalue = (m[2] ? parseInt(m[2], 10) : 0) * 12 +(m[4] ? parseInt(m[4], 10) : 0);
	return {
		sign: s.startsWith("-") && retvalue !== 0 ? -1 : 1,
		year: Math.floor(retvalue / 12),
		month: retvalue % 12
	};
};
Fleur.toJSONDayTimeDuration = function(s) {
	var m = s.match(/^-?P(?!$)(([0-9]+)D)?(T(?!$)(([0-9]+)H)?(([0-9]+)M)?(([0-9]+(\.[0-9]+)?)S)?)?$/);
	var retvalue = (((m[2] ? parseInt(m[2], 10) : 0) * 24 + (m[5] ? parseInt(m[5], 10) : 0)) * 60 + (m[7] ? parseInt(m[7], 10) : 0)) * 60 + (m[9] ? parseFloat(m[9]) : 0);
	var ret = {sign: s.startsWith("-") && retvalue !== 0 ? -1 : 1};
	ret.day = Math.floor(retvalue / 86400);
	retvalue = retvalue % 86400;
	ret.hour = Math.floor(retvalue / 3600);
	retvalue = retvalue % 3600;
	ret.minute = Math.floor(retvalue / 60);
	ret.second = retvalue % 60;
	return ret;
};
Fleur.NumberToDecimalString = function(n) {
	var s = String(n);
	if (s.indexOf("e") !== -1) {
		s = s.split("e");
		var exp = parseInt(s[1], 10);
		s = s[0].split(".");
		s[1] = s[1] || "";
		if (exp >= 0) {
			if (exp < s[1].length) {
				return s[0] + s[1].substr(0, s[1].length - exp) + "." + s[1].substr(s[1].length - exp);
			}
			return s[0] + s[1] + "0".repeat(exp - s[1].length);
		}
		return "0." + "0".repeat(-1 - exp) + s[0] + s[1];
	}
	return s;
};
Fleur.JSTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double, Fleur.Type_string, Fleur.Type_boolean, Fleur.Type_date, Fleur.Type_dateTime, Fleur.Type_time, Fleur.Type_yearMonthDuration, Fleur.Type_dayTimeDuration];
Fleur.toJSValue = function(a, asNumber, asString, asBoolean, asDate, asJSONDate, asJSONDuration) {
	var value;
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		if (asNumber) {
			if (a.schemaTypeInfo === Fleur.Type_integer) {
				return [0, parseInt(a.data, 10)];
			} else if (a.schemaTypeInfo === Fleur.Type_decimal) {
				return [1, parseFloat(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_float) {
				return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_double || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [0, parseInt(a.data, 10)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [1, parseFloat(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			}
		}
		if (asString) {
			if (a === Fleur.EmptySequence) {
				return [4];
			}
			if (!a.schemaTypeInfo || a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return [4, a.data];
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [4, a.data];
			}
		}
		if (asBoolean) {
			if (a.schemaTypeInfo === Fleur.Type_boolean) {
				return [5, a.data === "true"];
			} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return [5, a.data.length !== 0];
			} else if (a.schemaTypeInfo === Fleur.Type_integer) {
				value = parseInt(a.data, 10);
				return [5, !isNaN(value) && value !== 0];
			} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
				value = parseFloat(a.data);
				return [5, !isNaN(value) && value !== 0];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [5, a.data === "true"];
			} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
				return [5, a.data.length !== 0];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				value = parseInt(a.data, 10);
				return [5, !isNaN(value) && value !== 0];
			} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
				value = parseFloat(a.data);
				return [5, !isNaN(value) && value !== 0];
			}
		}
		if (asDate || asJSONDate) {
			if (a.schemaTypeInfo === Fleur.Type_date) {
				return [6, asDate ? Fleur.toDate(a.data) : Fleur.toJSONDate(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_dateTime) {
				return [7, asDate ? Fleur.toDateTime(a.data) : Fleur.toJSONDateTime(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_time) {
				return [8, asDate ? Fleur.toTime(a.data) : Fleur.toJSONTime(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "date", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [6, asDate ? Fleur.toDate(a.data) : Fleur.toJSONDate(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "dateTime", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [7, asDate ? Fleur.toDateTime(a.data) : Fleur.toJSONDateTime(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "time", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [8, asDate ? Fleur.toTime(a.data) : Fleur.toJSONTime(a.data)];
			}
		}
		if (asJSONDuration) {
			if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
				return [9, Fleur.toJSONYearMonthDuration(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
				return [10, Fleur.toJSONDayTimeDuration(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "yearMonthDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [9, Fleur.toJSONYearMonthDuration(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "dayTimeDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [10, Fleur.toJSONDayTimeDuration(a.data)];
			}
		}
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		if (asBoolean) {
			return [0, a.childNodes.length !== 0];
		}
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSNumber = function(a, ignore) {
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			return [0, parseInt(a.data, 10)];
		} else if (a.schemaTypeInfo === Fleur.Type_decimal) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_float) {
			return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_double || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, parseInt(a.data, 10)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		if (!ignore) {
			a.schemaTypeInfo = Fleur.Type_error;
			a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		}
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSDate = function(a, convert) {
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		var v;
		if (convert) {
			v = new Date(parseInt(a.data.substr(0, 4), 10), parseInt(a.data.substr(5, 2), 10) - 1, parseInt(a.data.substr(8, 2), 10));
		} else {
			v = a.data;
		}
		if (a.schemaTypeInfo === Fleur.Type_date) {
			return [0, v];
		} else if (a.schemaTypeInfo === Fleur.Type_dateTime) {
			return [1, v];
		} else if (a.schemaTypeInfo === Fleur.Type_time) {
			return [2, v];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "date", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, v];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "dateTime", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, v];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "time", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, v];
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSString = function(a) {
	if (a === Fleur.EmptySequence) {
		return [0];
	}
	if (!a.schemaTypeInfo || a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSBoolean = function(a) {
	var value;
	if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		return [0, a.childNodes.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_boolean) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_integer) {
		value = parseInt(a.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseInt(a.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSObject = function(a) {
	if (a.nodeType === Fleur.Node.MAP_NODE) {
		var o = {};
		var i = 0;
		var l = a.entries.length;
		while (i < l) {
			o[a.entries[i].nodeName] = a.entries[i].textContent;
			i++;
		}
		return [0, o];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toContentType = function(o, def) {
	var s;
	if (o["media-type"]) {
		s = o["media-type"];
	} else {
		switch (o.method) {
			case "html":
				s = "text/html";
				break;
			case "xml":
				s = "application/xml";
				break;
			case "json":
				s = "application/json";
				break;
			default:
				s = def;
		}
	}
	if (o.encoding) {
		s += "; charset=\"" + o.encoding + "\"";
	}
	for (var p in o) {
		if (o.hasOwnProperty(p) && p !== "media-type" && p !== "encoding") {
			s += "; " + p + "=" + encodeURIComponent(o[p]);
		}
	}
	return s;
};
Fleur.msToDayTimeDuration = function(ms) {
	var s = ms < 0 ? "-P" : "P";
    ms = ms / 1000;
    ms = Math.abs(Math.floor(ms));
    var days = Math.floor(ms / (24 * 60 * 60));
    var sec = ms - days * 24 * 60 * 60;
    var hours = Math.floor(sec / (60 * 60));
    sec = sec - hours * 60 * 60;
    var min = Math.floor(sec / 60);
    sec = sec - min * 60;
    if (sec === 0 && min === 0 && hours === 0 && days === 0) {
    	return "P0D";
    }
    if (days !== 0) {
    	s += String(days) + "D";
    }
    if (hours !== 0 || min !== 0 || sec !== 0) {
    	s += "T";
    }
    if (hours !== 0) {
    	s += String(hours) + "H";
    }
    if (min !== 0) {
    	s += String(min) + "M";
    }
    if (sec !== 0) {
    	s += String(sec) + "S";
    }
    return s;
};
Fleur.getMonthName = function(language, d) {
	if (Fleur.inBrowser) {
		return d.toLocaleString(language, {month: "long"});
	}
	var month = d.getMonth();
	if (!Fleur.locale[language]) {
		language = language.split("-")[0];
		if (!Fleur.locale[language]) {
			language = 'en';
		}
	}
	return Fleur.locale[language].months[month];
};
Fleur.getDayName = function(language, d) {
	if (Fleur.inBrowser) {
		return d.toLocaleString(language, {weekday: "long"});
	}
	var day = d.getDay();
	if (!Fleur.locale[language]) {
		language = language.split("-")[0];
		if (!Fleur.locale[language]) {
			language = 'en';
		}
	}
	return Fleur.locale[language].weekdays[day];
};