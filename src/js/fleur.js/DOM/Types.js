/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Types = {};
Fleur.Types["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.Types_XMLSchema = Fleur.Types["http://www.w3.org/2001/XMLSchema"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "error");
Fleur.Type_error = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["error"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "untypedAtomic");
Fleur.Type_untypedAtomic = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["untypedAtomic"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anySimpleType");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyAtomicType");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "string");
Fleur.Type_string = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["string"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "boolean");
Fleur.Type_boolean = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["boolean"];
Fleur.Type_boolean.canonicalize = function(s) {
	if (/^\s*(true|false|0|1)\s*$/.test(s)) {
		s = s.trim();
		if (s === "0") {
			return "false";
		}
		if (s === "1") {
			return "true";
		}
		return s;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "decimal");
Fleur.Type_decimal = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["decimal"];
Fleur.Type_decimal.canonicalize = function(s) {
	if (/^\s*[\-+]?([0-9]+(\.[0-9]*)?|[\-+]?\.[0-9]+)\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		var dec = "";
		if (c === "-") {
			ret = "-";
			i++;
			c = s.charAt(i);
		} else if (c === "+") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		if (c === ".") {
			i++;
			c = s.charAt(i);
			dec = ret === "-" || ret === "" ? "0." : ".";
		}
		while (c >= "0" && c <= "9") {
			if (c === "0") {
				dec += c;
			} else {
				ret += dec + c;
				dec = "";
			}
			i++;
			c = s.charAt(i);
		}
		return ret === "-" || ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "float");
Fleur.Type_float = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["float"];
Fleur.Type_float.canonicalize = function(s) {
	if (/^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|[\-+]?(\.[0-9]+))([eE][\-+]?[0-9]+)?|[\-+]?INF|NaN)\s*$/.test(s)) {
		s = s.trim();
		if (s === "+INF") {
			s = "INF";
		}
		if (s !== "INF" && s !== "-INF" && s !== "NaN") {
			var value = parseFloat(s);
			if (value === Infinity) {
				return "INF";
			}
			if (value === -Infinity) {
				return "-INF";
			}
			if (1 / value === -Infinity) {
				return "-0";
			}
			var absvalue = Math.abs(value);
			if (absvalue < 0.000001 || absvalue >= 1000000) {
				var ret;
				if (absvalue >= 1000000 && absvalue < 1e+21) {
					value *= 1e+15;
					ret = String(value).split("e");
					ret = ret[0] + "E" + String(parseInt(ret[1], 10) - 15);
				} else {
					ret = String(value).replace("e+", "E").replace("e", "E");
				}
				if (ret.indexOf(".") === -1 && ret.indexOf("E") !== -1) {
					ret = ret.split("E");
					return ret[0] + ".0E" + ret[1];
				}
				return ret;
			}
			return String(value);
		}
		return s;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "double");
Fleur.Type_double = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["double"];
Fleur.Type_double.canonicalize = Fleur.Type_float.canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "duration");
Fleur.Type_duration = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["duration"];
Fleur.Type_duration.canonicalize = function(s) {
	if (/^\s*-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?\s*$/.test(s)) {
		var dur = Fleur.toJSONDuration(s);
		if (!dur.year && !dur.month && !dur.hour && !dur.minute && !dur.second) {
			return "PT0S";
		}
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTime");
Fleur.Type_dateTime = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTime"];
Fleur.Type_dateTime.canonicalize = function(s) {
	if (/^\s*([012][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		s = s.trim();
		return Fleur.dateToDateTime(Fleur.toDateTime(s));
	}
	if (/^\s*-?[0-9]+-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "time");
Fleur.Type_time = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["time"];
Fleur.Type_time.canonicalize = function(s) {
	if (/^\s*(([012][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T)?(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		s = s.trim();
		if (s.startsWith("24")) {
			s = "00" + s.substr(2);
		}
		return Fleur.dateToTime(Fleur.toTime(s));
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "date");
Fleur.Type_date = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["date"];
Fleur.Type_date.canonicalize = function(s) {
	if (/^\s*([012][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?))?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		return Fleur.dateToDate(Fleur.toDate(s.trim()));
	}
	if (/^\s*-?[0-9]+-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?))?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYearMonth");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYearMonth"].canonicalize = function(s) {
	if (/^\s*([12][0-9]{3})-(0[1-9]|1[012])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYear");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYear"].canonicalize = function(s) {
	if (/^\s*([\-+]?([0-9]{4}|[1-9][0-9]{4,}))?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonthDay");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonthDay"].canonicalize = function(s) {
	if (/^\s*--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gDay");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gDay"].canonicalize = function(s) {
	if (/^\s*---(0[1-9]|[12][0-9]|3[01])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonth");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonth"].canonicalize = function(s) {
	if (/^\s*--(0[1-9]|1[012])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "hexBinary");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["hexBinary"].canonicalize = function(s) {
	if (/^\s*([0-9A-Fa-f]{2})+\s*$/.test(s)) {
		return s.trim().toUpperCase();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "base64Binary");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["base64Binary"].canonicalize = function(s) {
	if (/^\s*(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyURI");
Fleur.Type_anyURI = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["anyURI"];
Fleur.Type_anyURI.canonicalize = function(s) {
	if (/^\s*((([^ :\/?#]+):\/\/)?[^ \/\?#]+([^ \?#]*)(\?([^ #]*))?(#([^ \:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?)?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "QName");
Fleur.Type_QName = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["QName"];
Fleur.Type_QName.canonicalize = function(s) {
	if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*(\:[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*)?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "normalizedString", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["normalizedString"].canonicalize = function(s) {
	return s.replace(/[\t\r\n]/g, " ");
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "token", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].normalizedString);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["token"].canonicalize = function(s) {
	return s.trim().replace(/\s+/g, " ");
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NOTATION");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NOTATION"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["token"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "language", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["language"].canonicalize = function(s) {
	if (/^\s*[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKEN", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NMTOKEN"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKENS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NMTOKEN);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NMTOKENS"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+(\s+[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+)*\s*$/.test(s)) {
		return s.trim().replace(/\s+/g, " ");
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "Name", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["Name"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NCName", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].Name);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ID", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ID"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREF", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREF"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREFS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].IDREF);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREFS"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*(\s+[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*)*\s*$/.test(s)) {
		return s.trim().replace(/\s+/g, " ");
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITY", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ENTITY"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITIES", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].IDREFS);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ENTITIES"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREFS"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].decimal);
Fleur.Type_integer = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["integer"];
Fleur.Type_integer.canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "-") {
			ret = "-";
			i++;
			c = s.charAt(i);
		} else if (c === "+") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "-" || ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonPositiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonPositiveInteger"].canonicalize = function(s) {
	if (/^\s*(-[0-9]+|0)\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "-") {
			ret = "-";
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "-" || ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "negativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonPositiveInteger);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["negativeInteger"].canonicalize = function(s) {
	if (/^\s*-0*[1-9][0-9]*\s*$/.test(s)) {
		s = s.trim();
		var ret = "-";
		var i = 1;
		var c = s.charAt(i);
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "long", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["long"].canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = Fleur.BigInt(s);
		if (value >= Fleur.BigInt("-9223372036854775808") && value <= Fleur.BigInt("9223372036854775807")) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "int", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].long);
Fleur.Type_int = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["int"];
Fleur.Type_int.canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value >= -2147483648 && value <= 2147483647) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "short", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].int);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["short"].canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value >= -32768 && value <= 32767) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "byte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].short);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["byte"].canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value >= -128 && value <= 127) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonNegativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
Fleur.Type_nonNegativeInteger = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonNegativeInteger"];
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonNegativeInteger"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "+" || c === "-") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedLong", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedLong"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = Fleur.BigInt(s);
		if (value <= Fleur.BigInt("18446744073709551615")) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedInt", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedLong);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedInt"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value <= 4294967295) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedShort", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedInt);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedShort"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value <= 65535) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedByte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedByte"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value <= 255) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "positiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
Fleur.Type_positiveInteger = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["positiveInteger"];
Fleur.Type_positiveInteger.canonicalize = function(s) {
	if (/^\s*\+?0*[1-9][0-9]*\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "+") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "yearMonthDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
Fleur.Type_yearMonthDuration = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["yearMonthDuration"];
Fleur.Type_yearMonthDuration.canonicalize = function(s) {
	if (/^\s*-?P(?!$)([0-9]+Y)?([0-9]+M)?\s*$/.test(s)) {
		var res = Fleur.toJSONYearMonthDuration(s.trim());
		return (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 ? String(res.month) + "M" : (res.year === 0 ? "T0S": ""));
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dayTimeDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
Fleur.Type_dayTimeDuration = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dayTimeDuration"];
Fleur.Type_dayTimeDuration.canonicalize = function(s) {
	if (/^\s*-?P(?!$)([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?\s*$/.test(s)) {
		var res = Fleur.toJSONDayTimeDuration(s.trim());
		return (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || (res.day + res.hour + res.minute + res.second) === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || (res.day + res.hour + res.minute + res.second) === 0 ? String(res.second) + "S" : "");
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTimeStamp", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].dateTime);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTimeStamp"].canonicalize = function(s) {
	if (/^\s*([012][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Types["http://www.agencexml.com/fleur"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "regex", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_regex = Fleur.Types["http://www.agencexml.com/fleur"]["regex"];
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "handler");
Fleur.Type_handler = Fleur.Types["http://www.agencexml.com/fleur"]["handler"];

Fleur.Types["https://tools.ietf.org/rfc/index"] = {};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "ipv4", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_ipv4 = Fleur.Types["https://tools.ietf.org/rfc/index"]["ipv4"];
Fleur.Type_ipv4.canonicalize = function(s) {
	if (/^\s*((1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]).){3}(1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "mac", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_mac = Fleur.Types["https://tools.ietf.org/rfc/index"]["mac"];
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "port", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
Fleur.Type_port = Fleur.Types["https://tools.ietf.org/rfc/index"]["port"];
Fleur.Type_port.canonicalize = function(s) {
	if (/^\s*[0-9]+\s*$/.test(s)) {
		var value = parseInt(s.trim(), 10);
		if (value <= 65535) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Types["http://www.w3.org/2005/xquery"] = {};
new Fleur.TypeInfo("http://www.w3.org/2005/xquery", "main-module", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_xquery_main_module = Fleur.Types["http://www.w3.org/2005/xquery"]["main-module"];
Fleur.Type_xquery_main_module.canonicalize = function(s) {
	Fleur.createExpression(s);
	return s;
}

Fleur.numericTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double];