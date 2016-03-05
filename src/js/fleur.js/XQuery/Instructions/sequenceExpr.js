/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr] = function(ctx, children) {
	var i, l;
	l = children.length;
	if (l === 0) {
		ctx._result = null;
		return;
	}
	var seq = new Fleur.Sequence();
	seq.nodeType = Fleur.Node.SEQUENCE_NODE;
	i = 0;
	while (i < l) {
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1]);
		if (ctx._result) {
			if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
				return;
			}
			if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
				var i2, l2;
				i2 = 0;
				l2 = ctx._result.childNodes.length;
				while (i2 < l2) {
					seq.appendChild(ctx._result.childNodes[i2]);
					i2++;
				}
			} else {
				seq.appendChild(ctx._result);
			}
		}
		i++;
	}
	ctx._result = seq;
};