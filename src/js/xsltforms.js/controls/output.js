"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module output
 * @description  === "XsltForms_output" class ===
 * Output Control  Class
 * * constructor function : initializes specific properties and initializes focus and blur event management
 */
    
new XsltForms_class("XsltForms_output", "HTMLElement", "xforms-output", "<xforms-label></xforms-label><xforms-body></xforms-body><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");
var XsltForms_output_svgtemplate = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
XsltForms_output_svgtemplate.innerHTML = "<tspan xmlns='http://www.w3.org/2000/svg' xforms-name='label'/><tspan xmlns='http://www.w3.org/2000/svg' xforms-name='body'/>";
if (!XsltForms_output_svgtemplate.children) {
  XsltForms_output_svgtemplate.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "tspan"));
  XsltForms_output_svgtemplate.firstChild.setAttribute("xforms-name", "label");
  XsltForms_output_svgtemplate.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "tspan"));
  XsltForms_output_svgtemplate.lastChild.setAttribute("xforms-name", "body");
}
XsltForms_output_svgtemplate = Array.prototype.slice.call(XsltForms_output_svgtemplate.childNodes);
XsltForms_browser.addLoadListener(new Function(
  "Array.prototype.slice.call(document.querySelectorAll('*[xforms-name=\"output\"]')).forEach(function(elt) { if (!elt.xfElement) { XsltForms_class._applyTemplate(elt, XsltForms_output_svgtemplate); elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_output(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));

function XsltForms_output(subform, elt) {
  XsltForms_globals.counters.output++;
  this.init(subform, elt);
  this.controlName = "output";
  var cells = this.element.children || this.element.childNodes;
  for (var i = 0, l = cells.length; i < l; i++) {
    if (cells[i].localName.toLowerCase() === "xforms-body" || cells[i].getAttribute("xforms-name") === "body") {
      this.cell = cells[i];
      break;
    }
  }
  this.binding = new XsltForms_binding(subform, elt);
  this.hasBinding = true; //typeof binding !== "string";
  var mediatype;
  Array.prototype.slice.call(elt.children || elt.childNodes).forEach(function(n) {
    switch(n.localName.toLowerCase()) {
      case "xforms-mediatype":
        mediatype = n;
        break;
    }
  });
  this.mediatype = mediatype ? mediatype.hasAttribute("xf-value") ? new XsltForms_binding(this.subform, mediatype) : mediatype.textContent : elt.getAttribute("xf-mediatype");
  this.complex = this.mediatype === "application/xhtml+xml" || this.mediatype === "text/html" || this.mediatype === "text/markdown";
  this.isOutput = true;
  //if (this.binding) {
  //  if (this.binding.type) {
  //    XsltForms_browser.setClass(this.element, "xforms-disabled", false);
    /*
    } else if (typeof binding === "string") {
      this.setValue(binding);
    */
  //  }
  //}
}

XsltForms_output.prototype = new XsltForms_control();


    
/**
 * * '''clone''' method : creates a new output control with the given id
 */

XsltForms_output.prototype.clone = function(id) { 
  return new XsltForms_output(this.subform, id, this.valoff, this.binding, this.mediatype);
};


    
/**
 * * '''dispose''' method : clears properties of this control and calls the parent dispose() method
 */

XsltForms_output.prototype.dispose = function() {
  this.cell = null;
  XsltForms_globals.counters.output--;
  XsltForms_control.prototype.dispose.call(this);
};


    
/**
 * * '''setValue''' method : sets the value of this output control
 */

XsltForms_output.prototype.setValue = function(value) {
  var element = this.cell;
  var mediatype = this.mediatype;
  var i, li;
  if (mediatype && mediatype.bind_evaluate) {
    mediatype = XsltForms_globals.stringValue(mediatype.bind_evaluate(this.subform, this.boundnodes[0]));
  }
  if (!mediatype || mediatype.indexOf("image/") !== 0 || mediatype === "image/svg+xml") {
    if (element.nodeName.toLowerCase() === "xforms-body" || element.nodeName.toLowerCase() === "tspan" || element.nodeName.toLowerCase() === "xforms-label") {
      if (mediatype === "application/xhtml+xml" || mediatype === "text/html") {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        if (value) {
          element.innerHTML = value;
        }
      } else if (mediatype === "text/markdown") {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        if (value) {
          element.innerHTML = XsltForms_browser.md2string(value);
        }
      } else if (mediatype === "image/svg+xml") {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        if (XsltForms_browser.isIE && !XsltForms_browser.isIE9) {
          var xamlScript = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
          xamlScript.setAttribute("type", "text/xaml");
          xamlScript.setAttribute("id", this.element.id+"-xaml");
          xamlScript.text = XsltForms_browser.transformText(value, XsltForms_browser.ROOT + "svg2xaml.xsl", false, "width", element.currentStyle.width, "height", element.currentStyle.height);
          element.appendChild(xamlScript);
          var xamlObject = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "object") : document.createElement("object");
          xamlObject.setAttribute("width", element.currentStyle.width+"px");
          xamlObject.setAttribute("height", element.currentStyle.height+"px");
          xamlObject.setAttribute("type", "application/x-silverlight");
          xamlObject.setAttribute("style", "min-width: " + element.currentStyle.width+"px");
          //xamlObject.setAttribute("style", "min-width: " + xamlScript.text.substring(xamlScript.text.indexOf('<Canvas Width="')+15,xamlScript.text.indexOf('" Height="')) + "px");
          var xamlParamSource = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "param") : document.createElement("param");
          xamlParamSource.setAttribute("name", "source");
          xamlParamSource.setAttribute("value", "#"+this.element.id+"-xaml");
          xamlObject.appendChild(xamlParamSource);
          var xamlParamOnload = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "param") : document.createElement("param");
          xamlParamOnload.setAttribute("name", "onload");
          xamlParamOnload.setAttribute("value", "onLoaded");
          xamlObject.appendChild(xamlParamOnload);
          var xamlParamIswindowless = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "param") : document.createElement("param");
          xamlParamIswindowless.setAttribute("name", "iswindowless");
          xamlParamIswindowless.setAttribute("value", "true");
          xamlObject.appendChild(xamlParamIswindowless);
          element.appendChild(xamlObject);
        } else if (XsltForms_browser.isXhtml) {
          var cs = window.getComputedStyle(element, null);
          XDocument.parse(value, element);
          element.firstChild.setAttribute("width", cs.getPropertyValue("min-width"));
          element.firstChild.setAttribute("height", cs.getPropertyValue("min-height"));
        } else {
          var svgObject = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "object") : document.createElement("object");
          svgObject.setAttribute("type", "image/svg+xml");
          svgObject.setAttribute("data", "data:image/svg+xml,"+ value);
          //svgObject.setAttribute("height", "400px");
          element.appendChild(svgObject);
        }
      } else {
        XsltForms_browser.setValue(element, value);
        if (element.parentElement.parentElement.nodeName.toLowerCase() === "xforms-label") {
          var ancestor = element;
          while (ancestor.parentElement) {
            ancestor = ancestor.parentElement;
            if (ancestor.nodeName.toLowerCase().startsWith("xforms-select")) {
              if (!ancestor.xfElement.full) {
                ancestor.xfElement.initBody();
              }
              break;
            }
          }
        }
      }
    } else {
      XsltForms_browser.setValue(element, value);
    }
  } else {
    element.innerHTML = "<img src='" + value + "'>";
  }
};

    
/**
 * * '''getValue''' method : gets the value of this output control
 */

XsltForms_output.prototype.getValue = function(format) {
  var element = this.cell;
  if (element.nodeName.toLowerCase() === "span") {
    return XsltForms_browser.getValue(element, format);
  }
  var value = element.src;
  if (value && format && element.type.format) {
    try { 
      value = element.type.format(value);
    } catch(e) { 
    }
  }
  return value;
};