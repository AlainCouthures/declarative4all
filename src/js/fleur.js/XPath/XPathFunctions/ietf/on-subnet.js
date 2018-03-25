/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_ietf["on-subnet#3"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:on-subnet",
	function(address, mask, subnet) {
		address = address.split('.').map(function(i) {return parseInt(i, 10);});
		mask = mask.split('.').map(function(i) {return parseInt(i, 10);});
		subnet = subnet.split('.').map(function(i) {return parseInt(i, 10);});
		return address.reduce(function(a, c, i) {return a && ((c & mask[i]) === subnet[i]);}, true);
	},
	null, [{type: Fleur.Type_ipv4}, {type: Fleur.Type_ipv4}, {type: Fleur.Type_ipv4}], false, false, {type: Fleur.Type_boolean});