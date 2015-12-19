/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser XsltForms_idManager XsltForms_globals*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module message
 * @description  === "XsltForms_message" class ===
 * Message Action Class
 * * constructor function : stores specific properties
 */
		
function XsltForms_message(subform, id, binding, level, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.id = id;
	this.level = level;
	this.init(ifexpr, whileexpr, iterateexpr);
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
		var e = XsltForms_idManager.find(this.id);
		var building = XsltForms_globals.building;
		XsltForms_globals.building = true;
		XsltForms_globals.build(e, ctx, null, this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver);
		XsltForms_globals.building = building;
		text = e.textContent || e.innerText;
	}

	if (text) {
		alert(text.trim());
	}
};