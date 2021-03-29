/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_globals XsltForms_browser XsltForms_xmlevents XsltForms_class XsltForms_subform XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setnode
 * @description  === "XsltForms_setnode" class ===
 * SetNode Action Class
 * * constructor function : resolves specific properties
 */
		
new XsltForms_class("XsltForms_setnode", "HTMLElement", "xforms-setnode");

function XsltForms_setnode(subform, elt) {
	this.subform = subform;
	this.binding = new XsltForms_binding(this.subform, elt);
	this.inout = elt.hasAttribute("xf-inner");
	this.value = this.inout ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-inner")) : XsltForms_xpath.create(this.subform, elt.getAttribute("xf-outer"));
	this.context = elt.hasAttribute("xf-context") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-context")) : null;
	this.init(elt);
}

XsltForms_setnode.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 * @callback
 */

XsltForms_setnode.prototype.run = function(element, ctx) {
	var node = this.binding.bind_evaluate(this.subform, ctx).head();
	if (node) {
		if (this.context) {
			ctx = this.context.xpath_evaluate(ctx).head();
		}
		var value = this.value? XsltForms_globals.stringValue(this.context ? this.value.xpath_evaluate(ctx, ctx) : this.value.xpath_evaluate(node, ctx)) : this.literal;
		var modelid = XsltForms_browser.getDocMeta(node.ownerDocument, "model");
		var instanceid = XsltForms_browser.getDocMeta(node.ownerDocument, "instance");
		XsltForms_globals.openAction("XsltForms_setnode.prototype.run");
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
		XsltForms_globals.addChange(model);
		XsltForms_browser.debugConsole.write("Setnode " + node.nodeName + (this.inout ? " inner" : " outer") + " = " + value); 
		XsltForms_xmlevents.dispatch(model, "xforms-rebuild");
		XsltForms_globals.refresh();
		XsltForms_globals.closeAction("XsltForms_setnode.prototype.run");
	}
};