/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_prof["sleep#1"] = new Fleur.Function("http://basex.org/modules/proc", "prof:sleep",
	function(ms, callback) {
		if (ms > 0) {
			setTimeout(function() {
				callback(null);
			}, Number(ms));
			return;
		}
		callback(null);
	},
	null, [{type: Fleur.Type_integer}], false, true, {type: Fleur.EmptySequence});