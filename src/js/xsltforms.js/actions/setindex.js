/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_idManager XsltForms_globals XsltForms_browser XsltForms_xmlevents XsltForms_class XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setindex
 * @description  === "XsltForms_setindex" class ===
 * SetIndex Action Class
 * * constructor function : resolves specific properties
 */
		
new XsltForms_class("XsltForms_setindex", "HTMLElement", "xforms-setindex");

function XsltForms_setindex(subform, elt) {
	this.subform = subform;
	this.repeat = elt.getAttribute("xf-repeat");
	this.index = elt.hasAttribute("xf-index") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-index")) : null;
	this.context = elt.hasAttribute("xf-context") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-context")) : null;
	this.init(elt);
}

XsltForms_setindex.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : sets the current index of a repeat structure
 * @callback
 */

XsltForms_setindex.prototype.run = function(element, ctx) {
	var repeat = XsltForms_idManager.find(this.repeat);
	var index = XsltForms_globals.numberValue(this.index.xpath_evaluate(ctx));
	XsltForms_browser.debugConsole.write("setIndex " + index);
	if (!isNaN(index)) {
		if (index < 1) {
			index = 1;
			XsltForms_xmlevents.dispatch(repeat.xfElement, "xforms-scroll-first");
		} else if (index > repeat.xfElement.nodes.length) {
			index = repeat.xfElement.nodes.length;
			XsltForms_xmlevents.dispatch(repeat.xfElement, "xforms-scroll-last");
		}
		repeat.xfElement.setIndex(index);
	}
};