/*eslint-env browser, node*/
/*globals Fleur */
/*eslint-disable no-undef-expression */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_base64["decode#1"] = new Fleur.Function("http://www.agencexml.com/fleur/base64", "base64:decode",
	function(a) {
		if (Fleur.inBrowser) {
			return window.atob(a);
		}
		return Buffer.from(a, 'base64').toString('ascii');
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});