/*eslint-env browser*/
/*globals XsltForms_schema XsltForms_atomicType XsltForms_browser XsltForms_globals*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module TypeDefs
 * @description  === "XsltForms_typeDefs" class ===
 * Default Type Definitions Initialization Class
 */
		
var XsltForms_typeDefs = {

		
/**
 * * '''initAll''' method : inits the default types definitions for XML Schema and XForms
 */

	initAll : function() {
		this.init("http://www.w3.org/2001/XMLSchema", this.Default);
		this.init("http://www.w3.org/2002/xforms", this.XForms);
		this.init("http://www.agencexml.com/xsltforms", this.XSLTForms);
		this.init("http://purl.org/dc/terms/", this.DublinCore);
	},

		
/**
 * * '''init''' method : inits the default types definitions for a given namespace
 */

	init : function(ns, list) {
		var schema = XsltForms_schema.get(null, ns);
		for (var id in list) {
			if (list.hasOwnProperty(id)) {
				var type = new XsltForms_atomicType();
				type.setSchema(schema);
				type.setName(id);
				var props = list[id];
				var base = props.base;
				if (base) {
					type.setBase(base);
				}
				for (var prop in props) {
					if (prop !== "base") {
						type[prop] = props[prop];
					}
				}
			}
		}
	},
	ctes : {
		i : "A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF",
		c : "A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7"
	}
};


		
/**
 * * '''Default''' associative array : every default type definition for XML Schema
 * ** '''base''' : prefix:name of the base type
 * ** '''whitespace''' : white space behavior
 * ** '''patterns''' : array of regular expressions
 * ** '''class''' : associated class
 * ** '''displayLength''' : number
 * ** '''fractionDigits''' : number
 * ** '''totalDigits''' : number
 * ** '''minInclusive''' : number
 * ** '''maxInclusive''' : number
 * ** '''minExclusive''' : number
 * ** '''maxExclusive''' : number
 * ** '''format''' : formatting function
 * ** '''parse''' : parsing function
 * * Predefined types :
 */

XsltForms_typeDefs.Default = {

		
/**
 * ** '''xsd:string'''
 */

	"string" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "preserve"
	},

		
/**
 * ** '''xsd:boolean'''
 */

	"boolean" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^(true|false|0|1)$" ],
		"class" : "boolean"
	},

		
/**
 * ** '''xsd:decimal'''
 */

	"decimal" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[\\-+]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)$" ],
		"class" : "number",
		"format" : function(value) {
			return XsltForms_browser.i18n.formatNumber(value, this.fractionDigits);
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.parseNumber(value);
		}
	},

		
/**
 * ** '''xsd:float'''
 */

	"float" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^(([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][\\-+]?[0-9]+)?|-?INF|NaN)$" ],
		"class" : "number"
	},

		
/**
 * ** '''xsd:double'''
 */

	"double" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^(([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)$" ],
		"class" : "number"
	},

		
/**
 * ** '''xsd:dateTime'''
 */

	"dateTime" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$" ],
		"class" : "datetime",
		"displayLength" : 20,
		"format" : function(value) {
			var reg = new RegExp("^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDateTime(XsltForms_browser.i18n.parse(value, "yyyy-MM-ddThh:mm:ss"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value), "yyyy-MM-ddThh:mm:ss", true);
		}
	},

		
/**
 * ** '''xsd:date'''
 */

	"date" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$" ],
		"class" : "date",
		"displayLength" : 10,
		"format" : function(value) {
			var reg = new RegExp("^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDate(XsltForms_browser.i18n.parse(value, "yyyy-MM-dd"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parseDate(value), "yyyy-MM-dd", true);
		}
	},

		
/**
 * ** '''xsd:time'''
 */

	"time" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$" ],
		"class" : "time",
		"displayLength" : 8,
		"format" : function(value) {
			var reg = new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, "hh:mm:ss", true), null, true, true);
			}
			return value;
		},
		"parse" : function(value) {
			var reg = new RegExp(XsltForms_globals.AMPM ?
				"^(?:0?[1-9](?![0-9])|1[0-2]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)? ?(" + XsltForms_browser.i18n.get("format.time.AM") + "|" + XsltForms_browser.i18n.get("format.time.PM") + ")$" :
				"^(?:0?[0-9](?![0-9])|1[0-9]|20|21|22|23):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$", "i");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, null, true), "hh:mm:ss", true, true);
			}
			return value;
		}
	},

		
/**
 * ** '''xsd:duration'''
 */

	"duration" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$" ]
	},

		
/**
 * ** '''xsd:gDay'''
 */

	"gDay" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^---(0[1-9]|[12][0-9]|3[01])$" ]
	},

		
/**
 * ** '''xsd:gMonth'''
 */

	"gMonth" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^--(0[1-9]|1[012])$" ]
	},

		
/**
 * ** '''xsd:gMonthDay'''
 */

	"gMonthDay" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$" ]
	},

		
/**
 * ** '''xsd:gYear'''
 */

	"gYear" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([\\-+]?([0-9]{4}|[1-9][0-9]{4,}))?$" ]
	},

		
/**
 * ** '''xsd:gYearMonth'''
 */

	"gYearMonth" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([12][0-9]{3})-(0[1-9]|1[012])$" ]
	},

		
/**
 * ** '''xsd:integer'''
 */

	"integer" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:decimal",
		"fractionDigits" : 0
	},

		
/**
 * ** '''xsd:nonPositiveInteger'''
 */

	"nonPositiveInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^(-[0-9]+|0)$" ]
	},

		
/**
 * ** '''xsd:nonNegativeInteger'''
 */

	"nonNegativeInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^\\+?[0-9]+$" ]
	},

		
/**
 * ** '''xsd:negativeInteger'''
 */

	"negativeInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^-0*[1-9][0-9]*$" ]
	},

		
/**
 * ** '''xsd:positiveInteger'''
 */

	"positiveInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^\\+?0*[1-9][0-9]*$" ]
	},

		
/**
 * ** '''xsd:byte'''
 */

	"byte" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -128,
		"maxInclusive" : 127
	},

		
/**
 * ** '''xsd:short'''
 */

	"short" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -32768,
		"maxInclusive" : 32767
	},

		
/**
 * ** '''xsd:int'''
 */

	"int" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -2147483648,
		"maxInclusive" : 2147483647
},

		
/**
 * ** '''xsd:long'''
 */

	"long" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -9223372036854775808,
		"maxInclusive" : 9223372036854775807
},

		
/**
 * ** '''xsd:unsignedByte'''
 */

	"unsignedByte" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 255
	},

		
/**
 * ** '''xsd:unsignedShort'''
 */

	"unsignedShort" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 65535
	},

		
/**
 * ** '''xsd:unsignedInt'''
 */

	"unsignedInt" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 4294967295
	},

		
/**
 * ** '''xsd:unsignedLong'''
 */

	"unsignedLong" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 18446744073709551615
},

		
/**
 * ** '''xsd:normalizedString'''
 */

	"normalizedString" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "replace"
	},

		
/**
 * ** '''xsd:token'''
 */

	"token" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "collapse"
	},

		
/**
 * ** '''xsd:language'''
 */

	"language" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$" ]
	},

		
/**
 * ** '''xsd:anyURI'''
 */

	"anyURI" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^(([^ :\\/?#]+):\\/\\/)?[^ \\/\\?#]+([^ \\?#]*)(\\?([^ #]*))?(#([^ \\:#\\[\\]\\@\\!\\$\\&\\\\'\\(\\)\\*\\+\\,\\;\\=]*))?$" ]
	},

		
/**
 * ** '''xsd:Name'''
 */

	"Name" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.i + ":][" + XsltForms_typeDefs.ctes.c + ":]*$" ]
	},

		
/**
 * ** '''xsd:NCName'''
 */

	"NCName" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*$" ]
	},

		
/**
 * ** '''xsd:QName'''
 */

	"QName" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^(([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\>> -_!~*'()%]+)?(>> #[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?:[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*$" ]
	},

		
/**
 * ** '''xsd:ID'''
 */

	"ID" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:NCName"
	},

		
/**
 * ** '''xsd:IDREF'''
 */

	"IDREF" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:NCName"
	},

		
/**
 * ** '''xsd:IDREFS'''
 */

	"IDREFS" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*( +[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)*$" ]
	},

		
/**
 * ** '''xsd:NMTOKEN'''
 */

	"NMTOKEN" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.c + "]+$" ]
	},

		
/**
 * ** '''xsd:NMTOKENS'''
 */

	"NMTOKENS" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.c + "]+( [" + XsltForms_typeDefs.ctes.c + "]+)*$" ]
	},

		
/**
 * ** '''xsd:base64Binary'''
 */

	"base64Binary" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[a-zA-Z0-9+/=]+$" ]
	},

		
/**
 * ** '''xsd:hexBinary'''
 */

	"hexBinary" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[0-9A-Fa-f]+$" ],
		"format" : function(value) {
			return value.toUpperCase();
		},
		"parse" : function(value) {
			return value.toUpperCase();
		}
	}
};


		
/**
 * * '''XForms''' associative array : every default type definition for XForms types
 */

XsltForms_typeDefs.XForms = {

		
/**
 * ** '''xforms:string'''
 */

	"string" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"whiteSpace" : "preserve"
	},

		
/**
 * ** '''xforms:boolean'''
 */

	"boolean" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(true|false|0|1)?$" ],
		"class" : "boolean"
	},

		
/**
 * ** '''xforms:decimal'''
 */

	"decimal" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([\\-+]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+))?$" ],
		"class" : "number",
		"format" : function(value) {
			return XsltForms_browser.i18n.formatNumber(value, this.fractionDigits);
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.parseNumber(value);
		}
	},

		
/**
 * ** '''xforms:float'''
 */

	"float" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^((([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][\\-+]?[0-9]+)?|-?INF|NaN))?$" ],
		"class" : "number"
	},

		
/**
 * ** '''xforms:double'''
 */

	"double" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^((([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN))?$" ],
		"class" : "number"
	},

		
/**
 * ** '''xforms:dateTime'''
 */

	"dateTime" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$" ],
		"class" : "datetime",
		"displayLength" : 20,
		"format" : function(value) {
			var reg = new RegExp("^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDateTime(XsltForms_browser.i18n.parse(value, "yyyy-MM-ddThh:mm:ss"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value), "yyyy-MM-ddThh:mm:ss", true);
		}
	},

		
/**
 * ** '''xforms:date'''
 */

	"date" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$" ],
		"class" : "date",
		"displayLength" : 10,
		"format" : function(value) {
			var reg = new RegExp("^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDate(XsltForms_browser.i18n.parse(value, "yyyy-MM-dd"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parseDate(value), "yyyy-MM-dd", true);
		}
	},

		
/**
 * ** '''xforms:time'''
 */

	"time" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$" ],
		"class" : "time",
		"displayLength" : 8,
		"format" : function(value) {
			var reg = new RegExp("^(([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, "hh:mm:ss", true), null, true, true);
			}
			return value;
		},
		"parse" : function(value) {
			var reg = new RegExp(XsltForms_globals.AMPM ?
				"^((?:0?[1-9](?![0-9])|1[0-2]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)? ?(" + XsltForms_browser.i18n.get("format.time.AM") + "|" + XsltForms_browser.i18n.get("format.time.PM") + "))?$" :
				"^((?:0?[0-9](?![0-9])|1[0-9]|20|21|22|23):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?)?$", "i");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, null, true), "hh:mm:ss", true, true);
			}
			return value;
		}
	},

		
/**
 * ** '''xforms:duration'''
 */

	"duration" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?)?$" ]
	},

		
/**
 * ** '''xforms:dayTimeDuration'''
 */

	"dayTimeDuration" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(-?P([0-9]+D(T([0-9]+(H([0-9]+(M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|(\\.[0-9]*)?S)?|M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|\\.[0-9]+S))?|T([0-9]+(H([0-9]+(M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|(\\.[0-9]*)?S)?|M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|\\.[0-9]+S)))?$" ]
	},

		
/**
 * ** '''xforms:yearMonthDuration'''
 */

	"yearMonthDuration" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(-?P[0-9]+(Y([0-9]+M)?|M))?$" ]
	},

		
/**
 * ** '''xforms:gDay'''
 */

	"gDay" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(---(0[1-9]|[12][0-9]|3[01]))?$" ]
	},

		
/**
 * ** '''xforms:gMonth'''
 */

	"gMonth" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(--(0[1-9]|1[012]))?$" ]
	},

		
/**
 * ** '''xforms:gMonthDay'''
 */

	"gMonthDay" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))?$" ]
	},

		
/**
 * ** '''xforms:gYear'''
 */

	"gYear" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([\\-+]?([0-9]{4}|[1-9][0-9]{4,}))?$" ]
	},

		
/**
 * ** '''xforms:gYearMonth'''
 */

	"gYearMonth" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([12][0-9]{3})-(0[1-9]|1[012]))?$" ]
	},

		
/**
 * ** '''xforms:integer'''
 */

	"integer" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:decimal",
		"fractionDigits" : 0
	},

		
/**
 * ** '''xforms:nonPositiveInteger'''
 */

	"nonPositiveInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^((-[0-9]+|0))?$" ]
	},

		
/**
 * ** '''xforms:nonNegativeInteger'''
 */

	"nonNegativeInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^(\\+?[0-9]+)?$" ]
	},

		
/**
 * ** '''xforms:negativeInteger'''
 */

	"negativeInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^(-[0-9]+)?$" ]
	},

		
/**
 * ** '''xforms:positiveInteger'''
 */

	"positiveInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^(\\+?0*[1-9][0-9]*)?$" ]
	},

		
/**
 * ** '''xforms:byte'''
 */

	"byte" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -128,
		"maxInclusive" : 127
	},

		
/**
 * ** '''xforms:short'''
 */

	"short" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -32768,
		"maxInclusive" : 32767
	},

		
/**
 * ** '''xforms:int'''
 */

	"int" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -2147483648,
		"maxInclusive" : 2147483647
	},

		
/**
 * ** '''xforms:long'''
 */

	"long" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -9223372036854775808,
		"maxInclusive" : 9223372036854775807
	},

		
/**
 * ** '''xforms:unsignedByte'''
 */

	"unsignedByte" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 255
	},

		
/**
 * ** '''xforms:unsignedShort'''
 */

	"unsignedShort" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 65535
	},

		
/**
 * ** '''xforms:unsignedInt'''
 */

	"unsignedInt" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 4294967295
	},

		
/**
 * ** '''xforms:unsignedLong'''
 */

	"unsignedLong" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 18446744073709551615
	},

		
/**
 * ** '''xforms:normalizedString'''
 */

	"normalizedString" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"whiteSpace" : "replace"
	},

		
/**
 * ** '''xforms:token'''
 */

	"token" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"whiteSpace" : "collapse"
	},

		
/**
 * ** '''xforms:language'''
 */

	"language" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^([a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*)?$" ]
	},

		
/**
 * ** '''xforms:anyURI'''
 */

	"anyURI" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^((([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\>> -_!~*'()%]+)?(>> #[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?)?$" ]
	},

		
/**
 * ** '''xforms:Name'''
 */

	"Name" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.i + ":][" + XsltForms_typeDefs.ctes.c + ":]*)?$" ]
	},

		
/**
 * ** '''xforms:NCName'''
 */

	"NCName" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)?$" ]
	},

		
/**
 * ** '''xforms:QName'''
 */

	"QName" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^((([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\>> -_!~*'()%]+)?(>> #[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?:[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)?$" ]
	},

		
/**
 * ** '''xforms:ID"'''
 */

	"ID" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:NCName"
	},

		
/**
 * ** '''xforms:IDREF'''
 */

	"IDREF" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:NCName"
	},

		
/**
 * ** '''xforms:IDREFS'''
 */

	"IDREFS" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]+( +[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)*)?$" ]
	},

		
/**
 * ** '''xforms:NMTOKEN'''
 */

	"NMTOKEN" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.c + "]*$" ]
	},

		
/**
 * ** '''xforms:NMTOKENS'''
 */

	"NMTOKENS" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.c + "]+( [" + XsltForms_typeDefs.ctes.c + "]+)*)?$" ]
	},

		
/**
 * ** '''xforms:base64Binary'''
 */

	"base64Binary" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^[a-zA-Z0-9+/]*$" ]
	},

		
/**
 * ** '''xforms:hexBinary'''
 */

	"hexBinary" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^[0-9A-Fa-f]*$" ],
		"format" : function(value) {
			return value.toUpperCase();
		},
		"parse" : function(value) {
			return value.toUpperCase();
		}
	},

		
/**
 * ** '''xforms:email'''
 */

	"email" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"whiteSpace" : "collapse",
		"patterns" : [ "^([A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+(\\.[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+)*@[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+(\\.[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+)*)?$" ]
	},

		
/**
 * ** '''xforms:card-number'''
 */

	"card-number" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"patterns" : [ "^[0-9]*$" ]
	},

		
/**
 * ** '''xforms:url'''
 */

	"url" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"whiteSpace" : "collapse",
		"patterns" : [ "^(ht|f)tp(s?)://([a-z0-9]*:[a-z0-9]*@)?([a-z0-9.]*\\.[a-z]{2,7})$" ]
	},

		
/**
 * ** '''xforms:amount'''
 */

	"amount" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:decimal",
		"format" : function(value) {
			return XsltForms_browser.i18n.formatNumber(value, 2);
		}
	},

		
/**
 * ** '''xforms:HTMLFragment'''
 */

	"HTMLFragment" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string"
	},

		
/**
 * ** '''xforms:trimmed'''
 */

	"trimmed" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"format" : function(value) {
			return value.replace(/^\s+|\s+$/gm, "");
		},
		"parse" : function(value) {
			return value.replace(/^\s+|\s+$/gm, "");
		}
	}
};

		
/**
 * * '''XSLTForms''' associative array : every default type definition for XSLTForms types
 */

XsltForms_typeDefs.XSLTForms = {

		
/**
 * ** '''xsltforms:shortDate'''
 */

	"shortDate" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"patterns" : [ "^(([12][0-9]{3})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01]))?$" ],
		"class" : "date",
		"displayLength" : 10,
		"format" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, "yyyyMMdd"), null, true);
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value), "yyyyMMdd", true);
		}
	},

		
/**
 * ** '''xsltforms:decimal'''
 */

	"decimal" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"patterns" : [ "^[\\-+]?\\(*[\\-+]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)(([+-/]|\\*)\\(*([0-9]+(\\.[0-9]*)?|\\.[0-9]+)\\)*)*$" ],
		"class" : "number",
		"eval" : "xsd:decimal"
	},

		
/**
 * ** '''xsltforms:float'''
 */

	"float" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:float"
	},

		
/**
 * ** '''xsltforms:double'''
 */

	"double" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:double"
	},

		
/**
 * ** '''xsltforms:integer'''
 */

	"integer" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:integer"
	},

		
/**
 * ** '''xsltforms:nonPositiveInteger'''
 */

	"nonPositiveInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:nonPositiveInteger"
	},

		
/**
 * ** '''xsltforms:nonNegativeInteger'''
 */

	"nonNegativeInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:nonNegativeInteger"
	},

		
/**
 * ** '''xsltforms:negativeInteger'''
 */

	"negativeInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:negativeInteger"
	},

		
/**
 * ** '''xsltforms:positiveInteger'''
 */

	"positiveInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:positiveInteger"
	},

		
/**
 * ** '''xsltforms:byte'''
 */

	"byte" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:byte"
	},

		
/**
 * ** '''xsltforms:short'''
 */

	"short" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:short"
	},

		
/**
 * ** '''xsltforms:int'''
 */

	"int" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:int"
	},

		
/**
 * ** '''xsltforms:long'''
 */

	"long" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:long"
	},

		
/**
 * ** '''xsltforms:unsignedByte'''
 */

	"unsignedByte" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedByte"
	},

		
/**
 * ** '''xsltforms:unsignedShort'''
 */

	"unsignedShort" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedShort"
	},

		
/**
 * ** '''xsltforms:unsignedInt'''
 */

	"unsignedInt" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedInt"
	},

		
/**
 * ** '''xsltforms:unsignedLong'''
 */

	"unsignedLong" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedLong"
	}
};

		
/**
 * * '''DublinCore''' associative array : every default type definition for Dublin Core types
 */

XsltForms_typeDefs.DublinCore = {

		
/**
 * ** '''dcterms:W3CDTF'''
 */

	"W3CDTF" : {
		"nsuri" : "http://purl.org/dc/terms/",
		"base" : "xsd_:dateTime"
	}
};

XsltForms_typeDefs.initAll();