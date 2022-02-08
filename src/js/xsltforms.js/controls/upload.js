/*eslint-env browser, jquery*/
/*globals XsltForms_globals XsltForms_browser XsltForms_control XsltForms_schema plupload XsltForms_xmlevents XsltForms_class XsltForms_subform XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module upload
 * @description  === "XsltForms_upload" class ===
 * Upload Control  Class
 * * constructor function : initializes specific properties including aid button management
 */
    
new XsltForms_class("XsltForms_upload", "HTMLElement", "xforms-upload", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");

function XsltForms_upload(subform, elt) {
  XsltForms_globals.counters.upload++;
  this.init(subform, elt);
  this.controlName = "upload";
  this.binding = new XsltForms_binding(subform, elt);
  this.incremental = elt.getAttribute("xf-incremental") === "true";
  var cells = this.element.children;
  for (var i = 0, l = cells.length; i < l; i++) {
    var cname = cells[i].localName.toLowerCase();
    if (cname === "xforms-body") {
      this.cell = cells[i];
    } else if (cname === "xforms-hint" && cells[i].getAttribute("xf-appearance") === "minimal") {
      elt.setAttribute("title", cells[i].textContent);
    }
  }
  this.hasBinding = true;
  var headers = [];
  var resource, filename, mediatype;
  Array.prototype.slice.call(elt.children).forEach(function(n) {
    switch(n.localName.toLowerCase()) {
      case "xforms-filename":
        filename = n;
        break;
      case "xforms-mediatype":
        mediatype = n;
        break;
      case "xforms-resource":
        resource = n;
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
  this.mediatype = mediatype ?
    mediatype.hasAttribute("xf-value")  || mediatype.hasAttribute("xf-ref") ? new XsltForms_binding(subform, mediatype) : mediatype.textContent :
    elt.getAttribute("xf-mediatype");
  this.filename = filename ?
    filename.hasAttribute("xf-value")  || filename.hasAttribute("xf-ref") ? new XsltForms_binding(subform, filename) : filename.textContent :
    elt.getAttribute("xf-filename");
  this.headers = headers;
  this.resource = resource ?
    resource.hasAttribute("xf-value") ? new XsltForms_binding(subform, resource) : resource.textContent :
    elt.getAttribute("xf-resource");
  this.value = "";
  //if (!window.FileReader && !(document.applets.xsltforms || document.getElementById("xsltforms_applet"))) {
  //  XsltForms_browser.loadapplet();
  //}
  this.initBody();
}

XsltForms_upload.prototype = new XsltForms_control();

XsltForms_upload.contents = {};


    
/**
 * * '''resource''' method : declares the resource
 */

XsltForms_upload.prototype.resource = function(resource) {
  this.resource = resource;
  return this;
};

    
/**
 * * '''header''' method : declares a header
 */

XsltForms_upload.prototype.header = function(nodeset, combine, fname, values) {
  this.headers.push({nodeset: nodeset, combine: combine, name: fname, values: values});
  return this;
};

    
/**
 * * '''clone''' method : creates a new upload with the given id
 */

XsltForms_upload.prototype.clone = function(id) { 
  return new XsltForms_upload(this.subform, id, this.valoff, this.binding, this.incremental, this.filename, this.mediatype, this.bolAidButton, true);
};


    
/**
 * * '''dispose''' method : clears properties of this element and calls the parent dispose() method
 */

XsltForms_upload.prototype.dispose = function() {
  this.cell = null;
  XsltForms_globals.counters.upload--;
  XsltForms_control.prototype.dispose.call(this);
};

    
/**
 * * '''initBody''' method : initializes the input control body according to its type (password/textarea/boolean/date/datetime)
 */

XsltForms_upload.prototype.initBody = function() {
  if (this.resource) {
    if (this.cell.children.length === 0 || this.cell.children[0].nodeName.toUpperCase() !== "BUTTON") {
      this.cell.innerHTML = '<button type="button">Select&nbsp;files</button><button type="button">Upload</button>';
      this.input = this.cell.children[0];
    } else {
      this.input = this.cell.children[0];
    }
  } else {
    if (this.cell.children.length === 0 || this.cell.children[0].nodeName.toUpperCase() !== "INPUT") {
      this.cell.innerHTML = '<input type="file">';
      this.input = this.cell.children[0];
      this.input.onclick = function(event) {
        return event.target.parentElement.parentElement.xfElement.directclick();
      };
      this.input.onchange = function(event) {
        event.target.parentElement.parentElement.xfElement.change();
      };
    } else {
      this.input = this.cell.children[0];
    }
  }
  this.initFocus(this.input);
};


    
/**
 * * '''setValue''' method : sets the value of this input control according to its type
 */

XsltForms_upload.prototype.setValue = function(value) {
  var node = this.element.node;
  this.type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
  if (this.value !== value) {
    this.value = value || "";
    if (this.input.parentElement.nodeName.toLowerCase() === "form") {
      this.input.form.reset();
    }
  }
  if (this.resource && typeof plupload !== "undefined") {
    if (!this.uploader) {
      var upsettings = {};
      eval("upsettings = " + (this.type.appinfo ? this.type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") : "{}"));
      upsettings.url = "dummy";
      upsettings.init = {
        PostInit: function() {
          var uploadctl = XsltForms_control.getXFElement(this.getOption("browse_button")[0]);
          if (uploadctl.uploadbtn) {
            uploadctl.uploadbtn.disabled = true;
            uploadctl.uploadbtn.onclick = function() {
              var uploadctl1 = XsltForms_control.getXFElement(this);
              uploadctl1.uploader.start();
              return false;
            };
          }
        },
        FileFiltered: function(up, file) {
          var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
          if ((" " + uploadctl.value + " ").indexOf(" " + file.name + " ") === -1) {
            if (uploadctl.value !== "") {
              uploadctl.value = uploadctl.value + " " + file.name;
            } else {
              uploadctl.value = file.name;
            }
            if (uploadctl.incremental) {
              uploadctl.valueChanged(uploadctl.value);
            }
          }
          if (uploadctl.uploadbtn) {
            uploadctl.uploadbtn.disabled = false;
          }
        },
        BeforeUpload: function(up) {
          var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
          var resource;
          if (uploadctl.resource.bind_evaluate) {
            resource = XsltForms_globals.stringValue(uploadctl.resource.bind_evaluate(uploadctl.subform, uploadctl.boundnodes[0]));
          } else {
            resource = uploadctl.resource;
          }
          up.setOption("url", resource);
          var len = uploadctl.headers.length;
          if (len !== 0) {
            var upheaders = {};
            for (var i = 0, len0 = uploadctl.headers.length; i < len0; i++) {
              var nodes = [];
              if (uploadctl.headers[i].nodeset) {
                nodes = uploadctl.headers[i].nodeset.bind_evaluate(uploadctl.subform, uploadctl.boundnodes[0]);
              } else {
                nodes = uploadctl.boundnodes;
              }
              var hname;
              for (var n = 0, lenn = nodes.length; n < lenn; n++) {
                if (uploadctl.headers[i].name.bind_evaluate) {
                  hname = XsltForms_globals.stringValue(uploadctl.headers[i].name.bind_evaluate(uploadctl.subform, nodes[n]));
                } else {
                  hname = uploadctl.headers[i].name;
                }
                if (hname !== "") {
                  var hvalue = "";
                  var j;
                  var len2;
                  for (j = 0, len2 = uploadctl.headers[i].values.length; j < len2; j++) {
                    var hv = uploadctl.headers[i].values[j];
                    var hv2;
                    if (hv.bind_evaluate) {
                      hv2 = XsltForms_globals.stringValue(hv.bind_evaluate(uploadctl.subform, nodes[n]));
                    } else {
                      hv2 = hv;
                    }
                    hvalue += hv2;
                    if (j < len2 - 1) {
                      hvalue += ",";
                    }
                  }
                  upheaders[hname] = hvalue;
                }
              }
            }
            up.setOption("headers", upheaders);
          }
        },
        UploadComplete: function(up) {
          var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
          if (uploadctl.uploadbtn) {
            uploadctl.uploadbtn.disabled = true;
          }
          if (uploadctl.error) {
            uploadctl.error = null;
          } else {
            XsltForms_xmlevents.dispatch(uploadctl, "xforms-upload-done");
          }
        },
        Error: function(up, err) {
          var evcontext = {
            "method": "POST",
            "resource-uri": up.getOption("url"),
            "error-type": "resource-error",
            "response-body": err.response,
            "response-status-code": err.code,
            "response-reason-phrase": err.message
          };
          var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
          uploadctl.error = true;
          XsltForms_xmlevents.dispatch(uploadctl, "xforms-upload-error", null, null, null, null, evcontext);
        }
      };
      if (XsltForms_globals.jslibraries["http://www.plupload.com/jquery.ui.plupload"]) {
        var $jQuery = jQuery.noConflict();
        $jQuery(this.element.children[this.valoff].firstChild).plupload(upsettings);
      } else {
        this.uploadbtn = this.element.children[this.valoff].firstChild.children[1];
        upsettings.browse_button = this.element.children[this.valoff].firstChild.firstChild;
        this.uploader = new plupload.Uploader(upsettings);
        this.uploader.init();
      }
    }
  }
};


    
/**
 * * '''blur''' method : manages the blur event when not in incremental mode
 * @callback
 */

XsltForms_upload.prototype.blur = function(target) {
  XsltForms_globals.focus = null;
  if (!this.incremental) {
    XsltForms_browser.assert(this.input, this.element.id);
    this.valueChanged(this.value);
  }
};


    
/**
 * * '''directclick'' method : directly manages the click event
 */

XsltForms_upload.prototype.directclick = function() {
  if (window.FileReader) {
    return true;
  }
  if (this.type.nsuri !== "http://www.w3.org/2001/XMLSchema" || (this.type.name !== "anyURI" && this.type.name !== "string" && this.type.name !== "base64Binary" && this.type.name !== "hexBinary")) {
    alert("Unexpected type for upload control: " + this.type.nsuri + " " + this.type.name);
    throw new Error("Error");
  } else {
    var filename = "unselected";
    var content = XsltForms_browser.readFile("", "ISO-8859-1", this.type.name, "XSLTForms Java Upload");
    if (document.applets.xsltforms) {
      filename = document.applets.xsltforms.lastChosenFileName;
    } else {
      if( document.getElementById("xsltforms_applet") ) {
        filename = document.getElementById("xsltforms_applet").xsltforms.lastChosenFileName;
      }
    }
    filename = filename.split('\\').pop();
    if (this.type.name === "anyURI") {
      this.value = "file://" + filename + "?id=" + this.element.id;
      XsltForms_upload.contents[this.element.id] = content;
    } else {
      this.value = content;
    }
    this.input.value = filename;
    if (this.incremental) {
      this.valueChanged(this.value);
    }
    if(this.filename && this.filename.bind_evaluate) {
      var filenameref = this.filename.bind_evaluate(this.element.node)[0];
      if (filenameref) {
        XsltForms_globals.openAction("XsltForms_upload.prototype.directclick");
        XsltForms_browser.setValue(filenameref, filename || "");
        var model = document.getElementById(XsltForms_browser.getDocMeta(filenameref.ownerDocument, "model")).xfElement;
        model.addChange(filenameref);
        XsltForms_xmlevents.dispatch(model, "xforms-recalculate");
        XsltForms_globals.refresh();
        XsltForms_globals.closeAction("XsltForms_upload.prototype.directclick");
      }
    }
  }
  return false;
};


    
/**
 * * '''change'' method : manages the change event
 */

XsltForms_upload.prototype.change = function() {
  if (this.type.nsuri !== "http://www.w3.org/2001/XMLSchema" || (this.type.name !== "anyURI" && this.type.name !== "string" && this.type.name !== "base64Binary" && this.type.name !== "hexBinary")) {
    alert("Unexpected type for upload control: " + this.type.nsuri + " " + this.type.name);
    throw new Error("Error");
  } else {
    var filename = "unselected";
    var content = "";
    var xf = this;
    try {
      var fr = new FileReader();
      var file = xf.input.files[0];
      if (!file) {
        xf.value = "";
        if (xf.incremental) {
          xf.valueChanged("");
        }
      } else {
        filename = file.name;
        if (xf.type.name === "string") {
          fr.onload = function(e) {
            var bytes = new Uint8Array(e.target.result);
            for( var i = 0, len = bytes.length; i < len; i++) {
              content += String.fromCharCode(bytes[i]);
            }
            xf.value = content;
            if (xf.incremental) {
              xf.valueChanged(content);
            }
          };
        } else if (xf.type.name === "hexBinary") {
          fr.onload = function(e) {
            var bytes = new Uint8Array(e.target.result);
            for( var i = 0, len = bytes.length; i < len; i++) {
              var c = bytes[i] >> 4;
              var d = bytes[i] & 0xF;
              content += String.fromCharCode(c > 9 ? c + 55 : c + 48, d > 9 ? d + 55 : d + 48);
            }
            xf.value = content;
            if (xf.incremental) {
              xf.valueChanged(content);
            }
          };
        } else if (xf.type.name === "base64Binary") {
          fr.onload = function(e) {
            var bytes = new Uint8Array(e.target.result);
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var len = bytes.length;
            bytes[len] = bytes[len+1] = 0;
            for( var i = 0; i < len; i += 3) {
              var c1 = bytes[i] >> 2;
              var c2 = ((bytes[i] & 3) << 4) | (bytes[i+1] >> 4);
              var c3 = ((bytes[i+1] & 15) << 2) | (bytes[i+2] >> 6);
              var c4 = bytes[i+2] & 63;
              if( i === len - 1) {
                c3 = c4 = 64;
              } else if( i === len -2) {
                c4 = 64;
              }
              content += b64.charAt(c1) + b64.charAt(c2) + b64.charAt(c3) + b64.charAt(c4);
            }
            xf.value = content;
            if (xf.incremental) {
              xf.valueChanged(content);
            }
          };
        } else {
          fr.onload = function(e) {
            XsltForms_upload.contents[xf.element.id] = e.target.result;
            xf.value = "file://" + filename + "?id=" + (xf.element.id || "xsltforms_" + String(xf.element.xfIndex));
            if (xf.incremental) {
              xf.valueChanged(xf.value);
            }
          };
        }
        fr.readAsArrayBuffer(file);
      }
    } catch (e) {
      content = XsltForms_browser.readFile(xf.input.value, "ISO-8859-1", xf.type.name, "");
      if (xf.type.name === "anyURI") {
        xf.value = "file://" + filename + "?id=" + xf.element.id;
        XsltForms_upload.contents[xf.element.id] = content;
      } else {
        xf.value = content;
      }
      if (xf.incremental) {
        xf.valueChanged(xf.value);
      }
    }
    if(this.filename && this.filename.bind_evaluate) {
      var filenameref = this.filename.bind_evaluate(this.element.node)[0];
      if (filenameref) {
        XsltForms_globals.openAction("XsltForms_upload.prototype.change");
        XsltForms_browser.setValue(filenameref, filename || "");
        var model = document.getElementById(XsltForms_browser.getDocMeta(filenameref.ownerDocument, "model")).xfElement;
        model.addChange(filenameref);
        XsltForms_xmlevents.dispatch(model, "xforms-recalculate");
        XsltForms_globals.refresh();
        XsltForms_globals.closeAction("XsltForms_upload.prototype.change");
      }
    }
  }
};