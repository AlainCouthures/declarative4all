/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module action
 * @description  === "XsltForms_action" class ===
 * Action Class
 * * constructor function : specifically initializes at no child
 */
		
function XsltForms_action(subform, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.init(ifexpr, whileexpr, iterateexpr);
	this.childs = [];
}

XsltForms_action.prototype = new XsltForms_abstractAction();


		
/**
 * * '''add''' method : adds a child action to this action
 */

XsltForms_action.prototype.add = function(action) {
	this.childs.push(action);
	action.parentAction = this;
	return this;
};


		
/**
 * * '''run''' method : executes each child action of this action
 */

XsltForms_action.prototype.run = function(element, ctx, evt) {
	var p = element;
	while (p) {
		if (p.xfElement) {
			if (p.xfElement.varResolver) {
				this.varResolver = {};
				for (var v in p.xfElement.varResolver) {
					this.varResolver[v] = p.xfElement.varResolver[v];
				}
			}
			break;
		}
		p = p.parentNode;
	}
	XsltForms_browser.forEach(this.childs, "execute", element, ctx, evt);
};