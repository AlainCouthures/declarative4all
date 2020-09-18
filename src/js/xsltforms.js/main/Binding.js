/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_browser XsltForms_globals XsltForms_exprContext XsltForms_xmlevents XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module Binding
 * @description  === "Binding" class ===
 * XForms Binding Management
 * * constructor function : "xpath", "model" and "bind" properties are resolved
 */
	
function XsltForms_binding(subform, elt, mip, miptype, model) {
	var xpath = mip ? mip.startsWith("xf-template-") ? XsltForms_binding.t2c(elt.getAttribute(mip)) : elt.getAttribute(mip) : elt.getAttribute("xf-ref") || elt.getAttribute("xf-value");
	var modelid = elt.getAttribute("xf-model");
	var bind = elt.getAttribute(mip === "xf-repeat-ref" ? "xf-repeat-bind" : "xf-bind");
	this.type = miptype || (elt.localName.toLowerCase() === "xforms-var" ? "#nodes or constant" : (elt.hasAttribute("xf-value") && !elt.hasAttribute("xf-ref") && mip !== "xf-repeat-ref" ? "xsd:string" : null));
	this.bind = bind ? bind : null;
	this.xpath = xpath ? XsltForms_xpath.create(subform, xpath) : null;
	var modelelt;
	if( modelid ) {
		modelelt = document.getElementById(modelid);
	}
	this.model = modelelt ? modelelt.xfElement : modelid || model;
	this.result = null;
}

XsltForms_binding.t2c = function(s) {
	var i = 0;
	var l = s.length;
	var c = s.charAt(i);
	var instrpart = true;
	var strpart = "";
	var exprpart = "";
	var parts = [];
	while (i < l) {
		if (instrpart) {
			if (c === "{" && s.charAt(i + 1) !== "{") {
				if (strpart !== "") {
					parts.push('"' + strpart + '"');
					strpart = "";
				}
				instrpart = false;
			} else {
				if (c === '"') {
					strpart += '""';
				} else if (c === "{") {
					strpart += "{";
					i++;
				} else {
					strpart += c;
				}
			}
		} else {
			if (c === "}") {
				parts.push(exprpart);
				exprpart = "";
				instrpart = true;
			} else {
				exprpart += c;
			}
		}
		c = s.charAt(++i);
	}
	if (strpart !== "") {
		parts.push('"' + strpart + '"');
	}
	if (parts.length !== 1) {
		return "concat(" + parts.join(",") + ")";
	}
	return parts[0];
};
		
/**
 * * '''evaluate''' method : evaluates the binding
 */

XsltForms_binding.prototype.evaluate = function() {
	alert("Error");
};
XsltForms_binding.prototype.bind_evaluate = function(subform, ctx, varresolver, depsNodes, depsId, depsElements) {
	var result = null;
	//if (this.model === undefined) {
	//	return null;
	//}
	if( typeof this.model === "string" ) {
		return null;
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
		case "xsd:anyAtomicType":
			if (typeof result === "object") {
				result = XsltForms_globals.stringValue(result);
			}
			break;
	}
	this.result = result;
	return result;
};