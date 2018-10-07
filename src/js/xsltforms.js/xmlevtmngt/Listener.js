/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module Listener
 * @description  === "XsltForms_listener" class ===
 * Listener  Class
 * * constructor function : creates a Listener object to an observer element and attaches a standard callback function
 */
		
function XsltForms_listener(subform, observer, evtTarget, evtname, phase, handler, defaultaction) {
	if (!observer) {
		return;
	}
	phase = phase || "default";
	if (phase !== "default" && phase !== "capture") {
		XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", 
			"Unknown event-phase(" + phase +") for event(" + evtname + ")"+(observer ? " on element(" + observer.id + ")":"") + "!");
		return;
	}
	this.subform = subform;
	this.observer = observer;
	this.evtTarget = evtTarget;
	this.name = evtname;
	this.evtName = document.addEventListener? evtname : "errorupdate";
	this.phase = phase;
	this.handler = handler;
	this.defaultaction = defaultaction;
	if (observer.listeners) {
		if (evtname === "xforms-subform-ready") {
			for (var i = 0, l = observer.listeners.length; i < l; i++) {
				if (observer.listeners[i].name === evtname) {
					return;
				}
			}
		}
	} else {
		observer.listeners = [];
	}
	observer.listeners.push(this);
	this.callback = function(evt) {
		if (!document.getElementById(evt.target.id) || !document.getElementById(this.id)) {
			return;
		}
		if (!document.addEventListener) {
			evt = evt || window.event;
			evt.target = evt.srcElement;
			evt.currentTarget = observer;
			XsltForms_browser.debugConsole.write("observer:"+observer.id);
			XsltForms_browser.debugConsole.write("name:"+evtname);
			XsltForms_browser.debugConsole.write("target:"+evt.target.id);
			XsltForms_browser.debugConsole.write("trueName:"+evt.trueName);
			if (evt.trueName && evt.trueName !== evtname) {
				return;
			}
			if (!evt.phase) {
				if (phase === "capture") {
					return;
				}
			} else if (evt.phase !== phase) {
				return;
			}
			if (phase === "capture") {
				evt.cancelBubble = true;
			}
			evt.preventDefault = function() {
				this.returnValue = false;
			};
			evt.stopPropagation = function() {
				this.cancelBubble = true;
				this.stopped      = true;
			};
		}
		var effectiveTarget = true;
		if (evt.target && evt.target.nodeType === 3) {
			evt.target = evt.target.parentNode;
		}
//console.log((evt instanceof UIEvent ? "UIEvent" : "Event") + " " + evt.target.nodeName + " " + evt.type + " " + evt.eventPhase + " " + (evt.currentTarget && evt.type === "DOMActivate" && (evt.target.nodeName.toUpperCase() === "BUTTON" || evt.target.nodeName.toUpperCase() === "A" || (XsltForms_browser.isChrome && evt.eventPhase === 3 && this.xfElement.controlName === "trigger"))  && !XsltForms_browser.isFF2));
		if (evt.currentTarget && (evt.target.nodeName.toUpperCase() === "BUTTON" || evt.target.nodeName.toUpperCase() === "A" || evt.target.nodeName.toUpperCase() === "INPUT" || (XsltForms_browser.isChrome && (evt.eventPhase === 3 || evt instanceof UIEvent)  && this.xfElement  && this.xfElement.controlName === "trigger"))  && !XsltForms_browser.isFF2) {
			effectiveTarget = false;
		}
//console.log(effectiveTarget);
//		if (evt.eventPhase === 3 && !evt.target.xfElement && !XsltForms_browser.isFF2) {
//			effectiveTarget = false;
//		}
		if (evt.eventPhase === 3 && evt.target.xfElement && evt.target === evt.currentTarget && !XsltForms_browser.isFF2) {
			effectiveTarget = false;
		}
		if (evtTarget && evt.target !== evtTarget) {
			effectiveTarget = false;
		}
		XsltForms_browser.debugConsole.write("effectiveTarget:"+effectiveTarget);
		if (effectiveTarget) { // && !(typeof UIEvent !== 'undefined' && evt instanceof UIEvent)) {
			XsltForms_browser.debugConsole.write("Captured event " + evtname + " on <" + evt.target.nodeName +
				(evt.target.className? " class=\"" + (typeof evt.target.className === "string" ? evt.target.className : evt.target.className.baseVal) + "\"" : "") +
				(evt.target.id? " id=\"" + evt.target.id + "\"" : "") + "/>");
			handler.call(evt.target, evt);
		}
		if (!defaultaction) {
			evt.preventDefault();
		}
		if (!document.addEventListener) {
			try {
				evt.preventDefault = null;
				evt.stopPropagation = null;
			} catch (e) {}
		}
	};
	this.attach();
	if (subform) {
		subform.listeners.push(this);
	}
}


		
/**
 * * '''attach''' method : attaches the event according to the current phase
 */

XsltForms_listener.destructs = [];

XsltForms_listener.prototype.attach = function() {
	XsltForms_browser.events.attach(this.observer, this.evtName, this.callback, this.phase === "capture");
	if (this.evtName === "xforms-model-destruct") {
		XsltForms_listener.destructs.push({observer: this.observer, callback: this.callback});
	}
};


		
/**
 * * '''detach''' method : detaches the event according to the current phase
 */

XsltForms_listener.prototype.detach = function() {
	if( this.observer.listeners ) {
		for (var i = 0, l = this.observer.listeners.length; i < l; i++) {
			if (this.observer.listeners[i] === this) {
				this.observer.listeners.splice(i, 1);
				break;
			}
		}
	}
	XsltForms_browser.events.detach(this.observer, this.evtName, this.callback, this.phase === "capture");
};


		
/**
 * * '''clone''' method : creates a new listener for the given element
 */

XsltForms_listener.prototype.clone = function(element) {
	return new XsltForms_listener(this.subform, element, this.evtTarget, this.name, this.phase, this.handler);
};