"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module itemset
 * @description  === "XsltForms_itemset" class ===
 * ItemSet Element  Class
 * * constructor function : initializes specific properties
 */
    
new XsltForms_class("XsltForms_itemset", "HTMLElement", "xforms-itemset");

function XsltForms_itemset(subform, elt) {
  var labelBinding, valueBinding, copyBinding;
  XsltForms_globals.counters.itemset++;
  this.init(subform, elt);
  this.controlName = "itemset";
  this.nodesetBinding = new XsltForms_binding(subform, elt);
  Array.prototype.slice.call(elt.children).forEach(function(n) {
    switch(n.localName.toLowerCase()) {
      case "xforms-label":
        labelBinding = n;
        break;
      case "xforms-value":
        valueBinding = n;
        break;
      case "xforms-copy":
        copyBinding = n;
        break;
    }
  });
  this.labelContent = labelBinding ? labelBinding.innerHTML : "";
  this.labelBinding = labelBinding && labelBinding.hasAttribute("xf-ref") ? new XsltForms_binding(subform, labelBinding) : null;
  this.valueBinding = valueBinding ? new XsltForms_binding(subform, valueBinding) : null;
  this.copyBinding = copyBinding ? new XsltForms_binding(subform, copyBinding) : null;
  this.hasBinding = true;
}

XsltForms_itemset.prototype = new XsltForms_element();


    
/**
 * * '''build_''' method : specific build method with the corresponding clones creation
 */

XsltForms_itemset.prototype.build_ = function(ctx) {
  if (this.element.getAttribute("cloned")) {
    return;
  }
  this.nodes = this.evaluateBinding(this.nodesetBinding, ctx).toArray();
  var elt = this.element;
  var xfelt = this;
  if (this.nodes.length !== 0) {
    this.element.setAttribute("xf-bound", "");
  } else {
    this.element.removeAttribute("xf-bound");
  }
  var subform = this.subform;
  Array.prototype.slice.call(elt.querySelectorAll("xforms-item")).forEach(function(item) {
    elt.removeChild(item);
  });
  this.nodes.reverse().forEach(function(n) {
    var ielt = document.createElement("xforms-item");
    var result, nodeLabel, nodeValue, nlabel, nvalue;
    if (xfelt.labelBinding) {
      result = xfelt.evaluateBinding(xfelt.labelBinding, n);
      if (typeof result === "object") {
        nodeLabel = result[0];
        xfelt.depsNodesRefresh.push(nodeLabel);
        try {
          nlabel = XsltForms_browser.getValue(nodeLabel, true);
        } catch(e) {
        }
      } else {
        nlabel = result;
      }
    } else {
      nlabel = xfelt.labelContent;
    }
    result = xfelt.valueBinding ? xfelt.evaluateBinding(xfelt.valueBinding, n) : null;
    if (xfelt.valueBinding && result) {
      if (Fleur.minimal) {
        if (typeof result === "object") {
          nodeValue = result[0];
          xfelt.depsNodesRefresh.push(nodeValue);
          try {
            nvalue = XsltForms_browser.getValue(nodeValue);
          } catch(e2) {
          }
        } else {
          nvalue = result;
        }
      } else {
        if (result.nodeType !== Fleur.Node.TEXT_NODE && result.head) {
          nodeValue = result.head();
          xfelt.depsNodesRefresh.push(nodeValue);
          try {
            nvalue = XsltForms_browser.getValue(nodeValue);
          } catch(e2) {
          }
        } else {
          nvalue = result.data || result;
        }
      }
    }
    var nodeCopy = xfelt.copyBinding ? xfelt.evaluateBinding(xfelt.copyBinding, n).head() : null;
    if (xfelt.copyBinding && nodeCopy) {
      elt.parentNode.parentNode.xfElement.hasCopy = true;
      xfelt.depsNodesRefresh.push(nodeCopy);
      try {
        nvalue = Fleur.Serializer.escapeXML(XsltForms_browser.saveNode(nodeCopy, "application/xml"));
      } catch(e3) {
      }
    }
    ielt.innerHTML = "<xforms-label>" + nlabel + "</xforms-label><xforms-value" + (xfelt.copyBinding && nodeCopy ? " xf-copy" : "") + ">" + nvalue + "</xforms-value>";
    elt.insertBefore(ielt, elt.firstChild);
    if (xfelt.labelBinding) {
      XsltForms_classes["xforms-item"].classbinding(subform, ielt);
    } else {
      ielt.node = n;
      XsltForms_repeat.initClone(subform, ielt);
    }
  });
  var xfparent = elt.parentNode.parentNode;
  if (xfparent.localName.toLowerCase() === "xforms-body") {
    xfparent = xfparent.parentNode;
  }
  var xfparentelement = xfparent.xfElement;
  if (xfparentelement instanceof Array) {
    xfparentelement = xfparentelement[0];
  }
  xfparentelement.initBody();
  xfparentelement.setValue(xfparentelement.currentValue);
  /*
  var next = this.element;
  var parentNode = next.parentNode;
  var l = this.nodes.length;
  var oldNode = next;
  var listeners = next.listeners;
  var cont = 1;
  while (next) {
    next = next.nextSibling;
    if (next) {
      if (next.nodeType === Fleur.Node.ELEMENT_NODE) {
        if (next.getAttribute("cloned")) {
          if (cont >= l) {
            next.listeners = null;
            parentNode.removeChild(next);
            next = oldNode;
          } else {
            next.node = this.nodes[cont];
            this.refresh_(next, cont++);
            oldNode = next;
          }
        }
      } else {
        var n = next.previousSibling;
        next.parentNode.removeChild(next);
        next = n;
      }
    } else {
      for (var i = cont; i < l; i++) {
        var node = this.element.cloneNode(true);
        node.setAttribute("cloned", "true");
        if (node.id) {
          XsltForms_idManager.cloneId(node);
        }
        node.node = this.nodes[i];
        parentNode.appendChild(node);
        this.refresh_(node, i);
        if (listeners && !XsltForms_browser.isIE) {
          for (var j = 0, len = listeners.length; j < len; j++) {
            listeners[j].clone(node);
          }
        }
      }
      break;
    }
  }
  if (l > 0) {
    this.element.node = this.nodes[0];
    this.refresh_(this.element, 0);
  } else {
    this.element.value = "\xA0";
    this.element.text = "\xA0";
  }
  */
};


    
/**
 * * '''refresh''' method : sets "xforms-disabled" CSS class
 */

XsltForms_itemset.prototype.refresh = function() {
/*
  var parentNode = this.element.parentNode;
  var i = 0;
  while (parentNode.childNodes[i] !== this.element) {
    i++;
  }
  for (var j = 0, len = this.nodes.length; j < len || j === 0; j++) {
    XsltForms_browser.setClass(parentNode.childNodes[i+j], "xforms-disabled", this.nodes.length === 0);
  }
*/
};


    
/**
 * * '''clone''' method : creates a new itemset control with the given id
 */

XsltForms_itemset.prototype.clone = function(id) {
  return new XsltForms_itemset(this.subform, id, this.nodesetBinding, this.labelBinding, this.valueBinding, this.copyBinding);
};


    
/**
 * * '''dispose''' method : decrements the number of itemsets and calls the parent dispose() method
 */

XsltForms_itemset.prototype.dispose = function() {
  XsltForms_globals.counters.itemset--;
  XsltForms_element.prototype.dispose.call(this);
};


    
/**
 * * '''refresh_''' method : refreshes this ItemSet Control at a given position
 */

XsltForms_itemset.prototype.refresh_ = function(element, cont) {
  var result, ctx = this.nodes[cont], nodeLabel, nodeValue;
  result = this.evaluateBinding(this.labelBinding, ctx);
  if (typeof result === "object") {
    nodeLabel = result[0];
    this.depsNodesRefresh.push(nodeLabel);
    try {
      element.text = XsltForms_browser.getValue(nodeLabel, true);
    } catch(e) {
    }
  } else {
    element.text = result;
  }
  result = this.valueBinding ? this.evaluateBinding(this.valueBinding, ctx) : null;
  if (this.valueBinding && result) {
    if (typeof result === "object") {
      nodeValue = result[0];
      this.depsNodesRefresh.push(nodeValue);
      try {
        element.value = XsltForms_browser.getValue(nodeValue);
      } catch(e2) {
      }
    } else {
      element.value = result;
    }
  }
  var nodeCopy = this.copyBinding ? this.evaluateBinding(this.copyBinding, ctx)[0] : null;
  if (this.copyBinding && nodeCopy) {
    element.parentNode.parentNode.parentNode.xfElement.hasCopy = true;
    this.depsNodesRefresh.push(nodeCopy);
    try {
      element.value = XsltForms_browser.saveNode(nodeCopy, "application/xml");
      element.setAttribute("xf-copy", "");
    } catch(e3) {
    }
  }
};