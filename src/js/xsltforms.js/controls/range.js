/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser Fleur XsltForms_schema XsltForms_control*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module range
 * @description  === "XsltForms_range" class ===
 * Upload Control  Class
 * * constructor function : initializes specific properties including aid button management
 */
		
function XsltForms_range(subform, id, valoff, binding, incremental, start, end, step, aidButton, clone) {
	XsltForms_globals.counters.upload++;
	this.init(subform, id);
	this.controlName = "range";
	this.binding = binding;
	this.incremental = incremental;
	var cells = this.element.children;
	this.valoff = valoff;
	this.cell = cells[valoff];
	this.rail = this.cell.children[0].children[0];
	this.cursor = this.rail.children[0];
	this.outputvalue = this.cell.children[0].children[1];
	this.isClone = clone;
	this.hasBinding = true;
	this.bolAidButton = aidButton;
	this.start = parseFloat(start);
	this.end = parseFloat(end);
	this.step = parseFloat(step);
	this.value = "";
	this.initFocus(this.cell.children[0], true);
	XsltForms_browser.events.attach(this.rail, "focus", function(evt) {
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
	} );
	XsltForms_browser.events.attach(this.rail, "mousedown", function(evt) {
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
					xf.valueChanged(xf.value + "");
					XsltForms_globals.closeAction("XsltForms_range#1");
				}
				if (!document.activeElement || !document.activeElement !== xf.cursor) {
					xf.cursor.focus();
				}
				break;
			}
			parentNode = parentNode.parentNode;
		}
	} );
	XsltForms_browser.events.attach(this.cursor, "mousedown", function(evt) {
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
								xf.valueChanged(xf.value + "");
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
	} );
	if (aidButton) {
		this.aidButton = cells[valoff + 1].children[0];
		this.initFocus(this.aidButton);
	}
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