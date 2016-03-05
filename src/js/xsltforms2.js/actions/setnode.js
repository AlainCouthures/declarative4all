/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_engine XsltForms_browser XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setnode
 * @description  === "XsltForms_setnode" class ===
 * SetNode Action Class
 * * constructor function : resolves specific properties
 */
		
function XsltForms_setnode(subform, binding, value, inout, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.value = value? XsltForms_xpath.get(value) : null;
	this.inout = inout;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_setnode.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 * @callback
 */

XsltForms_setnode.prototype.run = function(element, ctx) {
	var node = this.binding.bind_evaluate(this.subform, ctx)[0];
	if (node) {
		if (this.context) {
			ctx = this.context.xpath_evaluate(ctx)[0];
		}
		var value = this.value? XsltForms_engine.stringValue(this.context ? this.value.xpath_evaluate(ctx, ctx) : this.value.xpath_evaluate(node, ctx)) : this.literal;
		var modelid = XsltForms_browser.getDocMeta(node.ownerDocument, "model");
		var instanceid = XsltForms_browser.getDocMeta(node.ownerDocument, "instance");
		XsltForms_engine.openAction("XsltForms_setnode.prototype.run");
		if (this.inout) {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
			var tempnode = node.ownerDocument.createTextNode("temp");
			node.appendChild(tempnode);
			XsltForms_browser.loadNode(tempnode, value || "", "application/xml");
		} else {
			XsltForms_browser.loadNode(node, value || "", "application/xml");
			XsltForms_browser.setDocMeta(node.ownerDocument, "model", modelid);
			XsltForms_browser.setDocMeta(node.ownerDocument, "instance", instanceid);
		}
		var model = document.getElementById(modelid).xfElement;
		XsltForms_engine.addChange(model);
		XsltForms_browser.debugConsole.write("Setnode " + node.nodeName + (this.inout ? " inner" : " outer") + " = " + value); 
		XsltForms_xmlevents.dispatch(model, "xforms-rebuild");
		XsltForms_engine.refresh();
		XsltForms_engine.closeAction("XsltForms_setnode.prototype.run");
	}
};