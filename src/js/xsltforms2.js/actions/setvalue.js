/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_engine XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setvalue
 * @description  === "XsltForms_setvalue" class ===
 * SetValue Action Class
 * * constructor function : resolves specific properties
 */
		
function XsltForms_setvalue(subform, binding, value, literal, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.value = value? XsltForms_xpath.get(value) : null;
	this.literal = literal || "";
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_setvalue.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 */

XsltForms_setvalue.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	var node = this.binding.bind_evaluate(element.xfElement.subform, ctx, varresolver)[0];
	if (node) {
		if (this.context) {
			ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
		}
		var value = this.value? XsltForms_engine.stringValue(this.context ? this.value.xpath_evaluate(ctx, ctx, element.xfElement.subform, varresolver) : this.value.xpath_evaluate(node, ctx, element.xfElement.subform, varresolver)) : this.literal;
		XsltForms_engine.openAction("XsltForms_setvalue.prototype.run");
		try {
			XsltForms_browser.setValue(node, value || "");
			document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement.addChange(node);
			XsltForms_browser.debugConsole.write("Setvalue " + XsltForms_browser.name2string(node) + " = " + value);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: cannot setvalue on " + XsltForms_browser.name2string(node) + " = " + value + "(context " + XsltForms_browser.name2string(ctx) + ")");
		}
		XsltForms_engine.closeAction("XsltForms_setvalue.prototype.run");
	}
};