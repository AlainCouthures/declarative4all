"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module input
 * @description  === "XsltForms_input" class ===
 * Input Control  Class
 * * constructor function : initializes specific properties including aid button management
 */
    
new XsltForms_class("XsltForms_input", "HTMLElement", "xforms-input", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");
new XsltForms_class("XsltForms_input", "HTMLElement", "xforms-secret", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");
new XsltForms_class("XsltForms_input", "HTMLElement", "xforms-textarea", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");
    
function XsltForms_input(subform, elt, clone) {
  this.name = "i" + String(XsltForms_globals.counters.input++);
  this.init(subform, elt);
  this.controlName = "input";
  this.binding = new XsltForms_binding(subform, elt);
  this.inputmode = XsltForms_input.InputMode[elt.getAttribute("xf-inputmode")];
  this.incremental = elt.getAttribute("xf-incremental") === "true";
  this.delay = elt.getAttribute("xf-delay");
  this.autocomplete = elt.getAttribute("autocomplete");
  if (this.autocomplete) {
    const autos = this.autocomplete.split(" ");
    if (autos.includes("username")) {
      XsltForms_globals.hasusername = true;
    }
    if (autos.includes("current-password") || autos.includes("new-password")) {
      XsltForms_globals.haspassword = true;
    }
  }
  this.timer = null;
  var cells = this.element.children;
  for (var i = 0, l = cells.length; i < l; i++) {
    var cname = cells[i].localName.toLowerCase();
    if (cname === "xforms-body") {
      this.cell = cells[i];
    } else if (cname === "xforms-hint" && cells[i].getAttribute("xf-appearance") === "minimal") {
      elt.setAttribute("title", cells[i].textContent);
    }
  }
  this.isClone = clone;
  this.hasBinding = true;
  this.itype = elt.localName.toLowerCase().substr(7);
  this.mediatype = elt.getAttribute("xf-mediatype");
  //this.initFocus(this.cell.children[0], true);
}

XsltForms_input.prototype = new XsltForms_control();


    
/**
 * * '''clone''' method : creates a new input with the given id
 */

XsltForms_input.prototype.clone = function(id) { 
  return new XsltForms_input(this.subform, id, this.valoff, this.itype, this.binding, this.inputmode, this.incremental, this.delay, this.mediatype, this.bolAidButton, true);
};


    
/**
 * * '''dispose''' method : clears properties of this element and calls the parent dispose() method
 */

XsltForms_input.prototype.dispose = function() {
  if (this.mediatype === "application/xhtml+xml" && this.type.rte) {
    switch(this.type.rte.toLowerCase()) {
      case "tinymce":
        try {
          if (XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.") {
            tinyMCE.execCommand("mceFocus", false, this.cell.children[0].id);
            tinyMCE.execCommand("mceRemoveControl", false, this.cell.children[0].id);
          } else {
            tinyMCE.editors[this.cell.children[1].id].remove();
          }
        } catch(e) {
          //alert(e);
        }
        break;
      case "ckeditor":
        if (this.rte) {
          this.rte.destroy();
          this.rte = null;
        }
    }
  }
  this.cell = null;
  this.calendarButton = null;
  XsltForms_globals.counters.input--;
  XsltForms_control.prototype.dispose.call(this);
};


    
/**
 * * '''initBody''' method : initializes the input control body according to its type (password/textarea/boolean/date/datetime)
 */

XsltForms_input.prototype.initBody = function(type) {
  var cell = this.cell;
  var input = cell.children[0];
  var tclass = type["class"];
  var initinfo = {};
  if (!input || type !== this.type) {
    var inputid = input ? input.id : "";
    this.type = type;
    if (tclass === "boolean" || !input || this.itype !== input.type) {
      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
    } else {
      while (cell.firstChild.nodeType === Fleur.Node.TEXT_NODE) {
        cell.removeChild(cell.firstChild);
      }
      for (var i = cell.childNodes.length - 1; i >= 1; i--) {
        cell.removeChild(cell.childNodes[i]);
      }
    }
    if (tclass === "boolean") {
      input = XsltForms_browser.createElement("input");
      input.type = "checkbox";
      if (inputid !== "") {
        input.id = inputid;
      }
      cell.appendChild(input);
    } else {
      if(!input || this.itype !== input.type) {
        input = XsltForms_browser.createElement(this.element.localName.toLowerCase() === "xforms-textarea" ? "textarea" : "input", cell);
        if (this.element.localName.toLowerCase() === "xforms-secret") {
          input.setAttribute("type", "password");
        }
      }
      if (inputid !== "") {
        input.id = inputid;
      }
      this.initEvents(input, (this.itype === "input" || this.itype === "secret"));
      if (tclass === "time") {
        if (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isEdge)) {
          input.type = "time";
        }
      } else if (tclass === "date" || tclass === "datetime") {
        if (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari)) {
          if (tclass === "date") {
            input.type = "date";
          } else if (tclass === "datetime"){
            input.type = "datetime-local";
          }
          } else {
          this.calendarButton = XsltForms_browser.createElement("button", cell, XsltForms_browser.selectSingleNode("calendar.label", XsltForms_browser.config) ? XsltForms_browser.i18n.get("calendar.label") : "...", "xsltforms-aid-button");
          this.calendarButton.setAttribute("type", "button");
          this.initFocus(this.calendarButton);
        }
      } else if (tclass === "number"){
        if (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari)) {
          input.type = "number";
          if (typeof type.fractionDigits === "number") {
            input.step = String(Math.pow(1, -parseInt(type.fractionDigits, 10)));
          } else {
            input.step = "any";
          }
        }
        input.setAttribute("xf-numeric", "");
        //input.style.textAlign = "right";
      } else {
        input.removeAttribute("xf-numeric");
        //input.style.textAlign = "left";
      }
      var max = type.getMaxLength();
      if (max) {
        input.maxLength = max;
      } else {
        input.removeAttribute("maxLength");
      }
      var tlength = type.getDisplayLength();
      if (tlength) { 
        input.size = tlength;
      } else { 
        input.removeAttribute("size");
      }
    }
  }
  for (const xattr in this.htmlAttrs) {
    if (this.htmlAttrs.hasOwnProperty(xattr)) {
      input.setAttribute(xattr, this.htmlAttrs[xattr]);
    }
  }
  input.name = this.name;
  this.input = input;
  if (input && input.type === "secret") {
    this.type = XsltForms_schema.getType("xsd_:string");
    this.initEvents(input, true);
  } else if (input && input.nodeName.toLowerCase() === "textarea") {
    this.type = type;
    if (this.mediatype === "application/xhtml+xml" && type.rte) {
      switch(type.rte.toLowerCase()) {
        case "tinymce":
          input.id = "xsltforms_" + String(this.element.xfIndex) + "_textarea";
          XsltForms_browser.debugConsole.write(input.id+": init="+XsltForms_globals.tinyMCEinit);
          if (!XsltForms_globals.tinyMCEinit || XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) !== "3.") {
            initinfo = type.appinfo ? eval("Object.create(" + type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") + ")") : {};
            initinfo.mode = "none";
            initinfo.Xsltforms_usersetup = initinfo.setup || function() {};
            if (!XsltForms_globals.jslibraries["http://www.tinymce.com"] || XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.") {
              initinfo.setup = function(ed) {
                initinfo.Xsltforms_usersetup(ed);
                ed.onKeyUp.add(function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
                });
                ed.onChange.add(function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
                });
                ed.onUndo.add(function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
                });
                ed.onRedo.add(function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
                });
              };
            } else {
              initinfo.setup = function(ed) {
                initinfo.Xsltforms_usersetup(ed);
                ed.on("KeyUp", function() {
                  XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(this.getContent() || "");
                });
                ed.on("Change", function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(ed.target.getContent() || "");
                });
                ed.on("Undo", function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(ed.target.getContent() || "");
                });
                ed.on("Redo", function(ed) {
                  XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(ed.target.getContent() || "");
                });
              };
              initinfo.selector = "#" + input.id;
            }
            XsltForms_browser.debugConsole.write(input.id+": initinfo="+initinfo);
            tinyMCE.init(initinfo);
            XsltForms_globals.tinyMCEinit = true;
          }
          tinyMCE.execCommand("mceAddEditor", true, input.id);
          //this.editor = new tinymce.Editor(input.id, initinfo, tinymce.EditorManager);
          break;
        case "ckeditor":
          input.id = "xsltforms_" + String(this.element.xfIndex) + "_textarea";
          if (!CKEDITOR.replace) {
            alert("CKEditor is not compatible with XHTML mode.");
          }
          initinfo = type.appinfo ? eval("Object.create(" + type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") + ")") : {};
          this.rte = CKEDITOR.replace(input.id, initinfo);
          var eltRefresh = function(evt) {
            var data = evt.editor.getData();
            if (data.substr(data.length - 1) === "\n") {
              data = data.substr(0, data.length - 1);
            }
            var ctl = XsltForms_control.getXFElement(document.getElementById(evt.editor.name));
            XsltForms_browser.setBoolMeta(ctl.element.node, "unsafe", evt.editor.mode === "source");
            ctl.valueChanged(data || "", true);
          };
          this.rte.on("change", eltRefresh);
          this.rte.on("blur", eltRefresh);
          this.rte.on("mode", eltRefresh);
      }
    }
    this.initEvents(input, false);
  }
  this.initFocus(input, true);
  this.input = input;
};


    
/**
 * * '''setValue''' method : sets the value of this input control according to its type
 */

XsltForms_input.prototype.setValue = function(value) {
  var newvalue;
  var node = this.element.node;
  var type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
  if (!this.input || type !== this.type) {
    this.initBody(type);
    this.changeReadonly();
  }
//  XsltForms_browser.debugConsole.write(this.input.id+": setValue("+value+")");
//  if (this.type.rte && this.type.rte.toLowerCase() === "tinymce" && tinymce.get(this.input.id) === undefined) {
//    XsltForms_browser.debugConsole.write(this.input.id+" is undefined");
//  }
  if (type["class"] === "boolean") {
    this.input.checked = value === "true";
  } else if (this.type.rte && this.type.rte.toLowerCase() === "tinymce" && tinymce.get(this.input.id)) {
    //var v3 = !XsltForms_globals.jslibraries["http://www.tinymce.com"] || XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.";
    try {
      var editor = tinymce.get(this.input.id);
      var prevalue = editor.getContent ? editor.getContent() : editor.contentDocument.body.innerHTML;
      if (prevalue !== value) {
        this.input.value = value || "";
        editor.setContent(value);
        newvalue = editor.contentDocument ? editor.contentDocument.body.innerHTML : editor.getContent();
        this.input.value = newvalue || "";
        XsltForms_browser.debugConsole.write(this.input.id+": getContent() ="+newvalue);
        XsltForms_browser.debugConsole.write(this.input.id+".value ="+this.input.value);
      }
    } catch (e) {
      this.input.value = value;
    }
  } else if (this.type.rte && this.type.rte.toLowerCase() === "ckeditor" && this.rte) {
    var data = this.rte.getData();
    if (data.substr(data.length - 1) === "\n") {
      data = data.substr(0, data.length - 1);
    }
    if (data !== value) {
      XsltForms_browser.debugConsole.write("value = '"+value+"'");
      XsltForms_browser.debugConsole.write(this.input.id+": getData() = '"+this.rte.getData()+"'");
      XsltForms_browser.debugConsole.write(this.input.id+".value = '"+this.input.value+"'");
      this.input.value = value || "";
      this.rte.setData(value);
      //this.input.value = this.rte.getData() || "";
    }
  } else if (this.input.type.substr(0, 4) === "date") {
    if (this.input.value !== XsltForms_browser.getValue(node).substr(0, 15)) {
      this.input.value = XsltForms_browser.getValue(node).substr(0, 15);
    }
  } else {
    var inputvalue = this.input.value;
    newvalue = value;
    if (type.parse) {
      if (inputvalue && inputvalue.length > 0) {
        try { inputvalue = type.parse(inputvalue); } catch(e) { }
      }
      if (newvalue && newvalue.length > 0) {
        try { newvalue = type.parse(newvalue); } catch(e) { }
      }
    }
    if (this.input.type === "time" || this.input.type === "date" || this.input.type === "datetime-local") {
      if (inputvalue !== newvalue) { // && this !== XsltForms_globals.focus) {
        this.input.value = newvalue;
      }
    } else if (inputvalue !== value) {
      this.input.value = value || "";
    }
  }
};


    
/**
 * * '''changeReadonly''' method : changes the read only state of this input control
 */

XsltForms_input.prototype.changeReadonly = function() {
  var node = this.element.node;
  var type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
  if (this.input) {
    if (type["class"] === "boolean") {
      this.input.disabled = this.readonly;
    }
    this.input.readOnly = this.readonly;
    if (this.calendarButton) {
      this.calendarButton.style.display = this.readonly ? "none" : "";
    }
  }
};


    
/**
 * * '''initEvents''' method : initializes the event management according to incremental capability
 */

XsltForms_input.prototype.initEvents = function(input, canActivate) {
  var changeEventName = "keyup";
  if (XsltForms_browser.isEdge || XsltForms_browser.isIE11 || (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari))) {
    changeEventName = "input";
  }
  //changeEventName = "change";
  if (this.inputmode) {
    XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpInputMode);
  }
  if (canActivate) {
    XsltForms_browser.events.attach(input, "keydown", XsltForms_input.keyDownActivate);
    XsltForms_browser.events.attach(input, "keypress", XsltForms_input.keyPressActivate);
    if (this.incremental) {
      XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpIncrementalActivate);
    //} else {
    //  XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpActivate);
    }
  } else {
    if (this.incremental) {
      XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpIncremental);
      XsltForms_browser.events.attach(input, "change", XsltForms_input.keyUpIncremental);
    }
  }
};


    
/**
 * * '''blur''' method : manages the blur event when not in incremental mode
 * @callback
 */

XsltForms_input.prototype.blur = function(target) {
  XsltForms_globals.focus = null;
  var input = this.input;
  var value;
  if (!this.incremental) {
    XsltForms_browser.assert(input, this.element.id);
    if (input.type === "checkbox") {
      value = input.checked ? "true" : "false";
    } else if (input.nodeName.toLowerCase() !== "textarea") {
      value = input.value;
      if (input.type === "time" && value && value.length === 5) {
        value += ":00";
      }
    } else if (this.type.rte && this.type.rte.toLowerCase() === "tinymce") {
      value = tinyMCE.get(input.id).getContent();
    } else if (this.type.rte && this.type.rte.toLowerCase() === "ckeditor") {
      value = this.rte.getData();
      if (value.substr(value.length - 1) === "\n") {
        value = value.substr(0, value.length - 1);
      }
    } else {
      value = input.value;
    }
    this.valueChanged(value);
  } else {
    var node = this.element.node;
    value = input.value;
    if (value && value.length > 0 && input.type !== "time" && input.type.substr(0, 4) !== "date" && XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").format) {
      try { input.value = XsltForms_browser.getValue(node, true); } catch(e) { }
    }
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
      this.valueChanged(value);
    }
  }
};


    
/**
 * * '''click''' method : manages the click event according to the input control type
 */

XsltForms_input.prototype.click = function(target) {
  if (target === this.aidButton) {
    XsltForms_globals.openAction("XsltForms_input.prototype.click#1");
    XsltForms_xmlevents.dispatch(this, "ajx-aid");
    XsltForms_globals.closeAction("XsltForms_input.prototype.click#1");
  } else if (target === this.input && this.type["class"] === "boolean") {
    XsltForms_globals.openAction("XsltForms_input.prototype.click#2");
    this.valueChanged(target.checked? "true" : "false");
    XsltForms_xmlevents.dispatch(this, "DOMActivate");
    XsltForms_globals.closeAction("XsltForms_input.prototype.click#2");
  } else if (target === this.calendarButton) {
    XsltForms_calendar.show(target.previousSibling, this.type["class"] === "datetime"? XsltForms_calendar.SECONDS : XsltForms_calendar.ONLY_DATE);
  }
};


    
/**
 * * '''keyUpInputMode''' function : updates this input control value after key up
 */

XsltForms_input.keyUpInputMode = function() {
  var xf = XsltForms_control.getXFElement(this);
  this.value = xf.inputmode(this.value);
};


    
/**
 * * '''keyDownActivate''' function : records the key code when down
 */

XsltForms_input.keyDownActivate = function(a) {
  this.keyDownCode = a.keyCode;
};


    
/**
 * * '''keyPressActivate''' function : records the key code when pressed
 */

XsltForms_input.keyPressActivate = function(a) {
//  console.log("keyPressActivate");
  var xf = XsltForms_control.getXFElement(this);
  this.keyPressCode = a.keyCode;
  if (a.keyCode === 13) {
    XsltForms_globals.openAction("XsltForms_input.keyUpActivate");
    xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
    XsltForms_xmlevents.dispatch(xf, "DOMActivate");
    XsltForms_globals.closeAction("XsltForms_input.keyUpActivate");
    if (a.stopPropagation) {
      a.stopPropagation();
      a.preventDefault();
    } else {
      a.cancelBubble = true;
    }
  }
};


    
/**
 * * '''keyUpActivate''' function : checks if Enter key was pressed to dispatch DOMActivate
 */

XsltForms_input.keyUpActivate = function(a) {
  //console.log("keyUpActivate");
  //var xf = XsltForms_control.getXFElement(this);
  //if (a.keyCode === 13 && (this.keyDownCode === 13 || this.keyPressCode === 13)) {
  //  XsltForms_globals.openAction("XsltForms_input.keyUpActivate");
  //  xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
  //  XsltForms_xmlevents.dispatch(xf, "DOMActivate");
  //  XsltForms_globals.closeAction("XsltForms_input.keyUpActivate");
  //}
  this.keyDownCode = this.keyPressCode = null;
};


    
/**
 * * '''keyUpIncrementalActivate''' function : checks if Enter key was pressed to dispatch DOMActivate in incremental mode
 */

XsltForms_input.keyUpIncrementalActivate = function(a) {
  var xf = XsltForms_control.getXFElement(this);
//  if (a.keyCode === 13 && (this.keyDownCode === 13 || this.keyPressCode === 13)) {
//    XsltForms_globals.openAction("XsltForms_input.keyUpIncrementalActivate#1");
//    xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
//    XsltForms_xmlevents.dispatch(xf, "DOMActivate");
//    XsltForms_globals.closeAction("XsltForms_input.keyUpIncrementalActivate#1");
//  } else {
    if (xf.delay && xf.delay > 0) {
      if (xf.timer) {
        window.clearTimeout(xf.timer);
      }
      var _self = this;
      xf.timer = window.setTimeout(
        function () {
          XsltForms_globals.openAction('XsltForms_input.keyUpIncrementalActivate#2');
          xf.valueChanged((_self.type === "time" && _self.value && _self.value.length === 5 ? _self.value + ":00" : _self.value) || "");
          XsltForms_globals.closeAction('XsltForms_input.keyUpIncrementalActivate#2');
        }, xf.delay);
    } else {
      XsltForms_globals.openAction("XsltForms_input.keyUpIncrementalActivate#3");
      xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
      XsltForms_globals.closeAction("XsltForms_input.keyUpIncrementalActivate#3");
    }
//  }
  this.keyDownCode = this.keyPressCode = null;
};


    
/**
 * * '''inputActivate''' function : treats spinner input value changes
 * @callback
 */

XsltForms_input.inputActivate = function(a) {
  var xf = XsltForms_control.getXFElement(this);
  XsltForms_globals.openAction("XsltForms_input.inputActivate#1");
  xf.valueChanged(this.value || "");
  XsltForms_globals.closeAction("XsltForms_input.inputActivate#1");
};


    
/**
 * * '''keyUpIncremental''' function : updates this input control value after key up in incremental mode
 */

XsltForms_input.keyUpIncremental = function() {
  var xf = XsltForms_control.getXFElement(this);
  if (xf.delay && xf.delay > 0) {
    if (xf.timer) {
      window.clearTimeout(xf.timer);
    }
    var _self = this;
    xf.timer = window.setTimeout(
      function () {
        XsltForms_globals.openAction('XsltForms_input.keyUpIncremental#1');
        xf.valueChanged((_self.type === "time" && _self.value && _self.value.length === 5 ? _self.value + ":00" : _self.value) || "");
        XsltForms_globals.closeAction('XsltForms_input.keyUpIncremental#1');
      }, xf.delay);
  } else {
    XsltForms_globals.openAction("XsltForms_input.keyUpIncremental#2");
    xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
    XsltForms_globals.closeAction("XsltForms_input.keyUpIncremental#2");
  }
};


    
/**
 * * '''InputMode''' functions set : specific check function for each possible input mode (lowerCase/upperCase/titleCase/digits)
 */

XsltForms_input.InputMode = {
  lowerCase : function(value) { return value.toLowerCase(); },
  upperCase : function(value) { return value.toUpperCase(); },
  titleCase : function(value) { return value.charAt(0).toUpperCase() + value.substring(1).toLowerCase(); },
  digits : function(value) {
    if (/^[0-9]*$/.exec(value)) {
      return value;
    }
    alert("Character not valid");
    var digits = "1234567890";
    var newValue = "";
    for (var i = 0, len = value.length; i < len; i++) {
      if (digits.indexOf(value.charAt(i)) !== -1) {
        newValue += value.charAt(i);
      }
    }
    return newValue;
  }
};