"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module submission
 * @description  === "XsltForms_submission" class ===
 * Submission Class
 * * constructor function : store the properties of this submission and attaches it to a model
 */
    
new XsltForms_class("XsltForms_submission", "HTMLElement", "xforms-submission");

function XsltForms_submission(subform, elt) {
/*      subform, id, model, ref, value, bind, action, method, version, indent,
      mediatype, encoding, omitXmlDeclaration, cdataSectionElements,
      replace, targetref, instance, separator, includenamespaceprefixes, validate, relevant,
      synchr, show, serialization) {*/
//  if (document.getElementById(id)) {
//    return;
//  }
  this.init(subform, elt);
  this.model = elt.parentNode.xfElement;
  if (!this.model.defaultSubmission) {
    this.model.defaultSubmission = this;
  }
  this.replace = elt.getAttribute("xf-replace") || "all";
  this.targetref = elt.hasAttribute("xf-targetref") ? new XsltForms_binding(subform, elt, "xf-targetref") : null;
  this.version = elt.getAttribute("xf-version");
  this.serialization = elt.getAttribute("xf-serialization");
  this.indent = elt.getAttribute("xf-indent");
  this.validate = elt.hasAttribute("xf-validate") ? elt.getAttribute("xf-validate") !== "false" : this.serialization !== "none";
  this.relevant = elt.hasAttribute("xf-relevant") ? elt.getAttribute("xf-relevant") !== "false" : this.serialization !== "none";
  this.synchr = elt.getAttribute("xf-mode") === "synchronous";
  this.show = elt.getAttribute("xf-show");
  this.target = elt.getAttribute("xf-target") || "_self";
  var mediatype = elt.getAttribute("xf-mediatype");
  if (mediatype) {
    var lines = mediatype.split(";");
    this.mediatype = lines[0];
    for (var i = 1, len = lines.length; i < len; i++) {
      var vals = lines[i].split("=");
      switch (vals[0].replace(/^\s+/g,'').replace(/\s+$/g,'')) {
        case "action":
          this.soapAction = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
          break;
        case "charset":
          this.charset = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
          break;
      }
    }
    if (this.mediatype === "application/zip" || this.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.charset = "x-user-defined-binary";
    }
  } else {
    this.mediatype = "application/xml";
  }
  this.encoding = elt.getAttribute("xf-encoding") || "UTF-8";
  this.omitXmlDeclaration = elt.getAttribute("xf-omitXmlDeclaration");
  this.cdataSectionElements = elt.getAttribute("xf-cdataSectionElements");
  this.instance = elt.getAttribute("xf-instance");
  this.separator = elt.getAttribute("xf-separator") || "&";
  this.includenamespaceprefixes = elt.getAttribute("xf-includenamespaceprefixes");
  var headers = [];
  var action, method;
  Array.prototype.slice.call(elt.children).forEach(function(n) {
    switch(n.localName.toLowerCase()) {
      case "xforms-resource":
        action = n;
        break;
      case "xforms-method":
        method = n;
        break;
      case "xforms-header":
        var hname, hvalues = [];
        Array.prototype.slice.call(n.children).forEach(function(n) {
          switch(n.localName.toLowerCase()) {
            case "xforms-name":
              hname = n;
              break;
            case "xforms-value":
              hvalues.push(n);
              break;
          }
        });
        headers.push({
          nodeset: n.hasAttribute("xf-ref") ? new XsltForms_binding(subform, n) : null,
          name: hname ? hname.hasAttribute("xf-value") ? new XsltForms_binding(subform, hname) : hname.textContent : n.getAttribute("xf-name"),
          combine: n.getAttribute("xf-combine") || "append",
          values: hvalues.map(function(hvalue) { return hvalue.hasAttribute("xf-value") ? new XsltForms_binding(subform, hvalue) : hvalue.textContent; })
        });
        break;
    }
  });
  this.headers = headers;
  this.action = action ?
    action.hasAttribute("xf-value") ? new XsltForms_binding(subform, action) : action.textContent :
    elt.hasAttribute("xf-resource") ? elt.getAttribute("xf-resource") : elt.getAttribute("xf-action");
  this.method = method ?
    method.hasAttribute("xf-value") ? new XsltForms_binding(subform, method) : method.textContent :
    elt.getAttribute("xf-method");
  if (elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") || elt.hasAttribute("xf-value")) {
    this.binding = new XsltForms_binding(subform, elt);
    this.eval_ = function() {
      var res = this.binding.bind_evaluate();
      return typeof res === "string" ? res : res.head();
    };
  } else {
    this.eval_ = function() {
      return this.model.getInstanceDocument();
    };
  }
  this.pending = false;
}

XsltForms_submission.prototype = new XsltForms_coreElement();


    
/**
 * * '''header''' method : declares a header
 */

XsltForms_submission.prototype.header = function(nodeset, combine, hname, values) {
  this.headers.push({nodeset: nodeset, combine: combine, name: hname, values: values});
  return this;
};

    
/**
 * * '''xml2data''' method : prepares XML data for submission according to HTTP method
 */

XsltForms_submission.prototype.xml2data = function(node, method) {
  if (this.mediatype === "application/zip" ||
      this.mediatype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    this.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    var instance = document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement;
    if (!instance.archive) {
      alert("Not an archive!");
    }
    return XsltForms_browser.xml2zip(instance.archive, this.mediatype);
  }
  var ser = node ? typeof node === "string" ? node : method === "urlencoded-post" ? XsltForms_submission.toUrl_(node, this.separator) : XsltForms_browser.saveNode(node, "application/xml", this.relevant, false, method === "multipart-post", this.cdataSectionElements) : "";
  if (this.mediatype === "text/csv" && typeof node !== "string") { 
    return XsltForms_browser.xml2csv(ser, this.separator);
  }
  if ((this.mediatype === "application/json" || this.mediatype === "text/json") && typeof node !== "string") {
    return XsltForms_browser.xml2json(ser);
  }
  return ser;
};

    
/**
 * * '''submit''' method : submits serialized data according to choosen method
 */

XsltForms_submission.prototype.submit = async function() {
  if (this.pending) {
    XsltForms_globals.openAction("XsltForms_submission.prototype.submit");
    this.issueSubmitException_({"error-type": "submission-in-progress"});
    XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
    return;
  }
  this.pending = true;
  var ctxnode, targetnode, inst, body, scriptelt;
  XsltForms_globals.openAction("XsltForms_submission.prototype.submit");
  var ser = this.eval_();
  var sertype = typeof ser;
  var node;
  if (sertype === 'number' || sertype === 'boolean') {
    ser = String(ser);
  } else if (sertype !== "string") {
    node = ser;
  }
  var action = "error";
  if (this.action.bind_evaluate) {
    action = XsltForms_globals.stringValue(this.action.bind_evaluate(this.subform));
  } else {
    action = this.action;
  }
  var method = "post";
  var subm = this;
  if (this.method.bind_evaluate) {
    method = XsltForms_globals.stringValue(this.method.bind_evaluate(this.subform));
  } else {
    method = this.method;
  }
  var evcontext = {"method": method, "resource-uri": action};
  if (action.substring && action.substring(0, 8) === "local://" && (typeof(localStorage) === 'undefined')) {
    evcontext["error-type"] = "validation-error";
    this.issueSubmitException_(evcontext, null, {message: "local:// submission not supported"});
    XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
    this.pending = false;
    return;
  }
  if (node) {
    if (this.validate && !XsltForms_globals.validate_(node)) {
      XsltForms_globals.validationError = true;
      XsltForms_globals.addChange(subm.model);
      XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
      XsltForms_globals.refresh();
      evcontext["error-type"] = "validation-error";
      this.issueSubmitException_(evcontext, null, null);
      XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
      this.pending = false;
      return;
    }
    if ((method === "get" || method === "delete") && this.serialization !== "none" && action.substring(0, 5) !== "file:" && action.substr(0, 9) !== "opener://" && action.substring(0, 8) !== "local://" && action.substring(0, 11) !== "javascript:") {
      var tourl = XsltForms_submission.toUrl_(node, this.separator);
      if (tourl.length > 0) {
        action += (action.indexOf('?') === -1? '?' : this.separator) + tourl.substring(0, tourl.length - this.separator.length);
      }
    }
  }
  if (node && this.serialization !== "none") {
    XsltForms_xmlevents.dispatch(this, "xforms-submit-serialize");
    ser = this.xml2data(node, method);
  }
  var instance = this.instance;
  if (instance && !document.getElementById(instance)) {
    XsltForms_xmlevents.dispatch(this, "xforms-binding-exception");
    XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
    this.pending = false;
    return;
  }
  if ((window.location.href.substring(0, 5) === "file:" && action.substring(0, 7) !== "http://") || (action.substring(0, 5) === "file:" && (window.location.href.substring(0, 5) !== "file:" || method !== "get")) || action.substring(0, 9) === "opener://" || action.substring(0, 8) === "local://") {
    if ((window.location.href.substring(0, 5) === "file:" || action.substring(0, 5) === "file:") && method === "put") {
      subm.pending = false;
      if (! (await XsltForms_browser.writeFile(action.substr(0, 5) === "file:" ? action.substr(5) : action, subm.encoding, subm.mediatype, ser))) {
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
      }
      XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
    } else if (window.location.href.substring(0, 5) === "file:" && action !== "file:" && action !== "" && method === "get") {
      scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
      scriptelt.setAttribute("src", action);
      scriptelt.setAttribute("id", "xsltforms-filereader");
      scriptelt.setAttribute("type", "application/xml");
      var scriptLoaded = function() {
        alert(document.getElementById("xsltforms-filereader").textContent);
      };
      scriptelt.onreadystatechange = function () {
        if (this.readyState === 'complete' || this.readyState === 'loaded') {
          scriptLoaded();
        }
      };
      scriptelt.onload = scriptLoaded;
      body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
      body.insertBefore(scriptelt, body.firstChild);
    } else if (action.substring(0, 9) === "opener://" && method === "put") {
      try {
        window.opener.XsltForms_globals.xmlrequest('put', action.substr(9), ser);
      } catch (e) {
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
        XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
        this.pending = false;
        return;
      }
      XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
    } else if (action.substring(0, 8) === "local://" && method === "put") {
      try {
        window.localStorage.setItem(action.substr(8), ser);
      } catch (e) {
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
        XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
        this.pending = false;
        return;
      }
      XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
    } else if (action.substring(0, 8) === "local://" && method === "delete") {
      try {
        window.localStorage.removeItem(action.substr(8));
      } catch (e) {
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
        XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
        this.pending = false;
        return;
      }
      XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
    } else if (method === "get") {
      if (action.substring(0, 5) === "file:") {
        const loadcontents = content => {
          if (subm.replace === "instance" || (subm.targetref && subm.replace === "text")) {
            if (subm.targetref) {
              ctxnode = !instance ? (node ? (node.nodeType === Fleur.Node.DOCUMENT_NODE ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
              targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
              if ((Fleur.minimal && targetnode && targetnode[0]) || (!Fleur.minimal && targetnode.head().nodeType !== Fleur.Node.SEQUENCE_NODE)) {
                targetnode = targetnode.head();
                if (subm.replace === "instance") {
                  XsltForms_browser.loadNode(targetnode, content, "application/xml");
                } else {
                  XsltForms_browser.loadTextNode(targetnode, content);
                }
              }
            } else {
              inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
              inst.setDoc(content, false, true);
            }
            XsltForms_globals.addChange(subm.model);
            XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
            XsltForms_globals.refresh();
          }
          XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
          XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
          subm.pending = false;
        };
        if (window.showOpenFilePicker) {
          const opts = {
            types: [{
              accept: {},
            }],
          };
          opts.types[0].accept[subm.mediatype] = XsltForms_browser.MIME2extensions[subm.mediatype];
          try {
            const fileHandle = await window.showOpenFilePicker(opts);
            const file = await fileHandle[0].getFile();
            const contents = await file.text();
            loadcontents(contents);
          } catch(e) {}
          subm.pending = false;
          return;
        } else {
          if (!subm.cell) {
            const submbody = document.createElement("xforms-body");
            subm.cell = document.createElement("input");
            subm.cell.type = "file";
            submbody.appendChild(subm.cell);
            subm.element.appendChild(submbody);
            subm.cell.addEventListener("change", () => {
              const reader = new FileReader();
              reader.onerror = () => {
                XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
                XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
                this.pending = false;
              };
              reader.onabort = () => {
                XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
                this.pending = false;
              };
              reader.onload = () => {
                loadcontents(reader.result);
              };
              const file = subm.cell.files[0];
              if (file) {
                reader.readAsText(file);
              } else {
                XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
                subm.pending = false;
              }
            });
          }
          subm.cell.accept = subm.mediatype;
          subm.cell.click();
          subm.pending = false;
          return;
        }
      } else if (action.substring(0, 8) === "local://") {
        try {
          ser = window.localStorage.getItem(action.substr(8));
        } catch (e) {
          XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
          XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
          this.pending = false;
          return;
        } 
      } else if (action.substring(0, 9) === "opener://") {
        try {
          ser = window.opener.XsltForms_globals.xmlrequest('get', action.substr(9));
        } catch (e) {
          XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
          XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
          this.pending = false;
          return;
        } 
      } else {
        ser = eval(action.substring(11));
      }
      if (ser !== "" && (subm.replace === "instance" || (subm.targetref && subm.replace === "text"))) {
        ctxnode = !instance ? (node ? (node.documentElement ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
        if (subm.targetref) {
          targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
          if ((Fleur.minimal && targetnode && targetnode[0]) || (!Fleur.minimal && targetnode.head().nodeType !== Fleur.Node.SEQUENCE_NODE)) {
            targetnode = targetnode.head();
            if (subm.replace === "instance") {
              XsltForms_browser.loadNode(targetnode, ser, "application/xml");
            } else {
              XsltForms_browser.loadTextNode(targetnode, ser);
            }
          }
        } else {
          inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
          inst.setDoc(ser, false, true);
        }
        XsltForms_globals.addChange(subm.model);
        XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
        XsltForms_globals.refresh();
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
      } else {
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
      }
    }
    XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
    this.pending = false;
    return;
  }
  if (action.substring(0,11) === "javascript:") {
    if (method === "get") {
      ser = eval(action.substring(11));
      if (ser !== "" && (subm.replace === "instance" || (subm.targetref && subm.replace === "text"))) {
        ctxnode = !instance ? (node ? (node.documentElement ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
        if (subm.targetref) {
          targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
          if ((Fleur.minimal && targetnode && targetnode[0]) || (!Fleur.minimal && targetnode.head().nodeType !== Fleur.Node.SEQUENCE_NODE)) {
            targetnode = targetnode.head();
            if (subm.replace === "instance") {
              XsltForms_browser.loadNode(targetnode, ser, "application/xml");
            } else {
              XsltForms_browser.loadTextNode(targetnode, ser);
            }
          }
        } else {
          inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
          inst.setDoc(ser, false, true);
        }
        XsltForms_globals.addChange(subm.model);
        XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
        XsltForms_globals.refresh();
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
      } else {
        XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
      }
    }
    XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
    this.pending = false;
    return;
  }
  var synchr = this.synchr;
  if (synchr) {
    XsltForms_browser.dialog.show("xsltforms-status-panel", null, false);
  }
  if(method === "xml-urlencoded-post") {
    var outForm = document.getElementById("xsltforms_form");
    if(outForm) {
      outForm.firstChild.value = ser;
    } else {
      outForm = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "form") : document.createElement("form");
      outForm.setAttribute("method", "post");
      outForm.setAttribute("action", action);
      outForm.setAttribute("id", "xsltforms_form");
      var txt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "input") : document.createElement("input");
      txt.setAttribute("type", "hidden");
      txt.setAttribute("name", "postdata");
      txt.setAttribute("value", ser);
      outForm.appendChild(txt);
      document.querySelector("xforms-form > xforms-body").appendChild(outForm);
    }
    outForm.submit();
    XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
  } else {
    /*
    var cross = false;
    if (action.match(/^[a-zA-Z0-9+\.\-]+:\/\//)) {
      var domain = /^([a-zA-Z0-9+\.\-]+:\/\/[^\/]*)/;
      var sdom = domain.exec(action);
      var ldom = domain.exec(document.location.href);
      cross = sdom[0] !== ldom[0];
    }
    */
    if (this.mediatype === "application/javascript") {
      XsltForms_browser.jsoninstobj = {instance: !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : this.model.getInstance()) : document.getElementById(instance).xfElement, submission: this};
      scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
      scriptelt.setAttribute("src", action.replace(/&amp;/g, "&")+((action.indexOf("?") === -1) ? "?" : "&")+"callback=jsoninst");
      scriptelt.setAttribute("id", "jsoninst");
      scriptelt.setAttribute("type", "text/javascript");
      body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
      body.insertBefore(scriptelt, body.firstChild);
      XsltForms_xmlevents.dispatch(this, "xforms-submit-done");
      XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
    } else {
      // TODO: Validate binding target is not empty
      if (!node && (method !== "get" || method !== "delete")) {
        evcontext["error-type"] = "no-data";
        this.issueSubmitException_(evcontext, null, null);
        this.pending = false;
        return;
      }
      var req = null;
      try {
        evcontext["resource-uri"] = action;
        req = XsltForms_browser.openRequest(method.split("-").pop(), action, !synchr);
        var func = function() {
          if (!synchr && req.readyState !== 4) {
            return;
          }
          try {
            if (req.status === 1223) {
              req.status = 204;
              req.statusText = "No Content";
            }
            if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
              evcontext["error-type"] = "resource-error";
              subm.issueSubmitException_(evcontext, req, null);
              XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
              subm.pending = false;
              return;
            }
            if (subm.replace === "instance" || (subm.targetref && subm.replace === "text")) {
              if (subm.targetref) {
                ctxnode = !instance ? (node ? (node.nodeType === Fleur.Node.DOCUMENT_NODE ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
                targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
                if ((Fleur.minimal && targetnode && targetnode[0]) || (!Fleur.minimal && targetnode.head().nodeType !== Fleur.Node.SEQUENCE_NODE)) {
                  targetnode = targetnode.head();
                  if (subm.replace === "instance") {
                    XsltForms_browser.loadNode(targetnode, req.responseText, "application/xml");
                  } else {
                    XsltForms_browser.loadTextNode(targetnode, req.responseText);
                  }
                }
              } else {
                inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
                inst.setDocFromReq(req, false, true);
              }
              XsltForms_globals.addChange(subm.model);
              XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
              XsltForms_globals.refresh();
            }
            XsltForms_submission.requesteventlog(evcontext, req);
            XsltForms_xmlevents.dispatch(subm, "xforms-submit-done", null, null, null, null, evcontext);
            XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
            if (subm.replace === "all") {
              var resp = req.responseText;
              var piindex = resp.indexOf("<?xml-stylesheet", 0);
              while ( piindex !== -1) {
                var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
                resp = XsltForms_browser.transformText(resp, xslhref, false);
                piindex = resp.indexOf("<?xml-stylesheet", 0);
              }
              if( subm.show === "new" || subm.target !== "_self") {
                if (req.getResponseHeader("Content-Type") === "application/octet-stream;base64") {
                  //window.open("data:application/octet-stream;base64," + resp,"_blank");
                  location.href ="data:application/octet-stream;base64," + resp;
                } else {
                  var w = window.open("about:blank", subm.target);
                  w.document.write(resp);
                  w.document.close();
                }
              } else {
                XsltForms_browser.dialog.hide("xsltforms-status-panel", false);
                XsltForms_globals.close();
                if(document.write) {
                  document.write(resp);
                  document.close();
                } else {
                  //document.documentElement.parentNode.replaceChild(req.responseXML.documentElement,document.documentElement);
                  if (resp.indexOf("<?", 0) === 0) {
                    resp = resp.substr(resp.indexOf("?>")+2);
                  }                       
                  document.documentElement.innerHTML = resp;
                }
              }
            }
          } catch(e) {
            XsltForms_browser.debugConsole.write(e || e.message);
            evcontext["error-type"] = "parse-error";
            subm.issueSubmitException_(evcontext, req, e);
            XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
          }
          subm.pending = false;
        };
        if (!synchr) {
          req.onreadystatechange = func;
        }
        var media = this.mediatype;
        var mt;
        if (method === "multipart-post") {
          mt = "multipart/related; boundary=xsltformsrev" + XsltForms_globals.fileVersionNumber + '; type="application/xml"; start="<xsltforms_main>"';
        } else {
          mt = (media || "application/xml") + (this.charset? ";charset=" + this.charset : "");
        }
        XsltForms_browser.debugConsole.write("Submit " + this.method + " - " + mt + " - " + action + " - " + synchr);
        var len = this.headers.length;
        var acceptValue = "";
        if (len !== 0) {
          var headers = [];
          for (var i = 0, len0 = this.headers.length; i < len0; i++) {
            var nodes = [];
            if (this.headers[i].nodeset) {
              nodes = this.headers[i].nodeset.bind_evaluate(this.subform);
            } else {
              nodes = [subm.model.getInstanceDocument().documentElement];
            }
            var hname;
            for (var n = 0, lenn = nodes.length; n < lenn; n++) {
              if (this.headers[i].name.bind_evaluate) {
                hname = XsltForms_globals.stringValue(this.headers[i].name.bind_evaluate(nodes[n]));
              } else {
                hname = this.headers[i].name;
              }
              if (hname !== "") {
                var hvalue = "";
                var j;
                var len2;
                for (j = 0, len2 = this.headers[i].values.length; j < len2; j++) {
                  var hv = this.headers[i].values[j];
                  var hv2;
                  if (hv.bind_evaluate) {
                    hv2 = XsltForms_globals.stringValue(hv.bind_evaluate(nodes[n]));
                  } else {
                    hv2 = hv;
                  }
                  hvalue += hv2;
                  if (j < len2 - 1) {
                    hvalue += ",";
                  }
                }
                var len3;
                for (j = 0, len3 = headers.length; j < len3; j++) {
                  if (headers[j].name === hname) {
                    switch (this.headers[i].combine) {
                      case "prepend":
                        headers[j].value = hvalue + "," + headers[j].value;
                        break;
                      case "replace":
                        headers[j].value = hvalue;
                        break;
                      default:
                        headers[j].value += "," + hvalue;
                        break;
                    }
                    break;
                  }
                }
                if (j === len3) {
                  headers.push({name: hname, value: hvalue});
                }
              }
            }
          }
          for (var k = 0, len4 = headers.length; k < len4; k++) {
            req.setRequestHeader(headers[k].name, headers[k].value);
            if (headers[k].name.toLowerCase() === "accept") {
              acceptValue = headers[k].value;
            }
          }
        }
        if (method === "get" || method === "delete") {
          if (acceptValue === "") {
            if (media === XsltForms_submission.SOAP_) {
              req.setRequestHeader("Accept", mt);
              acceptValue = mt;
            } else {
              if (subm.replace === "instance") {
                req.setRequestHeader("Accept", "application/xml,text/xml");
                acceptValue = "application/xml,text/xml";
              } else {
                req.setRequestHeader("Accept", "text/plain");
                acceptValue = "text/plain";
              }
            }
          }
          if (req.overrideMimeType) {
            req.overrideMimeType(acceptValue.split(",")[0].split(";")[0]);
            /*
            if (subm.mediatype === "application/zip" || subm.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
              req.overrideMimeType('text/plain; charset=x-user-defined');
            } else if (subm.mediatype && subm.mediatype.indexOf("/xml") === -1 && subm.mediatype.indexOf("+xml") === -1) {
              req.overrideMimeType(subm.mediatype + '; charset=ISO-8859-1');
            }
            */
          }
          //req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
          req.send(null);
        } else {
          if (method === "urlencoded-post") {
            mt = "application/x-www-form-urlencoded";
          }
          req.setRequestHeader("Content-Type", mt);
          if (media === XsltForms_submission.SOAP_) {
            if (this.soapAction) {
              req.setRequestHeader("SOAPAction", this.soapAction);
            }
          } else {
            if (subm.replace === "instance") {
              req.setRequestHeader("Accept", "application/xml,text/xml");
            }
          }
          req.send(ser);
        }
        if (synchr) {
          func();
          XsltForms_browser.dialog.hide("xsltforms-status-panel", null, false);
        }
      } catch(e) {
        XsltForms_browser.dialog.hide("xsltforms-status-panel", null, false);
        XsltForms_browser.debugConsole.write(e.message || e);
        evcontext["error-type"] = "resource-error";
        subm.issueSubmitException_(evcontext, req, e);
        XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
        subm.pending = false;
      }
    }
  }
};

XsltForms_submission.SOAP_ = "application/soap+xml";


    
/**
 * * '''requesteventlog''' method : Prepares the event-context for a request.
 */

XsltForms_submission.requesteventlog = function(evcontext, req) {
  try {
    evcontext["response-status-code"] = req.status;
    evcontext["response-reason-phrase"] = req.statusText;
    evcontext["response-headers"] = [];
    var rheads = req.getAllResponseHeaders();
    var rheaderselts = "";
    if (rheads) {
      rheads = rheads.replace(/\r/, "").split("\n");
      for (var i = 0, len = rheads.length; i < len; i++) {
        var colon = rheads[i].indexOf(":");
        if (colon !== -1) {
          var hname = rheads[i].substring(0, colon).replace(/^\s+|\s+$/, "");
          var value = rheads[i].substring(colon+1).replace(/^\s+|\s+$/, "");
          rheaderselts += "<header><name>"+XsltForms_browser.escape(hname)+"</name><value>"+XsltForms_browser.escape(value)+"</value></header>";
        }
      }
    }
    evcontext.rheadsdoc = XsltForms_browser.createXMLDocument("<data>"+rheaderselts+"</data>");
    if (evcontext.rheadsdoc.documentElement.firstChild) {
      var rh = evcontext.rheadsdoc.documentElement.firstChild;
      evcontext["response-headers"] = [rh];
      while (rh.nextSibling) {
        rh = rh.nextSibling;
        evcontext["response-headers"].push(rh);
      }
    }
    if (req.responseXML) {
      evcontext["response-body"] = [XsltForms_browser.createXMLDocument(req.responseText).documentElement];
    } else {
      evcontext["response-body"] = req.responseText || "";
    }
  } catch (e) {
  }
};

    
/**
 * * '''issueSubmitException_''' method : Prepares the event-context and issues a 'xforms-submit-error' event.
 */

XsltForms_submission.prototype.issueSubmitException_ = function(evcontext, req, ex) {
  if (ex) {
    evcontext.message = ex.message || ex;
    evcontext["stack-trace"] = ex.stack;
  }
  if (req) {
    XsltForms_submission.requesteventlog(evcontext, req);
  }
  XsltForms_xmlevents.dispatch(this, "xforms-submit-error", null, null, null, null, evcontext);
};

    
/**
 * * '''toUrl_''' method : recursively collects node values to add them to an URL
 */

XsltForms_submission.toUrl_ = function(node, separator) {
  var url = "";
  var val = "";
  var hasChilds = false;
  for(var i = 0, len = node.childNodes.length; i < len; i++) {
    var child = node.childNodes[i];
    switch (child.nodeType) {
      case Fleur.Node.ELEMENT_NODE:
        hasChilds = true;
        url += this.toUrl_(child, separator);
        break;
      case Fleur.Node.TEXT_NODE:
        val += child.nodeValue;
        break;
    }
  }
  if (!hasChilds && val.length > 0) {
    url += node.nodeName + '=' + encodeURIComponent(val) + separator;
  }
  return url;
};