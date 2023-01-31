"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module toggle
 * @description  === "XsltForms_toggle" class ===
 * Toggle Action Class
 * * constructor function : stores specific property
 */
    
new XsltForms_class("XsltForms_toggle", "HTMLElement", "xforms-toggle");

function XsltForms_toggle(subform, elt) {
  this.subform = subform;
  var tcase;
  Array.prototype.slice.call(elt.children).forEach(function(n) {
    switch(n.localName.toLowerCase()) {
      case "xforms-case":
        tcase = n;
        break;
    }
  });
  this.caseId = tcase ? tcase.hasAttribute("xf-value") ? new XsltForms_binding(this.subform, tcase) : tcase.textContent : elt.getAttribute("xf-case");
  this.init(elt);
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
  XsltForms_globals.openAction("XsltForms_toggle.toggle");
  if (typeof caseId === 'object') {
    if (!ctx) {
      ctx = XsltForms_globals.defaultModel.getInstanceDocument() ? XsltForms_globals.defaultModel.getInstanceDocument().documentElement : null;
    }
    caseId = XsltForms_globals.stringValue(caseId.xpath.xpath_evaluate(ctx));
  }
  var element = XsltForms_idManager.find(caseId);
  var childs = element ? element.parentNode.children : [];
  for (var i = 0, len = childs.length; i < len; i++) {
    var child = childs[i];
    if (child !== element && child.hasAttribute("xf-selected")) {
      child.removeAttribute("xf-selected");
      //XsltForms_browser.setClass(child, "xforms-enabled", false);
      XsltForms_xmlevents.dispatch(child, "xforms-deselect");
    }
  }
  if (element) {
    //XsltForms_browser.setClass(element, "xforms-enabled", true);
    element.setAttribute("xf-selected", "true");
    XsltForms_xmlevents.dispatch(element, "xforms-select");
  }
  XsltForms_globals.closeAction("XsltForms_toggle.toggle");
};