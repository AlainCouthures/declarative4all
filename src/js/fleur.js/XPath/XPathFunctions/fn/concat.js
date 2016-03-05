/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["concat"] = function(ctx, children) {
	var i, l, res;
	if (children.length === 0) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	i = 0;
	l = children.length;
	res = "";
	while (i < l) {
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1]);
		Fleur.Atomize(ctx);
		if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
			return;
		}
		if (ctx._result.schemaTypeInfo) {
			res += ctx._result.data;
		}
		i++;
	}
	ctx._result = new Fleur.Text();
	ctx._result.schemaTypeInfo = Fleur.Type_string;
	ctx._result.data = res;
};