/*eslint-env browser*/
/*globals XsltForms_xpath XsltForms_abstractAction XsltForms_idManager XsltForms_globals XsltForms_browser XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setindex
 * @description  === "XsltForms_setindex" class ===
 * SetIndex Action Class
 * * constructor function : resolves specific properties
 */
		
function XsltForms_setindex(subform, repeat, index, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.repeat = repeat;
	this.index = XsltForms_xpath.get(index);
	this.init(ifexpr, whileexpr, iterateexpr);
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