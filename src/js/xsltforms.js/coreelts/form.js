"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module model
 * @description  === "XsltForms_form" class ===
 * * constructor function : specifically gets the associated schemas
 */

new XsltForms_class("XsltForms_form", "HTMLElement", "xforms-form");

function XsltForms_form(subform, elt) {
  Array.prototype.slice.call(elt.attributes).forEach(function(n) {
    if (n.nodeName.substr(0, 6) === "xmlns:" || n.nodeName.substr(0, 6) === "xmlns-") {
      Fleur.XPathNSResolver_default.pf.push(n.nodeName.substr(6));
      Fleur.XPathNSResolver_default.uri.push(n.nodeValue);
    } else if (n.localName === "xmlns" && n.prefix) {
      Fleur.XPathNSResolver_default.pf.push(n.prefix.toLowerCase());
      Fleur.XPathNSResolver_default.uri.push(n.namespaceURI);
    } else if (n.prefix && n.prefix !== "") {
      Fleur.XPathNSResolver_default.pf.push(n.prefix.toLowerCase());
      Fleur.XPathNSResolver_default.uri.push(n.namespaceURI);
    }
  });
  this.init(subform, elt);
  let xmodelconfig, xdialog, xbody;
  const contents = [];
  Array.prototype.slice.call(elt.children).forEach(function(n) {
    switch(n.localName.toLowerCase()) {
      case "xforms-model":
        xmodelconfig = n;
        break;
      case "xforms-dialog":
        xdialog = n;
        break;
      case "xforms-body":
        xbody = n;
        break;
      default:
        contents.push(n);
      }
  });
  if (!xdialog) {
    const xcons = document.createElement("xforms-dialog");
    xcons.setAttribute("id", "xsltforms-console");
    elt.appendChild(xcons);
    const stap = document.createElement("xforms-dialog");
    stap.setAttribute("id", "xsltforms-status-panel");
    elt.appendChild(stap);
  }
  if (!xbody) {
    const frm = document.createElement("form");
    contents.forEach(n => frm.appendChild(n));
    const xbo = document.createElement("xforms-body");
    xbo.appendChild(frm);
    elt.appendChild(xbo);
  }
  XsltForms_globals.formelt = elt.querySelector("form");
}

XsltForms_form.prototype = new XsltForms_coreElement();
