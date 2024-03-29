"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module ExprContext
 * @description  === XsltForms_exprContext Class ===
 * Context for XPath Expression evaluation Class
 * * constructor function : initializes specific properties
 */
    
function XsltForms_exprContext(subform, node, position, nodelist, parentNode, nsresolver, current, elt, depsNodes, depsId, depsElements) {
  this.subform = subform;
  this.node = node;
  this.current = current || node;
  if (!position) {
    var repeat = node && node.nodeType ? XsltForms_browser.getMeta(node, "repeat") : null;
    if (repeat) {
      var eltrepeat = XsltForms_collection[repeat];
      if (eltrepeat) {
        var xrepeat = eltrepeat.xfElement;
        var len;
        for (position = 1, len = xrepeat.nodes.length; position <= len; position++) {
          if (node === xrepeat.nodes[position - 1]) {
            break;
          }
        }
      }
    }
  }
  this.position = position || 1;
  this.nodelist = nodelist || [node];
  this.parent = parentNode;
  this.root = parentNode ? parentNode.root : node ? node.ownerDocument : null;
  this.nsresolver = nsresolver;
  this.element = elt;
  this.depsId = depsId;
  this.initDeps(depsNodes, depsElements);
}


    
/**
 * * '''clone''' method : creates a new expression context based on this Expression Context object
 */

XsltForms_exprContext.prototype.clone = function(node, position, nodelist) {
  return new XsltForms_exprContext(this.subform, node || this.node, 
    typeof position === "undefined" ? this.position : position,
    nodelist || this.nodelist, this, this.nsresolver, this.current, this.element,
    this.depsNodes, this.depsId, this.depsElements);
};


    
/**
 * * '''setNode''' method : set node and position properties for this Expression Context object
 */

XsltForms_exprContext.prototype.setNode = function(node, position) {
  this.node = node;
  this.position = position;
};


    
/**
 * * '''initDeps''' method : initializes dependency collections for this Expression Context object
 */

XsltForms_exprContext.prototype.initDeps = function(depsNodes, depsElements) {
  this.depsNodes = depsNodes || [];
  this.depsElements = depsElements || [];
};


    
/**
 * * '''addDepNode''' method : adds a node to the corresponding dependency collection for this Expression Context object
 */

XsltForms_exprContext.prototype.addDepNode = function(node) {
  var deps = this.depsNodes;
  if (deps && node.nodeType && node.nodeType !== Fleur.Node.DOCUMENT_NODE && (!this.depsId || !XsltForms_browser.inValueMeta(node, "depfor", this.depsId))) { // !inArray(node, deps)) {
    if (this.depsId) {
      XsltForms_browser.addValueMeta(node, "depfor", this.depsId);
    }
    deps.push(node);
  }
};


    
/**
 * * '''addDepElement''' method : adds an element to the corresponding dependency collection for this Expression Context object
 */

XsltForms_exprContext.prototype.addDepElement = function(element) {
  var deps = this.depsElements;
  if (deps && !XsltForms_browser.inArray(element, deps)) {
    deps.push(element);
  }
};