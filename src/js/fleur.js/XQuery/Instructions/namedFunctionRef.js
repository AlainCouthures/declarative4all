/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.namedFunctionRef] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var nbargs = parseInt(children[1][1][0][1][0], 10);
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0017");
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.env.nsresolver) {
			uri = ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	if (uri === "http://www.w3.org/2005/xpath-functions" && fname === "concat" && nbargs > 1 && !Fleur.XPathFunctions[uri][fname + "#" + nbargs]) {
		var cparam = [];
		for (var i = 0; i < nbargs; i++) {
			cparam[i] = {type: Fleur.Node};
		}
		Fleur.XPathFunctions[uri][fname + "#" + nbargs] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.XPathFunctions_fn["concat#"].jsfunc, null, cparam, false, false, {type: Fleur.Type_string});
	}
	Fleur.callback(function() {callback(Fleur.XPathFunctions[uri] ? Fleur.XPathFunctions[uri][fname + "#" + nbargs].cloneNode() || a : a);});
};