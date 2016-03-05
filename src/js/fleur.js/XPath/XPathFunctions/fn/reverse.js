/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["reverse"] = function(ctx, children) {
	var i;
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		var seq = new Fleur.Sequence();
		seq.nodeType = Fleur.Node.SEQUENCE_NODE;
		i = ctx._result.childNodes.length - 1;
		while (i >= 0) {
			seq.appendChild(ctx._result.childNodes[i]);
			i--;
		}
		ctx._result = seq;
	}
};