/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_browser XsltForms_control XDocument*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module output
 * @description  === "XsltForms_output" class ===
 * Output Control  Class
 * * constructor function : initializes specific properties and initializes focus and blur event management
 */
		
function XsltForms_output(subform, id, valoff, binding, mediatype) {
	XsltForms_engine.counters.output++;
	this.init(subform, id);
	this.controlName = "output";
	this.valoff = valoff;
	var children = this.element.children || this.element.childNodes;
	if (children.length !== 0) {
		var cells = children;
		this.valueElement = cells[valoff];
	} else {
		this.valueElement = this.element;
	}
	var valuechildren = this.valueElement.children || this.valueElement.childNodes;
	if (valuechildren.length !== 0) {
		this.valueElement = valuechildren[0];
	}
	this.hasBinding = true;
	this.binding = binding;
	this.mediatype = mediatype;
	this.complex = mediatype === "application/xhtml+xml";
	this.isOutput = true;
	if (this.binding && this.binding.type) {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
}

//XsltForms_output.prototype = new XsltForms_control();


		
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
	this.valueElement = null;
	XsltForms_engine.counters.output--;
	XsltForms_control.prototype.dispose.call(this);
};


		
/**
 * * '''setValue''' method : sets the value of this output control
 */

XsltForms_output.prototype.setValue = function(value) {
	var element = this.valueElement;
	var mediatype = this.mediatype;
	var i, li;
	if (mediatype && mediatype.bind_evaluate) {
		mediatype = XsltForms_engine.stringValue(mediatype.bind_evaluate(this.subform, this.boundnodes[0]));
	}
	if (!mediatype || mediatype.indexOf("image/") !== 0 || mediatype === "image/svg+xml") {
		if (element.nodeName.toLowerCase() === "img") {
			var spanelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
			i = 0;
			li = element.attributes.length;
			while (i < li) {
				spanelt.setAttribute(element.attributes[i].name, element.attributes[i].value);
				i++;
			}
			element.parentNode.replaceChild(spanelt, element);
			element = spanelt;
		}
		if (element.nodeName.toLowerCase() === "span" || element.nodeName.toLowerCase() === "tspan" || element.nodeName.toLowerCase() === "label") {
			if (mediatype === "application/xhtml+xml") {
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
				if (value) {
					element.innerHTML = value;
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
			}
		} else {
			XsltForms_browser.setValue(element, value);
		}
	} else {
		if (element.nodeName.toLowerCase() === "span" || element.nodeName.toLowerCase() === "tspan" || element.nodeName.toLowerCase() === "label") {
			var imgelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
			i = 0;
			li = element.attributes.length;
			while (i < li) {
				imgelt.setAttribute(element.attributes[i].name, element.attributes[i].value);
				i++;
			}
			element.parentNode.replaceChild(imgelt, element);
			element = imgelt;
		}
		element.src = value;
	}
};

		
/**
 * * '''getValue''' method : gets the value of this output control
 */

XsltForms_output.prototype.getValue = function(format) {
	var element = this.valueElement;
	if (element.nodeName.toLowerCase() === "span") {
		return XsltForms_browser.getValue(element, format);
	} else {
		var value = element.src;
		if (value && format && element.type.format) {
			try { 
				value = element.type.format(value);
			} catch(e) { 
			}
		}
		return value;
	}
};