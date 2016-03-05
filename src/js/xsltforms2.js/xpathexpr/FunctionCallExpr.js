/*eslint-env browser*/
/*globals XsltForms_xpathCoreFunctions XsltForms_engine*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module FunctionCallExpr
 * @description  === XsltForms_functionCallExpr Class ===
 * XPath Expression Class for core function calling
 * * constructor function : checks a core function has the given name, initializes specific properties, pushes arguments
 */
		
function XsltForms_functionCallExpr(fname) {
	this.name = fname;
	this.func = XsltForms_xpathCoreFunctions[fname];
	this.xpathfunc = !!this.func;
	this.args = [];
	if (!this.xpathfunc) {
		try {
			this.func = eval(fname.split(" ")[1]);
		} catch (e) {
		 alert(e);
		}
	}
	if (!this.func) {
		XsltForms_engine.error(this, "xforms-compute-exception", "Function " + this.name + "() not found");
	}
	for (var i = 1, len = arguments.length; i < len; i++) {
		this.args.push(arguments[i]);
	}
}


		
/**
 * * '''evaluate''' method : evaluates this function call expression object calling the corresponding Javascript function with the context and the same arguments
 */

XsltForms_functionCallExpr.prototype.evaluate = function(ctx) {
	var arguments_ = [];
	if (this.xpathfunc) {
		for (var i = 0, len = this.args.length; i < len; i++) {
			arguments_[i] = this.args[i].evaluate(ctx);
		}
		return this.func.call(ctx, arguments_);
	} else {
		for (var i2 = 0, len2 = this.args.length; i2 < len2; i2++) {
			arguments_[i2] = XsltForms_engine.stringValue(this.args[i2].evaluate(ctx));
		}
		return this.func.apply(null,arguments_);
	}
};