/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_ietf["mac#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:mac",
	function(macaddress) {
		var result = new Fleur.Sequence();
		var i, l, c;
		for (i = 0, l = macaddress.length; i < l; i++) {
			if ("0123456789ABCDEFabcdef".indexOf(macaddress.charAt(i)) !== -1) {
				c = new Fleur.Text();
				c.schemaTypeInfo = Fleur.Type_integer;
				c.data = String(parseInt(macaddress.charAt(i) + macaddress.charAt(i + 1), 16));
				result.appendChild(c);
				i++;
			}
		}
		return result;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Node});