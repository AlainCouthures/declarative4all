/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathExpression = function(expression, compiled) {
	this.expression = expression;
	if (!compiled) {
		var src;
		try {
			src = Fleur.XPathEvaluator._xq2js(expression);
			compiled = eval(src);
		} catch (e) {
			throw new Fleur.XPathException(Fleur.XPathException.INVALID_EXPRESSION_ERR, e.message);
		}
	}
	this.compiled = compiled;
};
Fleur.XPathExpression.prototype.evaluate = function(contextNode, env, type, xpresult) {
	return Fleur.evaluate(this, contextNode, env, type, xpresult);
};