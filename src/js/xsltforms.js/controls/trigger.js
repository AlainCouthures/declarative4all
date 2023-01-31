"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module trigger
 * @description  === "XsltForms_trigger" class ===
 * Trigger Control  Class
 * * constructor function : initializes specific properties and initializes focus event management
 */
    
new XsltForms_class("XsltForms_trigger", "HTMLElement", "xforms-trigger", "<xforms-label></xforms-label><xforms-body></xforms-body><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");
new XsltForms_class("XsltForms_trigger", "HTMLElement", "xforms-submit", "<xforms-label></xforms-label><xforms-body></xforms-body><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");

function XsltForms_trigger(subform, elt) {
  this.init(subform, elt);
  switch(elt.localName.toLowerCase()) {
    case "xforms-trigger":
      this.binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(subform, elt) : null;
      break;
    case "xforms-submit":
      var send = document.createElement("xforms-send");
      send.setAttribute("ev-event", "DOMActivate");
      if (elt.hasAttribute("xf-submission")) {
        send.setAttribute("xf-submission", elt.getAttribute("xf-submission"));
      }
      elt.appendChild(send);
      XsltForms_classes["xforms-dispatch"].classbinding(subform, send);
      break;
  }
  var appearance = elt.getAttribute("xf-appearance");
  this.appearance = appearance? appearance : "full";
  XsltForms_globals.counters.trigger++;
  this.controlName = "trigger";
  this.hasBinding = Boolean(this.binding);
  var cells = Array.prototype.slice.call(this.element.children);
  for (var i = 0, l = cells.length; i < l; i++) {
    var cname = cells[i].localName.toLowerCase();
    if (cname === "xforms-body") {
      this.cell = cells[i];
    } else if (cname === "xforms-hint" && cells[i].getAttribute("xf-appearance") === "minimal") {
      elt.setAttribute("title", cells[i].textContent);
    }
  }
  //if(!this.hasBinding) {
  //  XsltForms_browser.setClass(this.element, "xforms-disabled", false);
  //}
  this.isTrigger = true;
  this.initBody();
  //var anchor = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "a")[0] : this.element.getElementsByTagName("a")[0];
  //if (anchor !== null && typeof anchor !== "undefined") {
  //  if (!anchor.hasAttribute("href")) {
  //    anchor.setAttribute("href", "#/");
  //  }
  //}
  //var button = XsltForms_browser.isXhtml ? (this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "a")[0] || this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "button")[0]) : (this.element.getElementsByTagName("a")[0] || this.element.getElementsByTagName("button")[0]);
  //this.input = button;
  //this.initFocus(button);
}

XsltForms_trigger.prototype = new XsltForms_control();

    
/**
 * * '''initBody''' method : initializes the select control body
 */

XsltForms_trigger.prototype.initBody = function() {
  var cells = Array.prototype.slice.call(this.element.children);
  var i, l, cname;
  switch(this.appearance) {
    case "full":
    case "compact":
      //XsltForms_browser.setClass(this.element, "xforms-appearance-full", true);
      if (this.cell.children.length === 0 || this.cell.children[0].nodeName.toUpperCase() !== "BUTTON") {
        this.cell.innerHTML = '<button type="button"></button>';
        this.input = this.cell.children[0];
        for (i = 0, l = cells.length; i < l; i++) {
          cname = cells[i].localName.toLowerCase();
          if (cname === "xforms-label") {
            this.input.appendChild(cells[i]);
            break;
          }
        }
      } else {
        this.input = this.cell.children[0];
      }
      break;
    case "minimal":
      if (this.cell.children.length === 0 || this.cell.children[0].nodeName.toUpperCase() !== "A") {
        this.cell.innerHTML = '<a></a>';
        this.input = this.cell.children[0];
        for (i = 0, l = cells.length; i < l; i++) {
          cname = cells[i].localName.toLowerCase();
          if (cname === "xforms-label") {
            this.input.appendChild(cells[i]);
            break;
          }
        }
      } else {
        this.input = this.cell.children[0];
      }
      break;
  }
  this.initFocus(this.input);
};

    
/**
 * * '''setValue''' method : empty
 */

XsltForms_trigger.prototype.setValue = function() {};


    
/**
 * * '''changeReadonly''' method : changes the read only state of this input control
 */

XsltForms_trigger.prototype.changeReadonly = function() {
  this.input.disabled = this.readonly;
};


    
/**
 * * '''clone''' method : creates a new trigger control with the given id
 */

XsltForms_trigger.prototype.clone = function(id) {
  return new XsltForms_trigger(this.subform, id, this.binding, true);
};


    
/**
 * * '''dispose''' method : decrements the number of triggers and calls the parent dispose() method
 */

XsltForms_trigger.prototype.dispose = function() {
  XsltForms_globals.counters.trigger--;
  XsltForms_element.prototype.dispose.call(this);
};


    
/**
 * * '''click''' method : dispatches a "DOMActivate" event
 * @callback
 */

XsltForms_trigger.prototype.click = function(target, evcontext) {
  XsltForms_globals.openAction("XsltForms_trigger.prototype.click");
  XsltForms_xmlevents.dispatch(this, "DOMActivate", null, null, null, null, evcontext);
  XsltForms_globals.closeAction("XsltForms_trigger.prototype.click");
};


    
/**
 * * '''blur''' method : empty
 */

XsltForms_trigger.prototype.blur = function() {};