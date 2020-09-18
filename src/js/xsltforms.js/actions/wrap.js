/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_globals XsltForms_browser XsltForms_idManager XsltForms_xmlevents XsltForms_class XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module wrap
 * @description  === "XsltForms_wrap" class ===
 * Wrap Action Class
 * * constructor function : resolves specific properties
 */
		
new XsltForms_class("XsltForms_wrap", "HTMLElement", "xforms-wrap");

function XsltForms_wrap(subform, elt) {
	this.subform = subform;
	this.control = elt.getAttribute("xf-control");
	this.prevalue = elt.hasAttribute("xf-pre") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-pre")) : null;
	this.postvalue = elt.hasAttribute("xf-post") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-post")) : null;
	this.context = elt.hasAttribute("xf-context") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-context")) : null;
	this.init(elt);
}

XsltForms_wrap.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 */

XsltForms_wrap.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	if (this.context) {
		ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
	}
	var controlid = this.control;
	if (controlid && controlid.bind_evaluate) {
		controlid = XsltForms_globals.stringValue(controlid.bind_evaluate(this.subform, ctx, varresolver));
	}
	var control = XsltForms_idManager.find(controlid).xfElement;
	var input = control.input;
	var prevalue = this.prevalue;
	if (prevalue && prevalue.bind_evaluate) {
		prevalue = XsltForms_globals.stringValue(prevalue.bind_evaluate(this.subform, ctx, varresolver));
	}
	var postvalue = this.postvalue;
	if (postvalue && postvalue.bind_evaluate) {
		postvalue = XsltForms_globals.stringValue(postvalue.bind_evaluate(this.subform, ctx, varresolver));
	}
	if (prevalue + postvalue !== "") {
		var start = input.selectionStart;
		var end = input.selectionEnd;
		var wrapvalue = input.value.substring(0, start) + prevalue + input.value.substring(start, end) + postvalue + input.value.substring(end);
		XsltForms_globals.openAction("XsltForms_wrap.prototype.run");
		try {
			XsltForms_browser.setValue(control.boundnodes[0], wrapvalue || "");
			input.value = wrapvalue || "";
			if (!XsltForms_browser.isChrome) {
				input.focus();
			}
			input.setSelectionRange(start, end + prevalue.length + postvalue.length);
			document.getElementById(XsltForms_browser.getDocMeta(control.boundnodes[0].ownerDocument, "model")).xfElement.addChange(control.boundnodes[0]);
			XsltForms_browser.debugConsole.write("Wrap " + controlid + " = " + wrapvalue);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: cannot wrap on " + controlid + " = " + wrapvalue + "(context " + XsltForms_browser.name2string(ctx) + ")");
		}
		XsltForms_globals.closeAction("XsltForms_wrap.prototype.run");
	}
};