/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["head"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence || n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(n);});
		} else  {
			Fleur.callback(function() {callback(n.childNodes[0]);});
		}
	});
};