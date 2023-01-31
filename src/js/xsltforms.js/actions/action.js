"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module action
 * @description  === "XsltForms_action" class ===
 * Action Class
 * * constructor function : specifically initializes at no child
 */
    
new XsltForms_class("XsltForms_action", "HTMLElement", "xforms-action");

function XsltForms_action(subform, elt) {
  this.subform = subform;
  this.init(elt);
  this.jsaction = elt.getAttribute("xf-type") === "text/javascript";
  if (this.jsaction) {
    let body = "", params = [];
    Array.prototype.slice.call(elt.children).forEach(function(n) {
      switch(n.localName.toLowerCase()) {
        case "xforms-body":
          body = n.textContent;
          break;
        case "xforms-param":
          params.push({
            name: n.getAttribute("xf-name"),
            value: n.hasAttribute("xf-value") ? new XsltForms_binding(subform, n, null, "constant") : n.textContent
          });
          break;
      }
    });
    this.params = params;
    this.jsfunction = eval(
      "(" +
      params.reduce((s, p) => s === "" ? p.name : s + ", " + p.name, "") +
      ") => {" +
      body +
      "}"
    );
  }
}

XsltForms_action.prototype = new XsltForms_abstractAction();


    
/**
 * * '''add''' method : adds a child action to this action
 */

//XsltForms_action.prototype.add = function(action) {
//  this.childs.push(action);
//  action.parentAction = this;
//  return this;
//};


    
/**
 * * '''run''' method : executes each child action of this action
 */

XsltForms_action.prototype.run = function(element, ctx, evt) {
  if (this.jsaction) {
    const args = this.params.map(p => p.value.bind_evaluate ?
      p.value.bind_evaluate(this.subform, ctx, element) :
      p.value);
    this.jsfunction.apply(null, args);
    return;
  }
  XsltForms_browser.forEach(Array.prototype.slice.call(this.element.children).map(function(elt) { return elt.xfElement; }), "execute", element, ctx, evt);
};