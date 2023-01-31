"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module tree
 * @description
 */

new XsltForms_class("XsltForms_tree", "HTMLElement", "xforms-tree");

function XsltForms_tree(subform, id, binding) {
  this.init(subform, id);
  this.binding = binding;
  this.hasBinding = true;
  this.root = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "ul")[0] : this.element.getElementsByTagName("ul")[0];
  this.label = this.root.firstChild.cloneNode(true);
}

XsltForms_tree.prototype = new XsltForms_element();

XsltForms_tree.prototype.dispose = function() {
  this.root = null;
  this.selected = null;
  XsltForms_element.prototype.dispose.call(this);
};

XsltForms_tree.prototype.build_ = function(ctx) {
  var node = this.evaluateBinding(this.binding, ctx)[0];
  if (node) {
    var nodes = [];
    this.buildTree(this.root, 0, node, nodes);
    if (!this.selected || !XsltForms_browser.inArray(this.selected, nodes)) {
      this.select(this.root.firstChild);
    }
  }
};

XsltForms_tree.prototype.select = function(item) {
  var changed = true;
  var init = !!this.selected;
  if (init) {
    if (this.selected === item) {
      changed = false;
    } else {
      XsltForms_browser.setClass(this.selected, "xforms-tree-item-selected", false);
      XsltForms_browser.setClass(this.selected.childNodes[1], "xforms-tree-item-label-selected", false);
    }
  }
  if (changed) {
    this.element.node = item.node;
    this.selected = item;
    XsltForms_browser.setClass(item, "xforms-tree-item-selected", true);
    XsltForms_browser.setClass(item.childNodes[1], "xforms-tree-item-label-selected", true);
    XsltForms_globals.openAction();
    XsltForms_globals.addChange(this);
    XsltForms_globals.addChange(document.getElementById(XsltForms_browser.getDocMeta(item.node.ownerDocument, "model")).xfElement);
    XsltForms_globals.closeAction();
  }
};

XsltForms_tree.prototype.click = function(target) {
  if (target.className === "xforms-tree-item-button") {
    var ul = target.nextSibling.nextSibling;
    if (ul) {
      ul.style.display = ul.style.display !== "none"? "none" : "block";
    }
  } else if (XsltForms_browser.hasClass(target, "xforms-tree-item-label")) {
    this.select(target.parentNode);
  }
};

XsltForms_tree.prototype.buildTree = function(parentNode, index, node, nodes) {
  var li = null;
  var ul = null;
  var childs = node.childNodes;
  var nochild = childs.length === 0;
  nodes.push(node);
  if (parentNode.childNodes.length < index + 1) {
    li = this.label.cloneNode(true);
    parentNode.appendChild(li);
    XsltForms_repeat.initClone(li);
  } else {
    li = parentNode.childNodes[index];
    var last = li.lastChild;
    if (last.nodeName.toLowerCase() === "ul") {
      ul = last;
      if (nochild) {
        XsltForms_globals.dispose(ul);
        li.removeChild(ul);
      }
    }
  }
  li.node = node;
  XsltForms_browser.setClass(li, "xforms-tree-item-fork", !nochild);
  XsltForms_browser.setClass(li, "xforms-tree-item-leaf", nochild);
  for (var i = 0, len = childs.length; i < len; i++) {
    var child = childs[i];
    if (child.nodeType === Fleur.Node.ELEMENT_NODE) {
      if (!ul) {
        ul = XsltForms_browser.createElement("ul", li);
      }
      this.buildTree(ul, i, child, nodes);
    }
  }
  if (ul) {
    for (var j = ul.childNodes.length, len1 = childs.length; j > len1; j--) {
      XsltForms_globals.dispose(ul.lastChild);
      ul.removeChild(ul.lastChild);
    }
  }
};

XsltForms_tree.prototype.refresh = function() {
};