"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Types = {};
Fleur.Types["#internal"] = {};
Fleur.Types["http://www.w3.org/2001/XMLSchema"] = {};

Fleur.Types_XMLSchema = Fleur.Types["http://www.w3.org/2001/XMLSchema"];

Fleur.Type_error = new Fleur.TypeInfo_XMLSchema("error");

Fleur.Type_anyType = new Fleur.TypeInfo_XMLSchema("anyType");
Fleur.Type_anySimpleType = new Fleur.TypeInfo_XMLSchema("anySimpleType", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyType]]);
Fleur.Type_untyped = new Fleur.TypeInfo_XMLSchema("untyped", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyType]]);
Fleur.Type_anyAtomicType = new Fleur.TypeInfo_XMLSchema("anyAtomicType", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anySimpleType]]);

Fleur.Type_untypedAtomic = new Fleur.TypeInfo_XMLSchema("untypedAtomic", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);

Fleur.Type_numeric = new Fleur.TypeInfo_XMLSchema("numeric", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
//  [Fleur.TypeInfo.DERIVATION_UNION, Fleur.Type_integer],
//  [Fleur.TypeInfo.DERIVATION_UNION, Fleur.Type_decimal],
//  [Fleur.TypeInfo.DERIVATION_UNION, Fleur.Type_float],
//  [Fleur.TypeInfo.DERIVATION_UNION, Fleur.Type_double]
//]);
Fleur.Type_numeric.constructorName = "xs_numeric_1";
Fleur.Type_numeric.canonicalize = function(s) {
  try {
    return Fleur.Type_integer.canonicalize(s);
  } catch (e) {}
  try {
    return Fleur.Type_decimal.canonicalize(s);
  } catch (e) {}
  try {
    return Fleur.Type_float.canonicalize(s);
  } catch (e) {}
  try {
    return Fleur.Type_double.canonicalize(s);
  } catch (e) {}
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_string = new Fleur.TypeInfo_XMLSchema("string", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_string.constructorName = "xs_string_1";
Fleur.Type_string.canonicalize = function(s) {
  return s;
};

Fleur.Type_boolean = new Fleur.TypeInfo_XMLSchema("boolean", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_boolean.constructorName = "xs_boolean_1";
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

Fleur.Type_decimal = new Fleur.TypeInfo_XMLSchema("decimal", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_numeric]]);
Fleur.Type_decimal.constructorName = "xs_decimal_1";
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

Fleur.Type_float = new Fleur.TypeInfo_XMLSchema("float", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_numeric]]);
Fleur.Type_float.constructorName = "xs_float_1";
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

Fleur.Type_double = new Fleur.TypeInfo_XMLSchema("double", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_numeric]]);
Fleur.Type_double.constructorName = "xs_double_1";
Fleur.Type_double.canonicalize = Fleur.Type_float.canonicalize;

Fleur.Type_duration = new Fleur.TypeInfo_XMLSchema("duration", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
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

Fleur.Type_dateTime = new Fleur.TypeInfo_XMLSchema("dateTime", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_dateTime.constructorName = "xs_dateTime_1";
Fleur.Type_dateTime.canonicalize = function(s) {
  if (/^\s*([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
    s = s.trim();
    return Fleur.dateToDateTime(Fleur.toDateTime(s));
  }
  if (/^\s*-?[0-9]+-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
    throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_time = new Fleur.TypeInfo_XMLSchema("time", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_time.constructorName = "xs_time_1";
Fleur.Type_time.canonicalize = function(s) {
  if (/^\s*(([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T)?(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
    s = s.trim();
    if (s.startsWith("24")) {
      s = "00" + s.substr(2);
    }
    return Fleur.dateToTime(Fleur.toTime(s));
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_date = new Fleur.TypeInfo_XMLSchema("date", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_date.constructorName = "xs_date_1";
Fleur.Type_date.canonicalize = function(s) {
  if (/^\s*([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?))?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
    return Fleur.dateToDate(Fleur.toDate(s.trim()));
  }
  if (/^\s*-?[0-9]+-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?))?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
    throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_gYearMonth = new Fleur.TypeInfo_XMLSchema("gYearMonth", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_gYearMonth.constructorName = "xs_gYearMonth_1";
Fleur.Type_gYearMonth.canonicalize = function(s) {
  if (/^\s*([0-9]{4})-(0[1-9]|1[012])\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_gYear = new Fleur.TypeInfo_XMLSchema("gYear", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_gYear.constructorName = "xs_gYear_1";
Fleur.Type_gYear.canonicalize = function(s) {
  if (/^\s*([\-+]?([0-9]{4}|[1-9][0-9]{4,}))?\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_gMonthDay = new Fleur.TypeInfo_XMLSchema("gMonthDay", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_gMonthDay.constructorName = "xs_gMonthDay_1";
Fleur.Type_gMonthDay.canonicalize = function(s) {
  if (/^\s*--((0[1-9]|1[0-2])-([01][1-9]|10|2[0-9]))|((0[13-9]|1[0-2])-30)|((0[13578]|1[02])-31)\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_gDay = new Fleur.TypeInfo_XMLSchema("gDay", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_gDay.constructorName = "xs_gDay_1";
Fleur.Type_gDay.canonicalize = function(s) {
  if (/^\s*---(0[1-9]|[12][0-9]|3[01])\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_gMonth = new Fleur.TypeInfo_XMLSchema("gMonth", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_gMonth.constructorName = "xs_gMonth_1";
Fleur.Type_gMonth.canonicalize = function(s) {
  if (/^\s*--(0[1-9]|1[012])\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_hexBinary = new Fleur.TypeInfo_XMLSchema("hexBinary", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_hexBinary.constructorName = "xs_hexBinary_1";
Fleur.Type_hexBinary.canonicalize = function(s) {
  if (/^\s*([0-9A-Fa-f]{2})+\s*$/.test(s)) {
    return s.trim().toUpperCase();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_base64Binary = new Fleur.TypeInfo_XMLSchema("base64Binary", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_base64Binary.constructorName = "xs_base64Binary_1";
Fleur.Type_base64Binary.canonicalize = function(s) {
  if (/^\s*(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_anyURI = new Fleur.TypeInfo_XMLSchema("anyURI", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_anyURI.constructorName = "xs_anyURI_1";
Fleur.Type_anyURI.canonicalize = function(s) {
  if (/^\s*((([^ :\/?#]+):\/\/)?[^ \/\?#]+([^ \?#]*)(\?([^ #]*))?(#([^ \:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?)?\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_collation = new Fleur.TypeInfo_XMLSchema("collation", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_collation.constructorName = "xs_collation_1";
Fleur.Type_collation.canonicalize = function(s) {
  var c = Fleur.Collations[s];
  if (!c && !s.startsWith("http://")) {
    c = Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/" + s];
    if (c) {
      return "http://www.w3.org/2005/xpath-functions/collation/" + s;
    }
  } else {
    return s;
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_QName = new Fleur.TypeInfo_XMLSchema("QName", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_anyAtomicType]]);
Fleur.Type_QName.constructorName = "xs_QName_1";
Fleur.Type_QName.canonicalize = function(s) {
  if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*(\:[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*)?\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_normalizedString = new Fleur.TypeInfo_XMLSchema("normalizedString", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_normalizedString.constructorName = "xs_normalizedString_1";
Fleur.Type_normalizedString.canonicalize = function(s) {
  return s.replace(/[\t\r\n]/g, " ");
};

Fleur.Type_token = new Fleur.TypeInfo_XMLSchema("token", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_normalizedString]]);
Fleur.Type_token.constructorName = "xs_token_1";
Fleur.Type_token.canonicalize = function(s) {
  return s.trim().replace(/\s+/g, " ");
};

Fleur.Type_NOTATION = new Fleur.TypeInfo_XMLSchema("NOTATION");
Fleur.Type_NOTATION.constructorName = "xs_NOTATION_1";
Fleur.Type_NOTATION.canonicalize = Fleur.Type_token.canonicalize;

Fleur.Type_language = new Fleur.TypeInfo_XMLSchema("language", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_token]]);
Fleur.Type_language.constructorName = "xs_language_1";
Fleur.Type_language.canonicalize = function(s) {
  if (/^\s*[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_NMTOKEN = new Fleur.TypeInfo_XMLSchema("NMTOKEN", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_token]]);
Fleur.Type_NMTOKEN.constructorName = "xs_NMTOKEN_1";
Fleur.Type_NMTOKEN.canonicalize = function(s) {
  if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_NMTOKENS = new Fleur.TypeInfo_XMLSchema("NMTOKENS", [[Fleur.TypeInfo.DERIVATION_LIST, Fleur.Type_NMTOKEN]]);
Fleur.Type_NMTOKENS.constructorName = "xs_NMTOKENS_1";
Fleur.Type_NMTOKENS.canonicalize = function(s) {
  if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+(\s+[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+)*\s*$/.test(s)) {
    return s.trim().replace(/\s+/g, " ");
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_Name = new Fleur.TypeInfo_XMLSchema("Name", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_token]]);
Fleur.Type_Name.constructorName = "xs_Name_1";
Fleur.Type_Name.canonicalize = function(s) {
  if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_NCName = new Fleur.TypeInfo_XMLSchema("NCName", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_Name]]);
Fleur.Type_NCName.constructorName = "xs_NCName_1";
Fleur.Type_NCName.canonicalize = function(s) {
  if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_ID = new Fleur.TypeInfo_XMLSchema("ID", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_NCName]]);
Fleur.Type_ID.constructorName = "xs_ID_1";
Fleur.Type_ID.canonicalize = Fleur.Type_NCName.canonicalize;

Fleur.Type_IDREF = new Fleur.TypeInfo_XMLSchema("IDREF", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_NCName]]);
Fleur.Type_IDREF.constructorName = "xs_IDREF_1";
Fleur.Type_IDREF.canonicalize = Fleur.Type_NCName.canonicalize;

Fleur.Type_IDREFS = new Fleur.TypeInfo_XMLSchema("IDREFS", [[Fleur.TypeInfo.DERIVATION_LIST, Fleur.Type_IDREF]]);
Fleur.Type_IDREFS.constructorName = "xs_IDREFS_1";
Fleur.Type_IDREFS.canonicalize = function(s) {
  if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*(\s+[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*)*\s*$/.test(s)) {
    return s.trim().replace(/\s+/g, " ");
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_ENTITY = new Fleur.TypeInfo_XMLSchema("ENTITY", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_NCName]]);
Fleur.Type_ENTITY.constructorName = "xs_ENTITY_1";
Fleur.Type_ENTITY.canonicalize = Fleur.Type_NCName.canonicalize;

Fleur.Type_ENTITIES = new Fleur.TypeInfo_XMLSchema("ENTITIES", [[Fleur.TypeInfo.DERIVATION_LIST, Fleur.Type_ENTITY]]);
Fleur.Type_ENTITIES.constructorName = "xs_ENTITIES_1";
Fleur.Type_ENTITIES.canonicalize = Fleur.Type_IDREFS.canonicalize;

Fleur.Type_integer = new Fleur.TypeInfo_XMLSchema("integer", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_decimal]]);
Fleur.Type_integer.constructorName = "xs_integer_1";
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

Fleur.Type_nonPositiveInteger = new Fleur.TypeInfo_XMLSchema("nonPositiveInteger", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_integer]]);
Fleur.Type_nonPositiveInteger.constructorName = "xs_nonPositiveInteger_1";
Fleur.Type_nonPositiveInteger.canonicalize = function(s) {
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

Fleur.Type_negativeInteger = new Fleur.TypeInfo_XMLSchema("negativeInteger", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_nonPositiveInteger]]);
Fleur.Type_negativeInteger.constructorName = "xs_negativeInteger_1";
Fleur.Type_negativeInteger.canonicalize = function(s) {
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

Fleur.Type_long = new Fleur.TypeInfo_XMLSchema("long", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_integer]]);
Fleur.Type_long.constructorName = "xs_long_1";
Fleur.Type_long.canonicalize = function(s) {
  if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
    s = s.trim();
    var value = Fleur.BigInt(s);
    if (value >= Fleur.BigInt("-9223372036854775808") && value <= Fleur.BigInt("9223372036854775807")) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_int = new Fleur.TypeInfo_XMLSchema("int", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_long]]);
Fleur.Type_int.constructorName = "xs_int_1";
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

Fleur.Type_short = new Fleur.TypeInfo_XMLSchema("short", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_int]]);
Fleur.Type_short.constructorName = "xs_short_1";
Fleur.Type_short.canonicalize = function(s) {
  if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
    s = s.trim();
    var value = parseInt(s, 10);
    if (value >= -32768 && value <= 32767) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_byte = new Fleur.TypeInfo_XMLSchema("byte", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_short]]);
Fleur.Type_byte.constructorName = "xs_byte_1";
Fleur.Type_byte.canonicalize = function(s) {
  if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
    s = s.trim();
    var value = parseInt(s, 10);
    if (value >= -128 && value <= 127) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_nonNegativeInteger = new Fleur.TypeInfo_XMLSchema("nonNegativeInteger", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_integer]]);
Fleur.Type_nonNegativeInteger.constructorName = "xs_nonNegativeInteger_1";
Fleur.Type_nonNegativeInteger.canonicalize = function(s) {
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

Fleur.Type_unsignedLong = new Fleur.TypeInfo_XMLSchema("unsignedLong", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_nonNegativeInteger]]);
Fleur.Type_unsignedLong.constructorName = "xs_unsignedLong_1";
Fleur.Type_unsignedLong.canonicalize = function(s) {
  if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
    s = s.trim();
    var value = Fleur.BigInt(s);
    if (value <= Fleur.BigInt("18446744073709551615")) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_unsignedInt = new Fleur.TypeInfo_XMLSchema("unsignedInt", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_unsignedLong]]);
Fleur.Type_unsignedInt.constructorName = "xs_unsignedInt_1";
Fleur.Type_unsignedInt.canonicalize = function(s) {
  if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
    s = s.trim();
    var value = parseInt(s, 10);
    if (value <= 4294967295) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_unsignedShort = new Fleur.TypeInfo_XMLSchema("unsignedShort", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_unsignedInt]]);
Fleur.Type_unsignedShort.constructorName = "xs_unsignedShort_1";
Fleur.Type_unsignedShort.canonicalize = function(s) {
  if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
    s = s.trim();
    var value = parseInt(s, 10);
    if (value <= 65535) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_codepoint = new Fleur.TypeInfo_XMLSchema("codepoint", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_unsignedShort]]);
Fleur.Type_codepoint.constructorName = "xs_codepoint_1";
Fleur.Type_codepoint.canonicalize = function(s) {
  if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
    s = s.trim();
    var value = parseInt(s, 10);
    if (value > 0 && value <= 65535) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_unsignedByte = new Fleur.TypeInfo_XMLSchema("unsignedByte", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_unsignedShort]]);
Fleur.Type_unsignedByte.constructorName = "xs_unsignedByte_1";
Fleur.Type_unsignedByte.canonicalize = function(s) {
  if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
    s = s.trim();
    var value = parseInt(s, 10);
    if (value <= 255) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_positiveInteger = new Fleur.TypeInfo_XMLSchema("positiveInteger", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_nonNegativeInteger]]);
Fleur.Type_positiveInteger.constructorName = "xs_positiveInteger_1";
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

Fleur.Type_yearMonthDuration = new Fleur.TypeInfo_XMLSchema("yearMonthDuration", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_duration]]);
Fleur.Type_yearMonthDuration.constructorName = "xs_yearMonthDuration_1";
Fleur.Type_yearMonthDuration.canonicalize = function(s) {
  if (/^\s*-?P(?!$)([0-9]+Y)?([0-9]+M)?\s*$/.test(s)) {
    var res = Fleur.toJSONYearMonthDuration(s.trim());
    return (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 ? String(res.month) + "M" : (res.year === 0 ? "T0S": ""));
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_dayTimeDuration = new Fleur.TypeInfo_XMLSchema("dayTimeDuration", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_duration]]);
Fleur.Type_dayTimeDuration.constructorName = "xs_dayTimeDuration_1";
Fleur.Type_dayTimeDuration.canonicalize = function(s) {
  if (/^\s*-?P(?!$)([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?\s*$/.test(s)) {
    var res = Fleur.toJSONDayTimeDuration(s.trim());
    return (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || (res.day + res.hour + res.minute + res.second) === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || (res.day + res.hour + res.minute + res.second) === 0 ? String(res.second) + "S" : "");
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Type_dateTimeStamp = new Fleur.TypeInfo_XMLSchema("dateTimeStamp", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_dateTime]]);
Fleur.Type_dateTimeStamp.constructorName = "xs_dateTimeStamp_1";
Fleur.Type_dateTimeStamp.canonicalize = function(s) {
  if (/^\s*([012][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Types["http://www.agencexml.com/fleur"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "regex", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_regex = Fleur.Types["http://www.agencexml.com/fleur"].regex;
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "handler");
Fleur.Type_handler = Fleur.Types["http://www.agencexml.com/fleur"].handler;

Fleur.Types["https://tools.ietf.org/rfc/index"] = {};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "ipv4", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_ipv4 = Fleur.Types["https://tools.ietf.org/rfc/index"].ipv4;
Fleur.Type_ipv4.canonicalize = function(s) {
  if (/^\s*((1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]).){3}(1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*$/.test(s)) {
    return s.trim();
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "mac", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_mac = Fleur.Types["https://tools.ietf.org/rfc/index"].mac;
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "port", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_unsignedShort]]);
Fleur.Type_port = Fleur.Types["https://tools.ietf.org/rfc/index"].port;
Fleur.Type_port.canonicalize = function(s) {
  if (/^\s*[0-9]+\s*$/.test(s)) {
    var value = parseInt(s.trim(), 10);
    if (value <= 65535) {
      return String(value);
    }
  }
  throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};

Fleur.Types["http://www.agencexml.com/fleur/unit"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur/unit", "information", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_unit_information = Fleur.Types["http://www.agencexml.com/fleur/unit"].information;
Fleur.Type_unit_information.canonicalize = function(s) {
  return s;
};

Fleur.Types["http://www.w3.org/2005/xquery"] = {};
new Fleur.TypeInfo("http://www.w3.org/2005/xquery", "main-module", [[Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string]]);
Fleur.Type_xquery_main_module = Fleur.Types["http://www.w3.org/2005/xquery"]["main-module"];
Fleur.Type_xquery_main_module.canonicalize = function(s) {
  Fleur.createExpression(s);
  return s;
};

Fleur.numericTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double];
Fleur.atomicTypes = [];