/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser Fleur XsltForms_schema XsltForms_control XsltForms_class XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module range
 * @description  === "XsltForms_range" class ===
 * Upload Control  Class
 * * constructor function : initializes specific properties including aid button management
 */
		
new XsltForms_class("XsltForms_range", "HTMLElement", "xforms-range", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");

function XsltForms_range(subform, elt) {
	XsltForms_globals.counters.upload++;
	this.init(subform, elt);
	this.controlName = "range";
	this.binding = new XsltForms_binding(subform, elt);
	this.incremental = elt.getAttribute("xf-incremental") !== "false";
	this.hasBinding = true;
	this.start = parseFloat(elt.getAttribute("xf-start") || 0);
	this.end = parseFloat(elt.getAttribute("xf-end") || 0);
	this.step = parseFloat(elt.getAttribute("xf-step") || 1);
	this.value = "";
	var cells = this.element.children;
	for (var i = 0, l = cells.length; i < l; i++) {
		var cname = cells[i].localName.toLowerCase();
		if (cname === "xforms-body") {
			this.cell = cells[i];
		} else if (cname === "xforms-hint" && cells[i].getAttribute("xf-appearance") === "minimal") {
			elt.setAttribute("title", cells[i].textContent);
		}
	}
	this.initBody();
}

XsltForms_range.prototype = new XsltForms_control();


		
/**
 * * '''clone''' method : creates a new range with the given id
 */

XsltForms_range.prototype.clone = function(id) { 
	return new XsltForms_range(this.subform, id, this.valoff, this.binding, this.incremental, this.start, this.end, this.step, this.bolAidButton, true);
};


		
/**
 * * '''dispose''' method : clears properties of this element and calls the parent dispose() method
 */

XsltForms_range.prototype.dispose = function() {
	this.cell = null;
	XsltForms_globals.counters.range--;
	XsltForms_control.prototype.dispose.call(this);
};

		
/**
 * * '''initBody''' method : initializes the input control body according to its type (password/textarea/boolean/date/datetime)
 */

XsltForms_range.railfocus = function(evt) {
	var target = XsltForms_browser.events.getTarget(evt);
	var parentNode = target;
	while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
		var xf = parentNode.xfElement;
		if (xf) {
			alert("rail_focus "+xf.element.id);
			break;
		}
		parentNode = parentNode.parentNode;
	}
};

XsltForms_range.raildown = function(evt) {
	var target = XsltForms_browser.events.getTarget(evt);
	var parentNode = target;
	while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
		var xf = parent.xfElement;
		if (xf) {
			var newPos = XsltForms_browser.getEventPos(evt).x + (window.pageLeft !== undefined ? window.pageLeft : (document.documentElement && document.documentElement.scrollLeft !== undefined) ? document.documentElement.scrollLeft : document.body.scrollLeft);
			parentNode = xf.rail;
			while (parentNode) {
				newPos -= parentNode.offsetLeft;
				parentNode = parentNode.offsetParent;
			}
			var node = xf.element.node;
			var value = Math.round(newPos / xf.rail.clientWidth * (xf.end - xf.start) / xf.step) * xf.step + xf.start;
			var dt = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
			if (dt.format) {
				value = dt.format(value);
			}
			xf.setValue(value);
			if (xf.incremental) {
				XsltForms_globals.openAction("XsltForms_range#1");
				xf.valueChanged(String(xf.value));
				XsltForms_globals.closeAction("XsltForms_range#1");
			}
			if (!document.activeElement || !document.activeElement !== xf.cursor) {
				xf.cursor.focus();
			}
			break;
		}
		parentNode = parentNode.parentNode;
	}
};

XsltForms_range.cursordown = function(evt) {
	var target0 = XsltForms_browser.events.getTarget(evt);
	var parentNode0 = target0;
	while (parentNode0 && parentNode0.nodeType === Fleur.Node.ELEMENT_NODE) {
		var xf0 = parentNode0.xfElement;
		if (xf0) {
			xf0.offset = XsltForms_browser.getEventPos(evt).x + (window.pageLeft !== undefined ? window.pageLeft : (document.documentElement && document.documentElement.scrollLeft !== undefined) ? document.documentElement.scrollLeft : document.body.scrollLeft);
			parentNode0 = xf0.cursor;
			while (parentNode0) {
				xf0.offset -= parentNode0.offsetLeft;
				parentNode0 = parentNode0.offsetParent;
			}
			document.onmousemove = function(evt) {
				var target = XsltForms_browser.isIE ? document.activeElement : XsltForms_browser.events.getTarget(evt);
				var parentNode = target;
				while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
					var xf = parentNode.xfElement;
					if (xf) {
						var newPos = XsltForms_browser.getEventPos(evt).x - xf.offset + (window.pageLeft !== undefined ? window.pageLeft : (document.documentElement && document.documentElement.scrollLeft !== undefined) ? document.documentElement.scrollLeft : document.body.scrollLeft);
						parentNode = xf.rail;
						while (parentNode) {
							newPos -= parentNode.offsetLeft;
							parentNode = parentNode.offsetParent;
						}
						var node = xf.element.node;
						var value = Math.round(newPos / xf.rail.clientWidth * (xf.end - xf.start) / xf.step) * xf.step + xf.start;
						value = Math.min(Math.max(value, xf.start), xf.end);
						var dt = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
						if (dt.format) {
							value = dt.format(value);
						}
						xf.setValue(value);
						if (xf.incremental) {
							XsltForms_globals.openAction("XsltForms_range#2");
							xf.valueChanged(String(xf.value));
							XsltForms_globals.closeAction("XsltForms_range#2");
						}
						if (!document.activeElement || !document.activeElement !== xf.cursor) {
							xf.cursor.focus();
						}
						break;
					}
					parentNode = parentNode.parentNode;
				}
			};
			document.onmouseup = function() {
				document.onmousemove = null;
				document.onmouseup = null;
			};
			if (!document.activeElement || !document.activeElement !== xf0.cursor) {
				xf0.cursor.focus();
			}
			break;
		}
		parentNode0 = parentNode0.parentNode;
	}
	if (typeof evt.stopPropagation === "function") {
		evt.stopPropagation();
	}
	else if (typeof evt.cancelBubble !== "undefined") {
		evt.cancelBubble = true;	
	}
	if (evt.preventDefault) {
		evt.preventDefault();
	}
};

XsltForms_range.prototype.initBody = function() {
	if (this.cell.children.length === 0) {
		this.cell.innerHTML = '<xforms-range-rail><xforms-range-cursor></xforms-range-cursor></xforms-range-rail><xforms-range-value></xforms-range-value>';
	}
	this.rail = this.cell.children[0];
	this.cursor = this.rail.children[0];
	this.outputvalue = this.cell.children[1];
	XsltForms_browser.events.attach(this.rail, "focus", XsltForms_range.railfocus);
	XsltForms_browser.events.attach(this.rail, "mousedown", XsltForms_range.raildown);
	XsltForms_browser.events.attach(this.cursor, "mousedown", XsltForms_range.cursordown);
	this.initFocus(this.cell.children[0], true);
};


		
/**
 * * '''setValue''' method : sets the value of this input control according to its type
 */

XsltForms_range.prototype.setValue = function(value) {
	this.outputvalue.innerHTML = value;
	var node = this.element.node;
	var f = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").parse;
	if (f) {
		value = f(value);
	}
	if (this.value !== value) {
		this.value = value;
		this.cursor.style.left = Math.round(this.rail.clientWidth * (this.value - this.start) / (this.end - this.start)) + "px";
	}
};


		
/**
 * * '''blur''' method : manages the blur event when not in incremental mode
 * @callback
 */

XsltForms_range.prototype.blur = function(target) {
	XsltForms_globals.focus = null;
	if (!this.incremental) {
		XsltForms_browser.assert(this.input, this.element.id);
		this.valueChanged(this.value);
	}
};