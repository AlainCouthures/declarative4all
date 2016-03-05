/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_engine XsltForms_idManager XsltForms_browser XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module toggle
 * @description  === "XsltForms_toggle" class ===
 * Toggle Action Class
 * * constructor function : stores specific property
 */
		
function XsltForms_toggle(subform, caseId, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.caseId = caseId;
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_toggle.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : toggles on the associated element
 * @callback
 */

XsltForms_toggle.prototype.run = function(element, ctx) {
	XsltForms_toggle.toggle(this.caseId, ctx);
};


		
/**
 * * '''toggle''' method : toggles on the element according to its id and dispatches the "xforms-deselect" event
 */

XsltForms_toggle.toggle = function(caseId, ctx) {
	XsltForms_engine.openAction("XsltForms_toggle.toggle");
	if (typeof caseId === 'object') {
		if (!ctx) {
			ctx = XsltForms_engine.defaultModel.getInstanceDocument() ? XsltForms_engine.defaultModel.getInstanceDocument().documentElement : null;
		}
		caseId = XsltForms_engine.stringValue(caseId.xpath.xpath_evaluate(ctx));
	}
	var element = XsltForms_idManager.find(caseId);
	var childs = element ? element.parentNode.childNodes : [];
	var ul;
	var index = -1;
	if (childs.length > 0 && childs[0].nodeName.toLowerCase() === "ul") {
		ul = childs[0];
	}
	for (var i = ul ? 1 : 0, len = childs.length; i < len; i++) {
		var child = childs[i];
		if (child === element) {
			index = i - 1;
		} else {
			if (child.style && child.style.display !== "none") {
				child.style.display = "none";
				if (ul) {
					XsltForms_browser.setClass(ul.childNodes[i - 1], "ajx-tab-selected", false);
				}
			}
			XsltForms_xmlevents.dispatch(child, "xforms-deselect");
		}
	}
	if (element && element.style.display === "none") {
		element.style.display = "block";
		if (ul) {
			XsltForms_browser.setClass(ul.childNodes[index], "ajx-tab-selected", true);
		}
	}
	if (element) {
		XsltForms_xmlevents.dispatch(element, "xforms-select");
	}
	XsltForms_engine.closeAction("XsltForms_toggle.toggle");
};