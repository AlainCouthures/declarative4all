"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module translation
 * @description  === "XsltForms_translation" class ===
 * Translation Element Class
 * * constructor function : sets specific properties
 */
  
new XsltForms_class("XsltForms_translation", "HTMLElement", "xforms-translation");
    
function XsltForms_translation(subform, elt) {
  this.translation = elt.parentNode.parentNode.xfElement.itext[elt.getAttribute("xf-lang")] = {};
}

XsltForms_translation.prototype = new XsltForms_coreElement();
