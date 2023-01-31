"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module group
 * @description  === "XsltForms_case" class ===
 * Case Element Class
 * * constructor function : sets specific properties
 */
  
new XsltForms_class("XsltForms_case", "HTMLElement", "xforms-case");
    
function XsltForms_case(subform, elt) {
  this.init(subform, elt);
}

XsltForms_case.prototype = new XsltForms_element();
