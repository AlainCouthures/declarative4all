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
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "decimal");
Fleur.Type_decimal = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["decimal"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "float");
Fleur.Type_float = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["float"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "double");
Fleur.Type_double = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["double"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "duration");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTime");
Fleur.Type_dateTime = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTime"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "time");
Fleur.Type_time = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["time"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "date");
Fleur.Type_date = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["date"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYearMonth");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYear");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonthDay");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gDay");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonth");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "hexBinary");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "base64Binary");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyURI");
Fleur.Type_anyURI = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["anyURI"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "QName");
Fleur.Type_QName = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["QName"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NOTATION");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "normalizedString", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "token", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].normalizedString);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "language", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKEN", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKENS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NMTOKEN);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "Name", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NCName", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].Name);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ID", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREF", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREFS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].IDREF);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITY", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITIES", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].ENTITY);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].decimal);
Fleur.Type_integer = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["integer"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonPositiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "negativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonPositiveInteger);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "long", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "int", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].long);
Fleur.Type_int = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["int"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "short", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].int);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "byte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].short);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonNegativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedLong", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedInt", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedLong);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedShort", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedInt);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedByte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "positiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
Fleur.Type_positiveInteger = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["positiveInteger"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "yearMonthDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dayTimeDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTimeStamp", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].dateTime);

Fleur.Types["http://www.agencexml.com/fleur"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "regex", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_regex = Fleur.Types["http://www.agencexml.com/fleur"]["regex"];
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "handler");
Fleur.Type_handler = Fleur.Types["http://www.agencexml.com/fleur"]["handler"];

Fleur.Types["https://tools.ietf.org/rfc/index"] = {};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "ipv4", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_ipv4 = Fleur.Types["https://tools.ietf.org/rfc/index"]["ipv4"];
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "mac", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_mac = Fleur.Types["https://tools.ietf.org/rfc/index"]["mac"];
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "port", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
Fleur.Type_port = Fleur.Types["https://tools.ietf.org/rfc/index"]["port"];

Fleur.numericTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double];