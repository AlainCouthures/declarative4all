/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_globals XsltForms_browser XsltForms_idManager XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setselection
 * @description  === "XsltForms_setselection" class ===
 * Setselection Action Class
 * * constructor function : resolves specific properties
 */
		
function XsltForms_setselection(subform, control, value, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.control = control;
	this.value = value? XsltForms_xpath.get(value) : null;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_setselection.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the value of a node and records it in the changes collection
 */

XsltForms_setselection.prototype.run = function(element, ctx) {
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
	var value = XsltForms_globals.stringValue(this.value.xpath_evaluate(ctx, ctx, element.xfElement.subform, varresolver));
	var start = input.selectionStart;
	var end = input.selectionEnd;
	var newvalue = input.value.substring(0, start) + value + input.value.substring(end);
	XsltForms_globals.openAction("XsltForms_setselection.prototype.run");
	try {
		XsltForms_browser.setValue(control.boundnodes[0], newvalue);
		input.value = newvalue;
		if (!XsltForms_browser.isChrome) {
			input.focus();
		}
		input.setSelectionRange(start, start + value.length);
		document.getElementById(XsltForms_browser.getDocMeta(control.boundnodes[0].ownerDocument, "model")).xfElement.addChange(control.boundnodes[0]);
		XsltForms_browser.debugConsole.write("Set selection " + controlid + " = " + newvalue);
	} catch (e) {
		XsltForms_browser.debugConsole.write("ERROR: cannot set selection on " + controlid + " = " + newvalue + "(context " + XsltForms_browser.name2string(ctx) + ")");
	}
	XsltForms_globals.closeAction("XsltForms_setselection.prototype.run");
};