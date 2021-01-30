/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_control XsltForms_schema XsltForms_xmlevents XsltForms_class XsltForms_subform XsltForms_binding XsltForms_collection*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module select
 * @description  === "XsltForms_select" class ===
 * Select/Select1 Control  Class
 * * constructor function : initializes specific properties and initializes focus and change event management
 */
		
new XsltForms_class("XsltForms_select", "HTMLElement", "xforms-select", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");
new XsltForms_class("XsltForms_select", "HTMLElement", "xforms-select1", "<xforms-focus></xforms-focus><xforms-label></xforms-label><xforms-body></xforms-body><xforms-required></xforms-required><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint>");

function XsltForms_select(subform, elt, clone) {
	this.inputname = "xsltforms-select-" + String(XsltForms_globals.counters.select++);
	this.init(subform, elt);
	this.controlName = elt.localName.substr(7);
	this.binding = new XsltForms_binding(subform, elt);
	this.min = elt.getAttribute("xf-min");
	this.min = this.min ? Math.max(Number(this.min), 1) : 1;
	this.max = elt.getAttribute("xf-max");
	this.max = this.max ? Math.max(Number(this.max), this.min) : elt.localName.toLowerCase() === "xforms-select1" ? 1 : null;
	this.inputtype = this.max === 1 ? "radio" : "checkbox";
	this.full = elt.getAttribute("xf-appearance") === "full";
	this.compact = elt.getAttribute("xf-appearance") === "compact";
	this.open = elt.getAttribute("xf-selection") === "open";
	this.incremental = elt.getAttribute("xf-incremental") !== "false";
	var cells = Array.prototype.slice.call(this.element.children);
	var cname;
	for (var i = 0, l = cells.length; i < l; i++) {
		cname = cells[i].localName.toLowerCase();
		if (cname === "xforms-body") {
			this.cell = cells[i];
		} else if (cname === "xforms-hint" && cells[i].getAttribute("xf-appearance") === "minimal") {
			elt.setAttribute("title", cells[i].textContent);
		}
	}
	for (i = 0, l = cells.length; i < l; i++) {
		cname = cells[i].localName.toLowerCase();
		if (cname === "xforms-item" || cname === "xforms-itemset" || cname === "xforms-choices") {
			this.cell.appendChild(cells[i]);
		}
	}
	this.isClone = clone;
	this.hasBinding = true;
	this.outRange = false;
}

XsltForms_select.prototype = new XsltForms_control();


		
/**
 * * '''clone''' method : creates a new select/select1 control with the given id
 */

XsltForms_select.prototype.clone = function(id) { 
	return new XsltForms_select(this.subform, id, this.min, this.max, this.full, this.binding, this.open, this.incremental, true);
};


		
/**
 * * '''dispose''' method : clears properties of this select/select1 control and calls the parent dispose() method
 */

XsltForms_select.prototype.dispose = function() {
	this.select = null;
	this.selectedOptions = null;
	XsltForms_globals.counters.select--;
	XsltForms_control.prototype.dispose.call(this);
};


		
/**
 * * '''focusFirst''' method : sets focus to the first item in this select/select1 control
 */

XsltForms_select.prototype.focusFirst = function() {
	var input = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input")[0] : this.element.getElementsByTagName("input")[0];
	input.focus();
	if (XsltForms_browser.isOpera) {
		input.focus();
	}
};

XsltForms_select.initChild = {
	"xforms-item": function(child) {
		var ilabel, ivalue, icopy;
		Array.prototype.slice.call(child.children).forEach(function(subitem) {
			switch (subitem.localName.toLowerCase()) {
				case "xforms-value":
					ivalue = subitem.textContent.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
					icopy = subitem.hasAttribute("xf-copy");
					break;
				case "xforms-label":
					ilabel = subitem.innerHTML;
			}
		});
		return '<option value="' + ivalue + '"' + (icopy ? ' xf-copy' : '') + ' xf-index="' + child.xfIndex + '">' + ilabel + '</option>';
	},
	"xforms-itemset": function(child) {
		return Array.prototype.slice.call(child.children).map(function(item) {
			var f = XsltForms_select.initChild[item.localName.toLowerCase()];
			return f ? f(item) : "";
		}, "").join("");
	},
	"xforms-choices": function(child) {
		var gchildren = Array.prototype.slice.call(child.children);
		var glabel = gchildren.filter(function(n) { return n.localName.toLowerCase() === "xforms-label";});
		var alabel = glabel.length !== 0 ? ' label="' + glabel[0].textContent + '"' : "";
		return "<optgroup" + alabel + ">" + gchildren.map(function(item) {
			var f = XsltForms_select.initChild[item.localName.toLowerCase()];
			return f ? f(item) : "";
		}, "").join("") + "</optgroup>";
	}
};

XsltForms_select.initChildFull = {
	"xforms-item": function(child, thisselect) {
		var ibody, ivalue, icopy;
		Array.prototype.slice.call(child.children).forEach(function(subitem) {
			switch (subitem.localName.toLowerCase()) {
				case "xforms-body":
					ibody = subitem;
					break;
				case "xforms-value":
					ivalue = subitem.textContent.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
					icopy = subitem.hasAttribute("xf-copy");
					break;
				case "xforms-label":
					child.xfElement.label = subitem;
			}
		});
		ibody.innerHTML = '<input type="' + thisselect.inputtype + '" value="' + ivalue + '"' + (icopy ? ' xf-copy' : '') + ' name="' + thisselect.inputname + '">';
		//child.setAttribute("xf-appearance", "full");
		//XsltForms_browser.setClass(child, "xforms-appearance-full", true);
		child.xfElement.input = ibody.children[0];
		XsltForms_browser.events.attach(ibody.children[0], "focus", XsltForms_control.focusHandler);
		XsltForms_browser.events.attach(ibody.children[0], "blur", XsltForms_control.blurHandler);
	},
	"xforms-itemset": function(child, thisselect) {
		Array.prototype.slice.call(child.children).map(function(item) {
			var f = XsltForms_select.initChildFull[item.localName.toLowerCase()];
			if (f) {
				f(item, thisselect);
			}
		});
	},
	"xforms-choices": function(child, thisselect) {
		Array.prototype.slice.call(child.children).map(function(item) {
			var f = XsltForms_select.initChildFull[item.localName.toLowerCase()];
			if (f) {
				f(item, thisselect);
			}
		});
		//child.setAttribute("xf-appearance", "full");
	}
};
		
/**
 * * '''initBody''' method : initializes the select control body
 */

XsltForms_select.prototype.initBody = function() {
	var cell = this.cell;
	var thisselect = this;
	if (this.full) {
		//XsltForms_browser.setClass(this.element, "xforms-appearance-full", true);
		Array.prototype.slice.call(cell.children).forEach(function(child) {
			var f = XsltForms_select.initChildFull[child.localName.toLowerCase()];
			return f ? f(child, thisselect) : "";
		});
	} else {
		var select;
		if (cell.lastChild.localName.toLowerCase() === "select") {
			select = cell.lastChild;
		} else {
			select = document.createElement("select");
			if (!this.max || this.max > this.min + 1) {
				select.setAttribute("multiple", "");
			}
			if (this.compact) {
				select.setAttribute("size", "4");
			}
			cell.appendChild(select);
		}
		var v = select.value;
		var options = (select.value === "\xA0" ? '<option value="\xA0" id="">\xA0</option>' : "") + Array.prototype.slice.call(cell.children).map(function(child) {
			var f = XsltForms_select.initChild[child.localName.toLowerCase()];
			return f ? f(child) : "";
		}).join("");
		select.innerHTML = options;
		Array.prototype.slice.call(select.querySelectorAll("*")).forEach(function(elt){
			if (elt.hasAttribute("xf-index")) {
				var ls = XsltForms_collection[elt.getAttribute("xf-index")].listeners;
				if (ls) {
					ls.forEach(function(l) {
						l.clone(elt);
					});
				}
				elt.removeAttribute("xf-index");
			}
			/*
			if (elt.hasAttribute ("value")) {
				elt.setAttribute("value", elt.getAttribute("value").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&apos/g, "'"));
			}
			*/
		});
		select.value = v;
		var datalist;
		if (!this.open) {
			this.select = select;
			this.datalist = this.select;
		} else {
			this.select = select;
			this.datalist = datalist;
		}
		this.initFocus(this.select);
		if (this.incremental) {
			XsltForms_browser.events.attach(this.select, "change", XsltForms_select.incrementalChange);
			XsltForms_browser.events.attach(this.select, "keyup", XsltForms_select.incrementalChangeKeyup);
		} else {
			XsltForms_browser.events.attach(this.select, "change", XsltForms_select.normalChange);
		}
	}
	this.bodyOK = true;
};

		
/**
 * * '''setValue''' method : searches for the given value and checks it if found or dispatches the "xforms-in-range" event
 */

XsltForms_select.prototype.setValue = function(value) {
	var optvalue, empty;
	if (!this.bodyOK) {
		this.initBody();
	}
	if (this.select && this.datalist.options.length === 1 && this.datalist.options[0] && this.datalist.options[0].value === "\xA0") {
		this.currentValue = null;
	}
	if (!this.full && (!value || value === "")) {
		this.selectedOptions = [];
		if (this.datalist.options[0] && this.datalist.options[0].value !== "\xA0") {
			empty = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "option") : document.createElement("option");
			empty.value = "\xA0";
			empty.text = "\xA0";
			empty.id = "";
			if (this.datalist.children[0]) {
				this.datalist.insertBefore(empty, this.datalist.children[0]);
			} else {
				this.datalist.appendChild(empty);
			}
			this.datalist.selectedIndex = 0;
		}
	} else {
		if (!this.full && this.min === 0 && this.datalist.options[0] && this.datalist.options[0].value !== "\xA0") {
			empty = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "option") : document.createElement("option");
			empty.value = "\xA0";
			empty.text = "\xA0";
			empty.id = "";
			if (this.datalist.children[0]) {
				this.datalist.insertBefore(empty, this.datalist.children[0]);
			} else {
				this.datalist.appendChild(empty);
			}
		}
		if (!this.full && this.datalist.firstChild && this.datalist.firstChild.value === "\xA0" && !(this.min === 0 && this.max === 1)) {
			//this.select.removeChild(this.select.firstChild);
			this.datalist.remove(0);
		}
		var vals = value ? value instanceof Array ? value : (this.max !== 1? value.split(XsltForms_globals.valuesSeparator) : [value]) : [""];
		var list = this.full ? (XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input") : this.element.getElementsByTagName("input")) : this.datalist.options;
		var well = true;
		var schtyp = XsltForms_schema.getType(this.element.node ? XsltForms_browser.getType(this.element.node) || "xsd_:string" : "xsd_:string");
		for (var i = 0, len = vals.length; well && i < len; i++) {
			var val = vals[i];
			var found = false;
			for (var j = 0, len1 = list.length; !found && j < len1; j++) {
				optvalue = list[j].value;
				if (schtyp.format) {
					try { optvalue = schtyp.format(optvalue); } catch(e) { }
				}
				if (optvalue === val) {
					found = true;
				}
			}
			well = found;
		}
		if (well || (this.max !== 1 && !value)) {
			if (this.outRange) {
				this.outRange = false;
				XsltForms_xmlevents.dispatch(this, "xforms-in-range");
			}
		} else if ((this.max === 1 || value) && !this.outRange) {
			this.outRange = true;
			XsltForms_xmlevents.dispatch(this, "xforms-out-of-range");
		}
		vals = this.max !== 1? vals : [vals[0]];
		var item;
		if (this.full) {
			for (var n = 0, len2 = list.length; n < len2; n++) {
				item = list[n];
				item.checked = item.value !== "" ? XsltForms_browser.inArray(item.value, vals) : false;
			}
		} else {
			this.selectedOptions = [];
			for (var k = 0, len3 = list.length; k < len3; k++) {
				item = list[k];
				optvalue = item.value;
				if (schtyp.format) {
					try { optvalue = schtyp.format(optvalue); } catch(e) { }
				}
				var b = XsltForms_browser.inArray(optvalue, vals);
				if (b) {
					this.selectedOptions.push(item);
				}
				try {
					item.selected = b;
				} catch(e) {
				}
			}
		}
	}
};


		
/**
 * * '''changeReadonly''' method : changes the read only state of this select/select1 control
 */

XsltForms_select.prototype.changeReadonly = function() {
	if (this.full) {
		var list = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input") : this.element.getElementsByTagName("input");
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].disabled = this.readonly;
		}
	} else {
		if (!XsltForms_browser.dialog.knownSelect(this.select) && this.select) {
			this.select.disabled = this.readonly;
		}
	}
};


		
/**
 * * '''itemClick''' method : dispatches "xforms-select" and "xforms-deselect" events
 */

XsltForms_select.prototype.itemClick = function(value) {
	var inputs = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input") : this.element.getElementsByTagName("input");
	var input;
	XsltForms_globals.openAction("XsltForms_select.prototype.itemClick");
	var newValue = "";
	if (this.max !== 1) {
		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			if (input.hasAttribute("xf-copy") && newValue === "") {
				newValue = [];
			}
			if (input.value === value) {
				XsltForms_xmlevents.dispatch(input.parentNode, input.checked? "xforms-select" : "xforms-deselect");
			}
			if (input.checked) {
				if (input.hasAttribute("xf-copy")) {
					newValue.push(input.value);
				} else {
					newValue = (newValue !== "" ? newValue + XsltForms_globals.valuesSeparator : "") + input.value;
				}
			}
		}
	} else {
		var old = this.value;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(this.element.node) || "xsd_:string");
		if (!old) {
			old = XsltForms_browser.getValue(this.element.node);
			if (schtyp.format) {
				try { old = schtyp.format(old); } catch(e) { }
			}
		}
		var inputSelected = null;
		if (old === value && this.min !== 0) {
			XsltForms_globals.closeAction("XsltForms_select.prototype.itemClick");
			return;
		}
		for (var j = 0, len1 = inputs.length; j < len1; j++) {
			input = inputs[j];
			var input_controlvalue = input.value;
			if (schtyp.format) {
				try { input_controlvalue = schtyp.format(input_controlvalue); } catch(e) { }
			}
			input.checked = input_controlvalue === value;
			if (input_controlvalue === old) {
				if (input.checked && this.min === 0) {
					input.checked = false;
					newValue = input.hasAttribute("xf-copy") ? [] : "";
				}
				XsltForms_xmlevents.dispatch(input.parentNode, "xforms-deselect");
			} else if (input_controlvalue === value) {
				inputSelected = input;
				newValue = input.hasAttribute("xf-copy") ? [value] : value;
			}
		}
		if (inputSelected) {
			XsltForms_xmlevents.dispatch(inputSelected.parentNode, "xforms-select");
		}
	}
	value = newValue;
	if (this.incremental) {
		this.valueChanged(this.value = value || "");
	} else {
		this.value = value || "";
	}
	XsltForms_globals.closeAction("XsltForms_select.prototype.itemClick");
};


		
/**
 * * '''blur''' method : blur event management
 * @callback
 */

XsltForms_select.prototype.blur = function(evt) {
	if (this.value) {
		XsltForms_globals.openAction("XsltForms_select.prototype.blur");
		this.valueChanged(this.value);
		XsltForms_globals.closeAction("XsltForms_select.prototype.blur");
		this.value = null;
	}
};


		
/**
 * * '''normalChange''' function : handler for normal mode on change dispatching "xforms-select" and "xforms-deselect" events
 * @callback
 */

XsltForms_select.normalChange = function(evt) {
	var xf = XsltForms_control.getXFElement(this);
	var news = [];
	var value = "";
	var copy = [];
	var old = xf.getSelected();
	var opts = this.options;
	XsltForms_globals.openAction("XsltForms_select.normalChange");
	for (var i = 0, len = old.length; i < len; i++) {
		if (old[i].selected) {
			news.push(old[i]);
		} else {
			XsltForms_xmlevents.dispatch(old[i], "xforms-deselect");
		}
	}
	var opt;
	for (var j = 0, len1 = opts.length; j < len1; j++) {
		opt = opts[j];
		if (opt.selected) {
			if (opt.hasAttribute("xf-copy")) {
				copy.push(opt.value);
			} else if (opt.value !== "\xA0") {
				value = value? value + XsltForms_globals.valuesSeparator + opt.value : opt.value;
			}
		}
	}
	for (var k = 0, len2 = opts.length; k < len2; k++) {
		opt = opts[k];
		if (opt.selected && opt.value !== "\xA0") {
			if (!XsltForms_browser.inArray(opt, news)) {
				news.push(opt);
				XsltForms_xmlevents.dispatch(opt, "xforms-select");
			}
		}
	}
	if (copy.length === 0) {
		xf.value = value;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(xf.element.node) || "xsd_:string");
		if (schtyp.format) {
			try { xf.value = schtyp.format(value); } catch(e) { }
		}
	} else {
		xf.value = copy;
	}
	xf.selectedOptions = news;
	XsltForms_globals.closeAction("XsltForms_select.normalChange");
};


		
/**
 * * '''incrementalChange''' function : handler for incremental mode on change calling normal mode handler
 */

XsltForms_select.incrementalChange = function(evt) {
	var xf = XsltForms_control.getXFElement(this);
	XsltForms_globals.openAction("XsltForms_select.incrementalChange");
	XsltForms_select.normalChange.call(this, evt);
	xf.valueChanged(xf.value);
	XsltForms_globals.closeAction("XsltForms_select.incrementalChange");
};


		
/**
 * * '''incrementalChangeKeyup''' function : handler for incremental mode from keyboard on change calling normal mode handler
 */

XsltForms_select.incrementalChangeKeyup = function(evt) {
	if (evt.keyCode !== 9 && evt.keyCode !== 17) {
		var xf = XsltForms_control.getXFElement(this);
		XsltForms_globals.openAction("XsltForms_select.incrementalChangeKeyup");
		XsltForms_select.normalChange.call(this, evt);
		xf.valueChanged(xf.value);
		XsltForms_globals.closeAction("XsltForms_select.incrementalChangeKeyup");
	}
};


		
/**
 * * '''getSelected''' method : collects selected options for this select/select1 control
 */

XsltForms_select.prototype.getSelected = function() {
	var s = this.selectedOptions;
	if (!s || s.length === 0) {
		s = [];
		var opts = this.select.options;
		for (var i = 0, len = opts.length; i < len; i++) {
			if (opts[i].selected) {
				s.push(opts[i]);
			}
		}
	}
	return s;
};