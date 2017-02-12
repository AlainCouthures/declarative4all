/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["preventDefault#0"] = new Fleur.Function("http://xqib.org", "b:preventDefault",
	function(ctx) {
		if (ctx.evt) {
			ctx.evt.preventDefault();
		}
	},
	null, [], true, false, {type: Fleur.EmptySequence});