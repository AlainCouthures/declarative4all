/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["remove"] = function(ctx, children) {
	var i, l, index, result;
	if (children.length !== 2) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (!ctx._result || ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	result = ctx._result;
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.schemaTypeInfo !== Fleur.Type_integer) {
		Fleur.error(ctx, "FORG0006");
		return;
	}
	index = parseInt(ctx._result.data, 10) - 1;
	if (result.nodeType === Fleur.Node.SEQUENCE_NODE || result.nodeType === Fleur.Node.ARRAY_NODE) {
		l = result.childNodes.length;
		if (index >= 0 && index < l) {
			ctx._result = new Fleur.Sequence();
			ctx._result.nodeType = Fleur.Node.SEQUENCE_NODE;
			i = 0;
			while (i < index) {
				ctx._result.appendChild(result.childNodes[i]);
				i++;
			}
			i++;
			while (i < l) {
				ctx._result.appendChild(result.childNodes[i]);
				i++;
			}
		} else {
			ctx._result = result;
		}
	} else if (index === 0) {
		ctx._result = null;
	} else {
		ctx._result = result;
	}
};