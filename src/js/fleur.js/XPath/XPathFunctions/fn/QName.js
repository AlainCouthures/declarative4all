/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["QName#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:QName",
	function(paramURI, paramQName) {
		var	a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_QName;
		a._setNodeNameLocalNamePrefix(paramURI, paramQName);
		return a;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_QName});