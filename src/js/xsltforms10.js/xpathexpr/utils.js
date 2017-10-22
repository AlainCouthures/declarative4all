/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_schema*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module utils
 * @description  === Miscalleanious Functions ===
 * * '''stringValue''' function : string cast
 */
		
XsltForms_globals.stringValue = function(value) {
	return typeof value !== "object"? "" + value : (!value || value.length === 0 ? "" : XsltForms_globals.xmlValue(value[0]));
};


		
/**
 * * '''booleanValue''' function : boolean cast
 */

XsltForms_globals.booleanValue = function(value) {
	return typeof value === "undefined" || !value ? false : (typeof value.length !== "undefined"? value.length > 0 : !!value);
};


		
/**
 * * '''numberValue''' function : number cast
 */

//var nbvalcount = 0;
XsltForms_globals.numberValue = function(value) {
	if (typeof value === "boolean") {
		return 'A' - 0;
	} else {
		var v = typeof value === "object"?  XsltForms_globals.stringValue(value) : value;
		return v === '' ? NaN : v - 0;
	}
};


		
/**
 * * '''booleanValue''' function : number cast
 */

XsltForms_globals.nodeSetValue = function(value) {
//	if (typeof value !== "object") {
//		throw {name: this, message: Error().stack};
//	}
	return value;
};


		
/**
 * * '''xmlValue''' function : get the text value for the given node according to its type
 */

if (XsltForms_browser.isIE) {
	XsltForms_globals.xmlValue = function(node) {
		if (typeof node !== "object") {
			return node;
		}
		var ret = node.text;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
		if (schtyp["eval"]) {
			try {
				ret = ret === "" ? 0 : eval(ret);
			} catch (e) {}
		}
		return ret;
	};
} else {
	XsltForms_globals.xmlValue = function(node) {
		if (typeof node !== "object") {
			return node;
		}
		var ret = typeof node.text !== "undefined" ? node.text : typeof node.textContent !== "undefined" ? node.textContent : typeof node.documentElement.text !== "undefined" ? node.documentElement.text : node.documentElement.textContent;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
		if (schtyp["eval"]) {
			try {
				ret = ret === "" ? 0 : eval(ret);
			} catch (e) {}
		}
		return ret;
	};
}


		
/**
 * * '''xmlResolveEntities''' function : resolves every HTML entities in a given string into corresponding characters
 */

XsltForms_globals.xmlResolveEntities = function(s) {
	var parts = XsltForms_globals.stringSplit(s, '&');
	var ret = parts[0];
	for (var i = 1, len = parts.length; i < len; ++i) {
		var p = parts[i];
		var index = p.indexOf(";");
		if (index === -1) {
			ret += parts[i];
			continue;
		}
		var rp = p.substring(0, index);
		var ch;
		switch (rp) {
			case 'lt': ch = '<'; break;
			case 'gt': ch = '>'; break;
			case 'amp': ch = '&'; break;
			case 'quot': ch = '"'; break;
			case 'apos': ch = '\''; break;
			case 'nbsp': ch = String.fromCharCode(160); break;
			default:
				var span = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", 'span') : document.createElement('span');
				span.innerHTML = '&' + rp + '; ';
				ch = span.childNodes[0].nodeValue.charAt(0);
		}
		ret += ch + p.substring(index + 1);
	}
	return ret;
};


		
/**
 * * '''stringSplit''' function : splits a string according to a character
 */

XsltForms_globals.stringSplit = function(s, c) {
	var a = s.indexOf(c);
	if (a === -1) {
		return [s];
	}
	var cl = c.length;
	var parts = [];
	parts.push(s.substr(0,a));
	while (a !== -1) {
		var a1 = s.indexOf(c, a + cl);
		if (a1 !== -1) {
			parts.push(s.substr(a + cl, a1 - a - cl));
		} else {
			parts.push(s.substr(a + cl));
		} 
		a = a1;
	}
	return parts;
};