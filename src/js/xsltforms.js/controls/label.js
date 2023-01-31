"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module label
 * @description  === "XsltForms_label" class ===
 * Label Element  Class
 * * constructor function : initializes specific properties
 */
    
new XsltForms_class("XsltForms_label", "HTMLElement", "xforms-label");

function XsltForms_label(subform, elt) {
  XsltForms_globals.counters.label++;
  this.init(subform, elt);
  this.controlName = "label";
  if (elt.getAttribute("xf-ref") || elt.getAttribute("xf-value") || elt.getAttribute("xf-bind")) {
    this.hasBinding = true;
    this.binding = new XsltForms_binding(subform, elt);
  }
}

XsltForms_label.prototype = new XsltForms_element();


    
/**
 * * '''clone''' method : creates a new label element with the given id
 */

XsltForms_label.prototype.clone = function(id) { 
  return new XsltForms_label(this.subform, id, this.binding);
};


    
/**
 * * '''dispose''' method : decrements the number of labels and calls the parent dispose() method
 */

XsltForms_label.prototype.dispose = function() {
  XsltForms_globals.counters.label--;
  XsltForms_element.prototype.dispose.call(this);
};


    
/**
 * * '''build_''' method : specific build method
 */

XsltForms_label.prototype.build_ = function(ctx) {
  var nodes = this.evaluateBinding(this.binding, ctx);
  this.element.node = nodes.head();
  this.depsNodesRefresh.push(this.element.node);
};


    
/**
 * * '''refresh''' method : refreshes this label element
 */

XsltForms_label.prototype.refresh = function() {
  var node = this.element.node;
  var value = node? XsltForms_browser.getValue(node, true) : "";
  XsltForms_browser.setValue(this.element.getAttributeNode("label") ? this.element.getAttributeNode("label") : this.element, value);
};