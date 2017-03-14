/*eslint-env browser*/
/*globals XsltForms_element XsltForms_browser XsltForms_globals Fleur XsltForms_xmlevents XsltForms_repeat XsltForms_schema*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module control
 * @description  === "XsltForms_control" class ===
 * Control  Class
 * * constructor function : just sets this element as a control
 */
		
function XsltForms_control() {
	this.isControl = true;
}

XsltForms_control.prototype = new XsltForms_element();


		
/**
 * * '''initFocus''' method : attaches event handlers for "focus" and "blur"
 */

XsltForms_control.prototype.initFocus = function(element, principal) {
	if (principal) {
		this.focusControl = element;
	}
	XsltForms_browser.events.attach(element, "focus", XsltForms_control.focusHandler);
	//XsltForms_browser.events.attach(element, "mousein", XsltForms_control.focusHandler);
	XsltForms_browser.events.attach(element, "blur", XsltForms_control.blurHandler);
	//XsltForms_browser.events.attach(element, "mouseout", XsltForms_control.blurHandler);
};


		
/**
 * * '''dispose''' method : calls the parent "dispose()" method
 */

XsltForms_control.prototype.dispose = function() {
	this.focusControl = null;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''focus''' method : manages focus and dispatches the "DOMFocusIn" event
 */

XsltForms_control.prototype.focus = function(focusEvent, evcontext) {
	if (this.isOutput) {
		return;
	}
	if (XsltForms_globals.focus !== this) {
		XsltForms_globals.openAction("XsltForms_control.prototype.focus");
		XsltForms_globals.blur(true);
		XsltForms_globals.focus = this;
		XsltForms_browser.setClass(this.element, "xforms-focus", true);
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
		var parentNode = this.element.parentNode;
		while (parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (typeof parentNode.node !== "undefined" && XsltForms_browser.hasClass(parentNode, "xforms-repeat-item")) {
				XsltForms_repeat.selectItem(parentNode);
			}
			parentNode = parentNode.parentNode;
		}
		XsltForms_xmlevents.dispatch(XsltForms_globals.focus, "DOMFocusIn", null, null, null, null, evcontext);
		XsltForms_globals.closeAction("XsltForms_control.prototype.focus");
		if (this.full && !focusEvent) { // select full
			this.focusFirst();
		}
	}
	var fcontrol = this.focusControl;
	XsltForms_globals.posibleBlur = false;
	if (fcontrol && !focusEvent) {
		var control = this.focusControl;
		var cname = control.nodeName.toLowerCase();
		try {
			control.focus();
			control.focus();
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: Could not focus on element " + control);
		}
		if (cname === "input" || cname === "textarea") {
			try {
				control.select();
			} catch (e) {
			}
		}
	}
};


		
/**
 * * '''build_''' method : specific build method updating dependencies
 */

XsltForms_control.prototype.build_ = function(ctx, varresolver) {
	var result = this.evaluateBinding(this.binding, ctx, varresolver);
	if (typeof result === "object") {
		var node = result[0];
		var element = this.element;
		var old = element.node;
		if (old !== node || !XsltForms_globals.ready) {
			element.node = node;
			this.nodeChanged = true;
		}
		if (node) {
			this.depsNodesRefresh.push(node);
		}
	} else {
		this.outputValue = result;
	}
};


		
/**
 * * '''refresh''' method : refreshes this control according to the value of the corresponding node and dispatches according events
 */

XsltForms_control.prototype.refresh = function() {
	if (this.controlName === "var") {
		return;
	}
	var element = this.element;
	var node = element.node;
	if (this.outputValue !== undefined) {
		if (this.controlName !== "var") {
			this.setValue(this.outputValue);
			this.eventDispatch("xforms-disabled", "xforms-enabled", false);
		}
	} else if (node) {
		if (!this.value) {
			this.value = this.hasCopy ? [] : "";
		}
		var value = this.value instanceof Array ? XsltForms_browser.getValueItemsetCopy(node) : XsltForms_browser.getValue(node, true, this.complex);
		XsltForms_globals.openAction("XsltForms_control.prototype.refresh");
		var changed;
		if (this.currentValue instanceof Array) {
			changed = false;
			if (this.currentValue.length !== value.length) {
				changed = true;
			} else {
				for (var i = 0, l = this.currentValue.length; i < l; i++) {
					if (this.currentValue[i] !== value[i]) {
						changed = true;
						break;
					}
				}
			}
			changed = changed || this.nodeChanged;
		} else {
			changed = value !== this.currentValue || this.nodeChanged;
		}
		if (this.relevant) {
			XsltForms_browser.setClass(element, "xforms-disabled", false);
		}
		this.changeProp(node, "required", "xforms-required", "xforms-optional", changed, value);
		this.changeProp(node, "notrelevant", "xforms-disabled", "xforms-enabled", changed, value);
		this.changeProp(node, "readonly", "xforms-readonly", "xforms-readwrite", changed, value);
		this.changeProp(node, "notvalid", "xforms-invalid", "xforms-valid", changed, value);
		this.currentValue = value instanceof Array ? value.slice(0) : value;
		if (changed) {
			this.setValue(value);
			if (!this.nodeChanged && !this.isTrigger) {
				XsltForms_xmlevents.dispatch(element, "xforms-value-changed");
			}
		}
		XsltForms_globals.closeAction("XsltForms_control.prototype.refresh");
	} else {
		this.eventDispatch("xforms-disabled", "xforms-enabled", !this.hasValue);
	}
	this.nodeChanged = false;
};


		
/**
 * * '''eventdispatch''' method : dispatches corresponding event
 */

XsltForms_control.prototype.eventDispatch = function(onTrue, onFalse, value) {
	if ((!this.nodeChanged || XsltForms_globals.ready) && !this.isTrigger) {
		XsltForms_xmlevents.dispatch(this.element, (value? onTrue : onFalse));
	}
	XsltForms_browser.setClass(this.element, onTrue, value);
	XsltForms_browser.setClass(this.element, onFalse, !value);
};


		
/**
 * * '''changeProp''' method : changes a property, such as '''required''', '''relevant''', '''readonly''' and '''valid''', of this control
 */

XsltForms_control.prototype.changeProp = function(node, prop, onTrue, onFalse, changed, nvalue) {
	var value = (prop === "notvalid" && nvalue === "" && !XsltForms_globals.validationError) ? false : XsltForms_browser.getBoolMeta(node, prop);
	if (changed || value !== this[prop]) {
		this.eventDispatch(onTrue, onFalse, value);
		this[prop] = value;
		if(prop === "readonly" && this.changeReadonly) {
			this.changeReadonly();
		}
	}
};


		
/**
 * * '''valueChanged''' method : changes the value of this control and dispatches the "xforms-recalculate" event
 */

XsltForms_control.prototype.valueChanged = function(value, force) {
	var node = this.element.node;
	var model = document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement;
	var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
	if (value && !(value instanceof Array) && value.length > 0 && schtyp.parse) {
		try { value = schtyp.parse(value); } catch(e) { }
	}
	var changed;
	if (value instanceof Array) {
		var prevvalue = XsltForms_browser.getValueItemsetCopy(node);
		changed = true;
		var i = 0, l = value.length;
		if (prevvalue.length === l) {
			changed = false;
			for (; i < l; i++) {
				if (prevvalue[i] !== value[i]) {
					changed = true;
					break;
				}
			}
		}
	} else {
		changed = value !== XsltForms_browser.getValue(node);
	}
	if (changed || force) {
		if (value instanceof Array || this.currentValue instanceof Array) {
			XsltForms_browser.setValue(node, value);
			model.addChange(node);
			XsltForms_globals.addChange(model);
			model.setRebuilded(true);
		} else {
			XsltForms_globals.openAction("XsltForms_control.prototype.valueChanged");
			XsltForms_browser.setValue(node, value);
			model.addChange(node);
			XsltForms_xmlevents.dispatch(model, "xforms-recalculate");
			XsltForms_globals.refresh();
			XsltForms_globals.closeAction("XsltForms_control.prototype.valueChanged");
		}
	}
};


		
/**
 * * '''getXFElement''' function : gets the ancestor-or-self XFElement value for an element
 */

XsltForms_control.getXFElement = function(element) {
	var xf = null;
	while (!xf && element) {
		xf = element.xfElement;
		if (xf && !xf.isControl) {
			xf = null;
		}
		element = element.parentNode;
	}
	return xf;
};


		
/**
 * * '''focusHandler''' function : focus handler
 */

XsltForms_control.focusHandler = function() {
	var xf = XsltForms_control.getXFElement(this);
	if (XsltForms_globals.focus !== xf) {
		xf.focus(true);
	} else {
		XsltForms_globals.posibleBlur = false;
	}
};


		
/**
 * * '''blurHandler''' function : blur handler including a delay
 */

XsltForms_control.blurHandler = function() {
	if (XsltForms_control.getXFElement(this) === XsltForms_globals.focus) {
		XsltForms_globals.posibleBlur = true;
		//setTimeout(function(){XsltForms_globals.blur();}, 200);
		XsltForms_globals.blur();
	}
};