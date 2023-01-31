"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module insert
 * @description  === "XsltForms_insert" class ===
 * Insert Action Class
 * * constructor function : resolves specific properties
 */
    
new XsltForms_class("XsltForms_insert", "HTMLElement", "xforms-insert");

function XsltForms_insert(subform, elt) {
  this.subform = subform;
  this.binding = new XsltForms_binding(this.subform, elt);
  this.origin = elt.hasAttribute("xf-origin") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-origin")) : null;
  this.at = elt.hasAttribute("xf-at") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-at")) : null;
  this.context = elt.hasAttribute("xf-context") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-context")) : null;
  this.position = elt.getAttribute("xf-position") || "after";
  this.init(elt);
}

XsltForms_insert.prototype = new XsltForms_abstractAction();


    
/**
 * * '''run''' method : clones then inserts a new element and dispatches the "xforms-insert"
 */

XsltForms_insert.prototype.run = function(element, ctx) {
  if (this.context) {
    ctx = this.context.xpath_evaluate(ctx).head();
  }
  if (!ctx) {
    return;
  }
  var nodes = [];
  if( this.binding.bind || this.binding.xpath ) {
    nodes = this.binding.bind_evaluate(this.subform, ctx, this.element).toArray();
  }
  var index = 0;
  var node = null;
  var originNodes = [];
  var parentNode = null;
  var pos = this.position === "after"? 1 : 0;
  var res = 0;
  if (this.origin) {
    originNodes = this.origin.xpath_evaluate(ctx, null, null, this.element).toArray();
  }
  if (originNodes.length === 0) {
    if (nodes.length === 0) {
      return;
    }
    originNodes.push(nodes[nodes.length - 1]);
  }
  for(var i = 0, len = originNodes.length; i < len; i += 1) {
    node = originNodes[i];
    if (nodes.length === 0) {
      parentNode = ctx;
    } else {
      parentNode = nodes[0].nodeType === Fleur.Node.DOCUMENT_NODE? nodes[0] : nodes[0].nodeType === Fleur.Node.ATTRIBUTE_NODE? nodes[0].ownerDocument ? nodes[0].ownerDocument : nodes[0].selectSingleNode("..") : nodes[0].parentNode;
      if (parentNode.nodeType !== Fleur.Node.DOCUMENT_NODE && node.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
        res = this.at ? Math.round(XsltForms_globals.numberValue(this.at.xpath_evaluate(new XsltForms_exprContext(this.subform, ctx, 1, nodes, null, null, null, this.element)))) + i - 1: nodes.length - 1;
        index = isNaN(res)? nodes.length : res + pos;
      }
    }
    XsltForms_browser.debugConsole.write("insert " + node.nodeName + " in " + parentNode.nodeName + " at " + index + " - " + ctx.nodeName);
    var clone = parentNode.ownerDocument ? parentNode.ownerDocument.importNode(node, true) : parentNode.importNode(node, true);
    XsltForms_browser.clearMeta(clone);
    if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
      XsltForms_browser.setAttributeNS(parentNode, node.namespaceURI, node.nodeName, node.nodeValue);
    } else {
      if (parentNode.nodeType === Fleur.Node.DOCUMENT_NODE) {
        var first = parentNode.documentElement;
        var prevmodel = XsltForms_browser.getDocMeta(parentNode, "model");
        var previnst = XsltForms_browser.getDocMeta(parentNode, "instance");
        parentNode.removeChild(first);
        first = null;
        parentNode.appendChild(clone);
        XsltForms_browser.setDocMeta(parentNode, "instance", previnst);
        XsltForms_browser.setDocMeta(parentNode, "model", prevmodel);
      } else {
        var nodeAfter;
        if (index >= nodes.length && nodes.length !== 0) {
          nodeAfter = nodes[nodes.length - 1].nextSibling;
        } else {
          nodeAfter = nodes[index];
        }
        if (nodeAfter) {
          nodeAfter.parentNode.insertBefore(clone, nodeAfter);
        } else if (nodes.length === 0 && parentNode.firstChild) {
          parentNode.insertBefore(clone, parentNode.firstChild);
        } else {
          parentNode.appendChild(clone);
        }
        var repeat = nodes.length > 0? XsltForms_browser.getMeta(nodes[0], "repeat") : null;
        nodes.push(clone);
        if (repeat) {
          XsltForms_collection[repeat].xfElement.insertNode(clone, nodeAfter);
        }
      }
    }
  }
  var model = document.getElementById(XsltForms_browser.getDocMeta(parentNode.nodeType === Fleur.Node.DOCUMENT_NODE ? parentNode : parentNode.ownerDocument, "model")).xfElement;
  XsltForms_globals.addChange(model);
  model.setRebuilded(true);
  var evcontext = {"inserted-nodes": [clone], "origin-nodes": originNodes, "insert-location-node": index, position: this.position};
  XsltForms_xmlevents.dispatch(model.findInstance(parentNode), "xforms-insert", null, null, null, null, evcontext);
};