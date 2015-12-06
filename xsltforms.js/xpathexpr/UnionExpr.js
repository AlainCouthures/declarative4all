/*eslint-env browser*/
/*globals XsltForms_globals */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module UnionExpr
 * @description  === XsltForms_unionExpr Class ===
 * XPath Expression Class for binary union expressions
 * * constructor function : initializes expr1 and expr2 properties
 */
		
function XsltForms_unionExpr(expr1, expr2) {
	this.expr1 = expr1;
	this.expr2 = expr2;
}


		
/**
 * * '''evaluate''' method : evaluates as a node set this expression object
 */

XsltForms_unionExpr.prototype.evaluate = function(ctx) {
	var nodes1 = XsltForms_globals.nodeSetValue(this.expr1.evaluate(ctx));
	var nodes2 = XsltForms_globals.nodeSetValue(this.expr2.evaluate(ctx));
	var len1 = nodes1.length;
	for (var i2 = 0, len = nodes2.length; i2 < len; i2++) {
		var found = false;
		for (var i1 = 0; i1 < len1; i1++) {
			found = nodes1[i1] === nodes2[i2];
			if (found) {
				break;
			}
		}
		if (!found) {
			nodes1.push(nodes2[i2]);
		}
	}
	return nodes1;
};