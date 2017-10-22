/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_globals*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module abstractAction
 * @description  === "XsltForms_abstractAction" class ===
 * Parent class for each Action class
 */
		
function XsltForms_abstractAction() {
}


		
/**
 * * '''init''' method : "if", "while" and "iterate" attributes are defined in this class
 */

XsltForms_abstractAction.prototype.init = function(ifexpr, whileexpr, iterateexpr) {
	this.ifexpr = XsltForms_xpath.get(ifexpr);
	this.whileexpr = XsltForms_xpath.get(whileexpr);
	this.iterateexpr = XsltForms_xpath.get(iterateexpr);
};


		
/**
 * * '''execute''' method : "while" attribute process calling "if" attribute process
 */

XsltForms_abstractAction.prototype.execute = function(element, ctx, evt) {
	if (evt.stopped) { return; }
	if (!ctx) {
		ctx = element.node || (XsltForms_globals.defaultModel.getInstanceDocument() ? XsltForms_globals.defaultModel.getInstanceDocument().documentElement : null);
	}
	// for now, iterate overrides while.
	if (this.iterateexpr) {
		if (this.whileexpr) {
			XsltForms_globals.error(this.element, "xforms-compute-exception", "@iterate cannot be used with @while");
		}
		var nodes = this.iterateexpr.xpath_evaluate(ctx);
		for (var i = 0, len = nodes.length; i < len; i++) {
			this.exec_(element, nodes[i], evt);
		}
	} else if (this.whileexpr) {
		while (XsltForms_globals.booleanValue(this.whileexpr.xpath_evaluate(ctx))) {
			if (!this.exec_(element, ctx, evt)) {
				break;
			}
		}
	} else {
		this.exec_(element, ctx, evt);
	}
};


		
/**
 * * '''exec_''' method : "if" attribute process calling specific "run" method
 */

XsltForms_abstractAction.prototype.exec_ = function(element, ctx, evt) {
	if (this.ifexpr) {
		if (XsltForms_globals.booleanValue(this.ifexpr.xpath_evaluate(ctx))) {
			this.run(element, ctx, evt);
		} else {
			return false;
		}
	} else {
		this.run(element, ctx, evt);
	}
	return true;
};


		
/**
 * * '''run''' method : Empty method to be defined in each sub-class
 */

XsltForms_abstractAction.prototype.run = function() { };