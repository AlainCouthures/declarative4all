/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_ietf["on-subnet#2"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:on-subnet",
	function(address, mask, prefix) {
		return a & b;
	},
	null, [{type: Fleur.Type_ipv4}, {type: Fleur.Type_ipv4}, {type: Fleur.Type_ipv4}], false, false, {type: Fleur.Type_boolean});