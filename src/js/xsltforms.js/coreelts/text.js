/*eslint-env browser*/
/*globals XsltForms_class XsltForms_coreElement*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module text
 * @description  === "XsltForms_text" class ===
 * Text Element Class
 * * constructor function : sets specific properties
 */
	
new XsltForms_class("XsltForms_text", "HTMLElement", "xforms-text");
		
function XsltForms_text(subform, elt) {
	elt.parentNode.xfElement.translation[elt.id] = elt.children[0].textContent;
}

XsltForms_text.prototype = new XsltForms_coreElement();
