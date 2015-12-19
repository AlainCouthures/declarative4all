/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module Exprs
 * @description  === TokenExpr Class ===
 * XPath Expression Class for token expressions
 * * constructor function : initializes the value property
 */
		
function XsltForms_tokenExpr(m) {
	this.value = m;
}


		
/**
 * * '''evaluate''' method : evaluates this Binary expression object value as a string value.
 */

XsltForms_tokenExpr.prototype.evaluate = function() {
	return XsltForms_globals.stringValue(this.value);
};


		
/**
 * === UnaryMinusExpr Class ===
 * XPath Expression Class for unary minus expressions
 * * constructor function : initializes the expr property
 */

function XsltForms_unaryMinusExpr(expr) {
	this.expr = expr;
}


		
/**
 * * '''evaluate''' method : evaluates this Unary Minus expression object.
 */

XsltForms_unaryMinusExpr.prototype.evaluate = function(ctx) {
	return -XsltForms_globals.numberValue(this.expr.evaluate(ctx));
};


		
/**
 * === CteExpr Class ===
 * XPath Expression Class for constant expressions
 * * constructor function : initializes the value property
 */

function XsltForms_cteExpr(value) {
	this.value = XsltForms_browser.isEscaped ? typeof value === "string" ? XsltForms_browser.unescape(value) : value : value;
}


		
/**
 * * '''evaluate''' method : gets this Constant expression object value as is.
 */

XsltForms_cteExpr.prototype.evaluate = function() {
	return this.value;
};