/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_browser XsltForms_globals XsltForms_exprContext*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module Binding
 * @description  === "Binding" class ===
 * XForms Binding Management
 * * constructor function : "xpath", "model" and "bind" properties are resolved
 */
		
function XsltForms_binding(type, xpath, model, bind) {
	this.type = type;
	this.bind = bind? bind : null;
	this.xpath = xpath? XsltForms_xpath.get(xpath) : null;
	var modelelt = model;
	if( typeof model === "string" ) {
		modelelt = document.getElementById(model);
	}
	this.model = model? (modelelt ? modelelt.xfElement : model) : null;
	this.result = null;
}


		
/**
 * * '''evaluate''' method : evaluates the binding
 */

XsltForms_binding.prototype.evaluate = function() {
	alert("Error");
};
XsltForms_binding.prototype.bind_evaluate = function(subform, ctx, varresolver, depsNodes, depsId, depsElements) {
	var result = null;
	if( typeof this.model === "string" ) {
		this.model = document.getElementById(this.model).xfElement;
	}
	if (this.bind) {
		if (typeof this.bind === "string") {
			var idel = document.getElementById(this.bind);
			if (!idel) {
				XsltForms_browser.debugConsole.write("Binding evaluation returned null for bind: " + this.bind); 
				return null;	// A 'null' signifies bind-ID not found.
			}
			this.bind = idel.xfElement;
		}
		result = this.bind.nodes;
		XsltForms_browser.copyArray(this.bind.depsNodes, depsNodes);
		XsltForms_browser.copyArray(this.bind.depsElements, depsElements);
	} else {
		var exprCtx = new XsltForms_exprContext(subform, !ctx || (this.model && this.model !== document.getElementById(XsltForms_browser.getDocMeta(ctx.ownerDocument, "model")).xfElement) ? this.model ? this.model.getInstanceDocument().documentElement : XsltForms_globals.defaultModel.getInstanceDocument().documentElement : ctx,
			null, null, null, null, ctx, varresolver, depsNodes, depsId, depsElements, this.model);
		result = this.xpath.xpath_evaluate(exprCtx);
	}
	XsltForms_browser.assert(this.type || !result || typeof result === "object", "Binding evaluation didn't returned a nodeset but '"+(typeof result === "object" ? "" : result)+"' for " + (this.bind ? "bind: " + this.bind : "XPath expression: " + this.xpath.expression));
	switch (this.type) {
		case "xsd:string": 
			result = XsltForms_globals.stringValue(result);
			break;
		case "xsd:boolean":
			result = XsltForms_globals.booleanValue(result);
			break;
	}
	this.result = result;
	return result;
};