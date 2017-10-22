/*eslint-env browser*/
/*globals XsltForms_nsResolver XsltForms_browser XsltForms_exprContext*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module XPath
 * @description  === XsltForms_xpath Class ===
 * XPath Class
 * * constructor function : initializes properties and creates an associated namespace resolver. A compiled argument as string is interpreted as an error detected by the XSLT transformation.
 */
		
function XsltForms_xpath(subform, expression, unordered, compiled, ns) {
	this.subforms = [];
	this.subforms[subform] = true;
	this.nbsubforms = 1;
	this.subform = subform;
	subform.xpaths.push(this);
	this.expression = expression;
	this.unordered = unordered;
	if (typeof compiled === "string") {
		alert("XSLTForms Exception\n--------------------------\n\nError parsing the following XPath expression :\n\n"+expression+"\n\n"+compiled);
		return;
	}
	this.compiled = compiled;
	this.compiled.isRoot = true;
	this.nsresolver = new XsltForms_nsResolver();
	XsltForms_xpath.expressions[expression] = this;
	//if (ns.length > 0)  {
	for (var i = 0, len = ns.length; i < len; i += 2) {
		this.nsresolver.register(ns[i], ns[i + 1]);
	}
	//} else {
	//	this.nsresolver.register("", "http://www.w3.org/1999/xhtml");
	//}
	if (this.nsresolver.notfound) {
		XsltForms_xpath.notfound = true;
	}
	this.evaltime = 0;
}


		
/**
 * * '''evaluate''' method : evaluates the complete XPath expression et catches occuring exceptions
 */

XsltForms_xpath.prototype.evaluate = function() {
	alert("XPath error");
};
XsltForms_xpath.prototype.xpath_evaluate = function(ctx, current, subform, varresolver) {
	//console.log(this.expression);
	var d1 = new Date();
	XsltForms_browser.assert(ctx);
//	alert("XPath evaluate \""+this.expression+"\"");
	if (!ctx.node) {
		ctx = new XsltForms_exprContext(subform, ctx, null, null, null, this.nsresolver, current, varresolver);
	} else if (!ctx.nsresolver) {
		ctx.nsresolver = this.nsresolver;
	}
	try {
		var res = this.compiled.evaluate(ctx);
		if (this.unordered && (res instanceof Array) && res.length > 1) {
			var posres = [];
			for (var i = 0, len = res.length; i < len; i++) {
				posres.push({count: XsltForms_browser.selectNodesLength("preceding::* | ancestor::*", res[i]), node: res[i]});
			}
			posres.sort(function(a,b){return a.count - b.count;});
			for (var i2 = 0, len2 = posres.length; i2 < len2; i2++) {
				res[i2] = posres[i2].node;
			}
		}
		var d2 = new Date();
		this.evaltime += d2 - d1;
		return res;
	} catch(e) {
		alert("XSLTForms Exception\n--------------------------\n\nError evaluating the following XPath expression :\n\n"+this.expression+"\n\n"+(e.name?e.name+"\n\n"+e.message:e));
		return null;
	}
};


		
/**
 * * '''expressions''' associative array : stores every XPath object
 */

XsltForms_xpath.expressions = {};
XsltForms_xpath.notfound = false;


		
/**
 * * '''get''' method : get an XPath object according to a given source text
 */

XsltForms_xpath.get = function(str) {
	return XsltForms_xpath.expressions[str];
};

		
/**
 * * '''create''' method : creates an XPath object if it doesn't already exists
 */

XsltForms_xpath.create = function(subform, expression, unordered, compiled) {
	var xp = XsltForms_xpath.get(expression);
	if (xp) {
		compiled = null;
		if (!xp.subforms[subform]) {
			xp.subforms[subform] = true;
			xp.nbsubforms++;
			subform.xpaths.push(xp);
		}
	} else {
		var ns = [];
		for (var i = 4, len = arguments.length; i < len; i += 2) {
			ns[i-4] = arguments[i];
			ns[i-3] = arguments[i+1];
		}
		xp = new XsltForms_xpath(subform, expression, unordered, compiled, ns);
	}
};

		
/**
 * * '''dispose''' method : clears the properties of this object
 */

XsltForms_xpath.prototype.dispose = function(subform) {
	if (subform && this.nbsubforms !== 1) {
		delete this.subforms[subform];
		this.nbsubforms--;
		return;
	}
	//this.compiled = null;
	//this.nsresolver = null;
	delete XsltForms_xpath.expressions[this.expression];
};

		
/**
 * * '''registerNS''' method : register a namespace for all XPath expressions
 */

XsltForms_xpath.registerNS = function(prefix, uri) {
	if (XsltForms_xpath.notfound) {
		XsltForms_xpath.notfound = false;
		for (var exp in XsltForms_xpath.expressions) {
			if (XsltForms_xpath.expressions.hasOwnProperty(exp)) {
				XsltForms_xpath.expressions[exp].nsresolver.registerNotFound(prefix, uri);
				if (XsltForms_xpath.expressions[exp].nsresolver.notfound) {
					XsltForms_xpath.notfound = true;
				}
			}
		}
	}
};