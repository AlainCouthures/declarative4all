"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module itext
 * @description  === "XsltForms_itext" class ===
 * Itext Element Class
 * * constructor function : sets specific properties
 */
  
new XsltForms_class("XsltForms_itext", "HTMLElement", "xforms-itext");
    
function XsltForms_itext(subform, elt) {
  elt.parentNode.xfElement.itext = {
    defaultlang: elt.children[0].getAttribute("xf-lang")
  };
}

XsltForms_itext.prototype = new XsltForms_coreElement();
