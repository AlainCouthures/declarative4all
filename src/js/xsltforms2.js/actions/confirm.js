/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser XsltForms_idManager XsltForms_engine*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module confirm
 * @description
 */
function XsltForms_confirm(subform, id, binding, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.id = id;
	this.binding = binding;
	this.init(ifexpr, whileexpr, iterateexpr);
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
		XsltForms_engine.build(e, ctx);
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