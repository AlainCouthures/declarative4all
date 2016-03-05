/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_browser XsltForms_control tinyMCE XsltForms_schema CKEDITOR Fleur tinymce XsltForms_xmlevents XsltForms_calendar*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module input
 * @description  === "XsltForms_input" class ===
 * Input Control  Class
 * * constructor function : initializes specific properties including aid button management
 */

var XsltForms_input = {
	controlName: "input"
};
Object.assign(XsltForms_input, XsltForms_control);
		
XsltForms_engine.create.input = function(subform, input, clone) {
	XsltForms_engine.counters.input++;
	Object.assign(input, XsltForms_input);
	input.init(subform);
	input.binding = input.getAttribute("binding");
	input.inputmode = XsltForms_input.InputMode[input.getAttribute("inputmode")];
	input.incremental = input.getAttribute("incremental");
	input.delay = input.getAttribute("delay");
	input.timer = null;
	//var cells = this.element.children;
	//this.valoff = valoff;
	//this.cell = cells[valoff];
	//if (!this.cell) {
	//	XsltForms_browser.debugConsole.write("ERROR: Could not create input id " + input.id + ", with binding " + input.binding + " on subform " + subform.id);
	//	return;
	//}
	input.isClone = clone;
	input.hasBinding = true;
	//input.itype = itype;
	//input.bolAidButton = aidButton;
	input.mediatype = input.getAttribute("mediatype");
	//input.initFocus(this.cell.children[0], true);
	//if (aidButton) {
	//	input.aidButton = cells[valoff + 1].children[0];
	//	input.initFocus(this.aidButton);
	//}
};

		
/**
 * * '''clone''' method : creates a new input with the given id
 */

XsltForms_input.clone = function(id) {
	XsltForms_engine.create.input(this.subform, id, true);
};


		
/**
 * * '''dispose''' method : clears properties of this element and calls the parent dispose() method
 */

XsltForms_input.dispose = function() {
	if (this.mediatype === "application/xhtml+xml" && this.type.rte) {
		switch(this.type.rte.toLowerCase()) {
			case "tinymce":
				try {
					if (XsltForms_engine.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.") {
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
	XsltForms_engine.counters.input--;
	XsltForms_control.prototype.dispose.call(this);
};


		
/**
 * * '''initInput''' method : initializes the input control according to its type (password/textarea/boolean/date/datetime)
 */

XsltForms_input.initInput = function(type) {
	var cell = this.cell;
	var input = cell.children[0];
	var tclass = type["class"];
	var initinfo;
	if (input.type === "password") {
		this.type = XsltForms_schema.getType("xsd_:string");
		this.initEvents(input, true);
	} else if (input.nodeName.toLowerCase() === "textarea") {
		this.type = type;
		if (this.mediatype === "application/xhtml+xml" && type.rte) {
			switch(type.rte.toLowerCase()) {
				case "tinymce":
					input.id = this.element.id + "_textarea";
					XsltForms_browser.debugConsole.write(input.id+": init="+XsltForms_engine.tinyMCEinit);
					if (!XsltForms_engine.tinyMCEinit || XsltForms_engine.jslibraries["http://www.tinymce.com"].substr(0, 2) !== "3.") {
						eval("initinfo = " + (type.appinfo ? type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") : "{}"));
						initinfo.mode = "none";
						if (!XsltForms_engine.jslibraries["http://www.tinymce.com"] || XsltForms_engine.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.") {
							initinfo.setup = function(ed) {
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
						XsltForms_engine.tinyMCEinit = true;
					}
					tinyMCE.execCommand("mceAddControl", true, input.id);
					//this.editor = new tinymce.Editor(input.id, initinfo, tinymce.EditorManager);
					break;
				case "ckeditor":
					input.id = this.element.id + "_textarea";
					if (!CKEDITOR.replace) {
						alert("CKEditor is not compatible with XHTML mode.");
					}
					initinfo = "";
					eval("initinfo = " + (type.appinfo ? type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") : "{}"));
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
	} else if (type !== this.type) {
		var inputid = input.id;
		this.type = type;
		if (tclass === "boolean" || this.itype !== input.type) {
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
			input.id = inputid;
			cell.appendChild(input);
		} else {
			if(this.itype !== input.type) {
				input = XsltForms_browser.createElement("input", cell, null, "xforms-value");
			}
			input.id = inputid;
			this.initEvents(input, (this.itype === "text"));
			if (tclass === "date" || tclass === "datetime") {
				if (XsltForms_engine.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari)) {
					if (tclass === "date") {
						input.type = "date";
					}
					if (tclass === "datetime"){
						input.type = "datetime-local";
					}
			    } else {
					this.calendarButton = XsltForms_browser.createElement("button", cell, XsltForms_browser.selectSingleNode("calendar.label", XsltForms_browser.config) ? XsltForms_browser.i18n.get("calendar.label") : "...", "aid-button");
					this.calendarButton.setAttribute("type", "button");
					this.initFocus(this.calendarButton);
				}
			} else if (tclass === "number"){
				if (XsltForms_engine.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari)) {
					input.type = "number";
					if (typeof type.fractionDigits === "number") {
						input.step = "" + Math.pow(1, -parseInt(type.fractionDigits, 10));
					} else {
						input.step = "any";
					}
				}
				input.style.textAlign = "right";
			} else {
				input.style.textAlign = "left";
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
	this.initFocus(input, true);
	this.input = input;
};


		
/**
 * * '''setValue''' method : sets the value of this input control according to its type
 */

XsltForms_input.setValue = function(value) {
	var node = this.element.node;
	var type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
	if (!this.input || type !== this.type) {
		this.initInput(type);
		this.changeReadonly();
	}
//	XsltForms_browser.debugConsole.write(this.input.id+": setValue("+value+")");
//	if (this.type.rte && this.type.rte.toLowerCase() === "tinymce" && tinymce.get(this.input.id) === undefined) {
//		XsltForms_browser.debugConsole.write(this.input.id+" is undefined");
//	}
	if (type["class"] === "boolean") {
		this.input.checked = value === "true";
	} else if (this.type.rte && this.type.rte.toLowerCase() === "tinymce" && tinymce.get(this.input.id) && (!XsltForms_engine.jslibraries["http://www.tinymce.com"] || XsltForms_engine.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3." ? tinymce.get(this.input.id).getContent() : tinymce.get(this.input.id).contentDocument.body.innerHTML) !== value) {
		this.input.value = value || "";
		if (tinymce.get(this.input.id)) {
			var prevalue = tinymce.get(this.input.id).getContent();
			if (prevalue !== value) {
				tinymce.get(this.input.id).setContent(value);
				this.input.value = tinymce.get(this.input.id).getContent() || "";
			}
			XsltForms_browser.debugConsole.write(this.input.id+": getContent() ="+tinymce.get(this.input.id).getContent());
		}
		XsltForms_browser.debugConsole.write(this.input.id+".value ="+this.input.value);
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
	} else if (this.input.value !== value) { // && this !== XsltForms_engine.focus) {
		this.input.value = value || "";
	}
};


		
/**
 * * '''changeReadonly''' method : changes the read only state of this input control
 */

XsltForms_input.changeReadonly = function() {
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

XsltForms_input.initEvents = function(input, canActivate) {
	var changeEventName = "keyup";
	if (XsltForms_browser.isEdge || (XsltForms_engine.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari))) {
		changeEventName = "input";
	}
	if (this.inputmode) {
		XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpInputMode);
	}
	if (canActivate) {
		XsltForms_browser.events.attach(input, "keydown", XsltForms_input.keyDownActivate);
		XsltForms_browser.events.attach(input, "keypress", XsltForms_input.keyPressActivate);
		if (this.incremental) {
			XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpIncrementalActivate);
		} else {
			XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpActivate);
		}
	} else {
		if (this.incremental) {
			XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpIncremental);
		}
	}
};


		
/**
 * * '''blur''' method : manages the blur event when not in incremental mode
 * @callback
 */

XsltForms_input.blur = function(target) {
	XsltForms_engine.focus = null;
	var input = this.input;
	var value;
	if (!this.incremental) {
		XsltForms_browser.assert(input, this.element.id);
		value = input.type === "checkbox"? (input.checked? "true" : "false") : input.nodeName.toLowerCase() !== "textarea" ? input.value : (this.type.rte && this.type.rte.toLowerCase() === "tinymce") ? tinyMCE.get(input.id).getContent() : input.value;
		this.valueChanged(value);
	} else {
		var node = this.element.node;
		value = input.value;
		if (value && value.length > 0 && input.type.substr(0, 4) !== "date" && XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").format) {
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

XsltForms_input.click = function(target) {
	if (target === this.aidButton) {
		XsltForms_engine.openAction("XsltForms_input.prototype.click#1");
		XsltForms_xmlevents.dispatch(this, "ajx-aid");
		XsltForms_engine.closeAction("XsltForms_input.prototype.click#1");
	} else if (target === this.input && this.type["class"] === "boolean") {
		XsltForms_engine.openAction("XsltForms_input.prototype.click#2");
		this.valueChanged(target.checked? "true" : "false");
		XsltForms_xmlevents.dispatch(this, "DOMActivate");
		XsltForms_engine.closeAction("XsltForms_input.prototype.click#2");
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
	this.keyPressCode = a.keyCode;
	if (a.keyCode === 13) {
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
	var xf = XsltForms_control.getXFElement(this);
	if (a.keyCode === 13 && (this.keyDownCode === 13 || this.keyPressCode === 13)) {
		XsltForms_engine.openAction("XsltForms_input.keyUpActivate");
		xf.valueChanged(this.value || "");
		XsltForms_xmlevents.dispatch(xf, "DOMActivate");
		XsltForms_engine.closeAction("XsltForms_input.keyUpActivate");
	}
	this.keyDownCode = this.keyPressCode = null;
};


		
/**
 * * '''keyUpIncrementalActivate''' function : checks if Enter key was pressed to dispatch DOMActivate in incremental mode
 */

XsltForms_input.keyUpIncrementalActivate = function(a) {
	var xf = XsltForms_control.getXFElement(this);
	if (a.keyCode === 13 && (this.keyDownCode === 13 || this.keyPressCode === 13)) {
		XsltForms_engine.openAction("XsltForms_input.keyUpIncrementalActivate#1");
		xf.valueChanged(this.value || "");
		XsltForms_xmlevents.dispatch(xf, "DOMActivate");
		XsltForms_engine.closeAction("XsltForms_input.keyUpIncrementalActivate#1");
	} else {
		if (xf.delay && xf.delay > 0) {
			if (xf.timer) {
				window.clearTimeout(xf.timer);
			}
			var _self = this;
			xf.timer = window.setTimeout(
				function () {
					XsltForms_engine.openAction('XsltForms_input.keyUpIncrementalActivate#2');
					xf.valueChanged(_self.value || "");
					XsltForms_engine.closeAction('XsltForms_input.keyUpIncrementalActivate#2');
				}, xf.delay);
		} else {
			XsltForms_engine.openAction("XsltForms_input.keyUpIncrementalActivate#3");
			xf.valueChanged(this.value || "");
			XsltForms_engine.closeAction("XsltForms_input.keyUpIncrementalActivate#3");
		}
	}
	this.keyDownCode = this.keyPressCode = null;
};


		
/**
 * * '''inputActivate''' function : treats spinner input value changes
 * @callback
 */

XsltForms_input.inputActivate = function(a) {
	var xf = XsltForms_control.getXFElement(this);
	XsltForms_engine.openAction("XsltForms_input.inputActivate#1");
	xf.valueChanged(this.value || "");
	XsltForms_engine.closeAction("XsltForms_input.inputActivate#1");
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
				XsltForms_engine.openAction('XsltForms_input.keyUpIncremental#1');
				xf.valueChanged(_self.value || "");
				XsltForms_engine.closeAction('XsltForms_input.keyUpIncremental#1');
			}, xf.delay);
	} else {
		XsltForms_engine.openAction("XsltForms_input.keyUpIncremental#2");
		xf.valueChanged(this.value || "");
		XsltForms_engine.closeAction("XsltForms_input.keyUpIncremental#2");
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
		} else {
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
	}
};