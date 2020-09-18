/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser XsltForms_idManager XsltForms_globals XsltForms_class XsltForms_subform XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module confirm
 * @description
 */

new XsltForms_class("XsltForms_confirm", "HTMLElement", "xforms-confirm");

function XsltForms_confirm(subform, elt) {
	this.subform = subform;
	this.binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(this.subform, elt) : null;
	this.id = elt.id;
	this.init(elt);
}

XsltForms_confirm.prototype = new XsltForms_abstractAction();

/**
 * @callback
 */
XsltForms_confirm.prototype.run = function(element, ctx, evt) {
	var text;
	if (this.binding) {
		var node = this.binding.bind_evaluate(ctx)[0];
		if (node) {
			text = XsltForms_browser.getValue(node);
		}
	} else {
		var e = XsltForms_idManager.find(this.id);
		XsltForms_globals.build(e, ctx);
		text = e.textContent || e.innerText;
	}
	if (text) {
		var res = XsltForms_browser.confirm(text.trim());
		if (!res) {
			evt.stopPropagation();
			evt.stopped = true;
		}
	}
};