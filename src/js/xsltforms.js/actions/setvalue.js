/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_globals XsltForms_browser XsltForms_class XsltForms_binding XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setvalue
 * @description  === "XsltForms_setvalue" class ===
 * SetValue Action Class
 * * constructor function : resolves specific properties
 */
		
new XsltForms_class("XsltForms_setvalue", "HTMLElement", "xforms-setvalue");

function XsltForms_setvalue(subform, elt) {
	this.subform = subform;
	this.binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(this.subform, elt) : null;
	this.value = elt.hasAttribute("xf-value") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-value")) : null;
	this.literal = elt.textContent || "";
	this.context = elt.hasAttribute("xf-context") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-context")) : null;
	this.init(elt);
}

XsltForms_setvalue.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 */

XsltForms_setvalue.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	var nodeset = this.binding.bind_evaluate(element.xfElement.subform, ctx, varresolver);
	if (nodeset.length !== 0 && this.context) {
		ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
	}
	for (var i = 0, l = nodeset.length; i < l; i++) {
		var node = nodeset[i];
		if (node) {
			var value = this.value? XsltForms_globals.stringValue(this.context ? this.value.xpath_evaluate(ctx, ctx, element.xfElement.subform, varresolver) : this.value.xpath_evaluate(node, ctx, element.xfElement.subform, varresolver)) : this.literal;
			XsltForms_globals.openAction("XsltForms_setvalue.prototype.run");
			try {
				XsltForms_browser.setValue(node, value || "");
				document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement.addChange(node);
				XsltForms_browser.debugConsole.write("Setvalue " + XsltForms_browser.name2string(node) + " = " + value);
			} catch (e) {
				XsltForms_browser.debugConsole.write("ERROR: cannot setvalue on " + XsltForms_browser.name2string(node) + " = " + value + "(context " + XsltForms_browser.name2string(ctx) + ")");
			}
			XsltForms_globals.closeAction("XsltForms_setvalue.prototype.run");
		}
	}
};