/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["encode-for-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:encode-for-uri",
	function(uripart) {
		return uripart !== null ? encodeURIComponent(uripart).replace(/[!'()*]/g, function(c) {return '%' + c.charCodeAt(0).toString(16).toUpperCase();}) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});