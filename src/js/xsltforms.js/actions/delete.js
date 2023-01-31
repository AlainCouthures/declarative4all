"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module delete
 * @description  === "XsltForms_Delete" class ===
 * Delete Action Class
 * * constructor function : resolves the properties of this delete action
 */
    
new XsltForms_class("XsltForms_delete", "HTMLElement", "xforms-delete");

function XsltForms_delete(subform, elt) {
  this.subform = subform;
  this.binding = new XsltForms_binding(this.subform, elt);
  this.at = elt.hasAttribute("xf-at") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-at")) : null;
  this.context = elt.hasAttribute("xf-context") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-context")) : null;
  this.init(elt);
}

XsltForms_delete.prototype = new XsltForms_abstractAction();


    
/**
 * * '''run''' method : executes this delete action and dispatches "xforms-delete"
 */

XsltForms_delete.prototype.run = function(element, ctx) {
//  if (!element.xfElement) {
//console.log(Date.now() + ' ' +"missing");
//    return;
//  }
//console.log(Date.now() + ' ' +"valid");
  var i, len;
  if (this.context) {
    ctx = this.context.xpath_evaluate(ctx, null, this.subform).head();
  }
  if (!ctx) {
    return;
  }
  var nodes = this.binding.bind_evaluate(this.subform, ctx, this.element).toArray();
  for (i = 0; i < nodes.length; i++) {
    if (!nodes[i].ownerDocument || nodes[i].ownerDocument.documentElement === nodes[i]) {
      nodes.splice(i, 1);
      i--;
    }
  }
  if(this.at) {
    var index = XsltForms_globals.numberValue(this.at.xpath_evaluate(new XsltForms_exprContext(this.subform, ctx, 1, nodes, null, null, null, this.element)));
    if(!nodes[index - 1]) {
      return;
    }
    nodes = [nodes[index - 1]];
  }
  var model;
  var instance;
  if (nodes.length > 0) {
    model = document.getElementById(XsltForms_browser.getDocMeta(nodes[0].nodeType === Fleur.Node.DOCUMENT_NODE ? nodes[0] : nodes[0].ownerDocument, "model")).xfElement;
    instance = model.findInstance(nodes[0]);
  }
  var deletedNodes = [];
  for (i = 0, len = nodes.length; i < len; i++) {
    var node = nodes[i];
    XsltForms_mipbinding.nodedispose(node);
    var repeat = XsltForms_browser.getMeta(node, "repeat");
    if (repeat) {
      XsltForms_collection[repeat].xfElement.deleteNode(node);
    }
    if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
      var oldOwnerElement = node.ownerElement? node.ownerElement: node.selectSingleNode("..");
      //XsltForms_browser.clearMeta(node);
      if (oldOwnerElement.removeAttributeNS) {
        oldOwnerElement.removeAttributeNS(node.namespaceURI, node.nodeName);
      } else {
        oldOwnerElement.removeAttributeNode(node);
      }
      if (!XsltForms_browser.isIE && !XsltForms_browser.isIE11) {
        node.oldOwnerElement = oldOwnerElement;
      }
    } else {
      node.parentNode.removeChild(node);
    }
    deletedNodes.push(node);
  }
  if (deletedNodes.length > 0) {
    XsltForms_globals.addChange(model);
    model.setRebuilded(true);
    var evcontext = {"deleted-nodes": deletedNodes, "delete-location": index};
    XsltForms_xmlevents.dispatch(instance, "xforms-delete", null, null, null, null, evcontext);
  }
};