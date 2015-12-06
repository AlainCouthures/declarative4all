/*eslint-env browser*/
/*globals XsltForms_browser Fleur*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module LocationExpr
 * @description  === XsltForms_locationExpr Class ===
 * XPath Expression Class for location expressions
 * * constructor function : initializes absolute property and stacks successive steps
 */
		
function XsltForms_locationExpr(absolute) {
	this.absolute = absolute;
	this.steps = [];
	for (var i = 1, len = arguments.length; i < len; i++) {
		this.steps.push(arguments[i]);
	}
}


		
/**
 * * '''evaluate''' method : recursively evaluates the successive steps of this location expression object
 */

XsltForms_locationExpr.prototype.evaluate = function(ctx) {
	var start = (this.absolute && ctx.root )|| !ctx.node ? ctx.root : ctx.node;
	var m = XsltForms_browser.getDocMeta((start.nodeType === Fleur.Node.DOCUMENT_NODE ? start : start.ownerDocument), "model");
	if (m) {
		ctx.addDepElement(document.getElementById(m).xfElement);
	}
	var nodes = [];
	if (this.steps[0]) {
		this.xPathStep(nodes, this.steps, 0, start, ctx);
	} else {
		nodes[0] = start;
	}
	return nodes;
};

XsltForms_locationExpr.prototype.xPathStep = function(nodes, steps, step, input, ctx) {
	var s = steps[step];
	var nodelist = s.evaluate(ctx.clone(input));
	for (var i = 0, len = nodelist.length; i < len; ++i) {
		var node = nodelist[i];
		if (step === steps.length - 1) {
			if (!XsltForms_browser.inArray(node, nodes)) {
				nodes.push(node);
			}
			ctx.addDepNode(node);
		} else {
			this.xPathStep(nodes, steps, step + 1, node, ctx);
		}
	}
};