/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_globals XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module split
 * @description  === "XsltForms_split" class ===
 * Split Action Class
 * * constructor function : resolves specific properties
 */
		
function XsltForms_split(subform, binding, separator, leftTrim, rightTrim, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.separator = separator;
	this.leftTrim = leftTrim && leftTrim !== "" ? new RegExp(leftTrim) : null;
	this.rightTrim = rightTrim && rightTrim !== "" ? new RegExp(rightTrim) : null;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_split.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 */

XsltForms_split.prototype.run = function(element, ctx) {
	var node;
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	var nodes = this.binding.bind_evaluate(element.xfElement.subform, ctx, varresolver);
	if (nodes.length !== 0) {
		if (this.context) {
			ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
		}
		XsltForms_globals.openAction("XsltForms_split.prototype.run");
		try {
			for (var i = 0, l = nodes.length; i < l; i++) {
				node = nodes[i];
				XsltForms_browser.splitNode(node, this.separator || ",", this.leftTrim, this.rightTrim);
				document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement.addChange(node);
				XsltForms_browser.debugConsole.write("Split " + XsltForms_browser.name2string(node) + " = '" + XsltForms_browser.getValue(node) + "' with " + this.separator);
			}
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: cannot split on " + XsltForms_browser.name2string(node) + " with " + this.separator + "(context " + XsltForms_browser.name2string(ctx) + ")");
		}
		XsltForms_globals.closeAction("XsltForms_split.prototype.run");
	}
};