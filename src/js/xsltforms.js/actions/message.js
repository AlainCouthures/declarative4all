/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser XsltForms_idManager XsltForms_globals XsltForms_class XsltForms_subform XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module message
 * @description  === "XsltForms_message" class ===
 * Message Action Class
 * * constructor function : stores specific properties
 */
		
new XsltForms_class("XsltForms_message", "HTMLElement", "xforms-message");

function XsltForms_message(subform, elt) {
	this.subform = subform;
	this.binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(this.subform, elt) : null;
	//this.id = elt.id;
	this.level = elt.getAttribute("xf-level");
	this.init(elt);
}

XsltForms_message.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : displays an alert message box containing a node value
 */

XsltForms_message.prototype.run = function(element, ctx) {
	var text;
	if (this.binding) {
		var node = this.binding.bind_evaluate(this.subform, ctx, this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver)[0];
		if (node) {
			text = XsltForms_browser.getValue(node);
		}
	} else {
		var e = this.element;//XsltForms_idManager.find(this.id);
		var building = XsltForms_globals.building;
		XsltForms_globals.building = true;
		this.running = true;
		XsltForms_globals.build(e, ctx, null, this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver);
		this.running = false;
		XsltForms_globals.building = building;
		text = this.element.textContent || this.element.innerText;
	}

	if (text) {
		alert(text.trim());
	}
};