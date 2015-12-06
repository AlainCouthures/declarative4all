/*eslint-env browser*/
/*globals XsltForms_globals */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module PathExpr
 * @description  === XsltForms_pathExpr Class ===
 * XPath Expression Class for path expressions composed of a filter and a relative path
 * * constructor function : initializes the filter and rel properties
 */
		
function XsltForms_pathExpr(filter, rel) {
	this.filter = filter;
	this.rel = rel;
}


		
/**
 * * '''evaluate''' method : first evaluates the filter then evaluates each combination with the relative path for this expression object
 */

XsltForms_pathExpr.prototype.evaluate = function(ctx) {
	var nodes = XsltForms_globals.nodeSetValue(this.filter.evaluate(ctx));
	var nodes1 = [];
	for (var i = 0, len = nodes.length; i < len; i++) {
		var newCtx = ctx.clone(nodes[i], i, nodes);
		var nodes0 = XsltForms_globals.nodeSetValue(this.rel.evaluate(newCtx));
		for (var j = 0, len1 = nodes0.length; j < len1; j++) {
			nodes1.push(nodes0[j]);
		}
	}
	return nodes1;
};