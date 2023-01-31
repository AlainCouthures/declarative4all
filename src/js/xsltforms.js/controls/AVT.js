"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module AVT
 * @description  === "XsltForms_avt" class ===
 * AVT Control  Class
 * * constructor function : initializes specific properties and initializes focus and blur event management
 */
//XsltForms_browser.addLoadListener(new Function(
//  "Array.prototype.slice.call(document.querySelectorAll('*[xf-avt]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); }  Array.prototype.slice.call(elt.attributes).filter(function(a) {return a.nodeName.startsWith('xf-template-');}).forEach(function(a) { new XsltForms_avt(XsltForms_subform.subforms['xsltforms-mainform'], elt, a.nodeName.substr(12)); }); });"
//));
    
function XsltForms_avt(subform, elt, attrname) {
  this.init(subform, elt);
  this.controlName = "avt";
  this.attrname = attrname;
  this.binding = new XsltForms_binding(subform, elt, "xf-template-" + attrname, "xsd:string");
  this.hasBinding = true;
  this.isOutput = true;
  if (attrname.toLowerCase() === "id") {
    var calcid = "xsltforms-id-";
    var prev = 1;
    while (elt.nodeType === Fleur.Node.ELEMENT_NODE) {
      while (elt.previousSibling) {
        if (elt.nodeType === Fleur.Node.ELEMENT_NODE) {
          prev++;
        }
        elt = elt.previousSibling;
      }
      calcid += prev + "_";
      elt = elt.parentNode;
      prev = 1;
    }
    this.element.setAttribute("id", calcid);
  } else if (this.binding && this.binding.type) {
    this.element.setAttribute(this.attrname, "");
  }
}

XsltForms_avt.prototype = new XsltForms_control();


    
/**
 * * '''clone''' method : creates a new output control with the given id
 */

XsltForms_avt.prototype.clone = function(id) { 
  return new XsltForms_avt(this.subform, id, this.attrname, this.binding);
};


    
/**
 * * '''dispose''' method : clears properties of this control and calls the parent dispose() method
 */

XsltForms_avt.prototype.dispose = function() {
  XsltForms_control.prototype.dispose.call(this);
};


    
/**
 * * '''setValue''' method : sets the value of this AVT control
 */

XsltForms_avt.prototype.setValue = function(value) {
  if (this.attrname === "id" && this.element.id === this.element.getAttribute("oldid")) {
    if (!XsltForms_globals.idalt) {
      XsltForms_globals.idalt = {};
    }
    XsltForms_globals.idalt[this.element.id] = this.element;
  }
  this.element.setAttribute(this.attrname, value);
};

    
/**
 * * '''getValue''' method : gets the value of this AVT control
 * @callback
 */

XsltForms_avt.prototype.getValue = function(value) {
  return this.element.getAttribute(this.attrname);
};