/*eslint-env browser*/
/*globals XsltForms_coreElement XsltForms_engine XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module timer
 * @description
 */
function XsltForms_timer(subform, id, time) {
	if (document.getElementById(id)) {
		return;
	}
	this.init(subform, id, null, "xforms-timer");
	this.running = false;
	this.time = time;
}

XsltForms_timer.prototype = new XsltForms_coreElement();

XsltForms_timer.prototype.start = function() {
	this.running = true;
	var timer = this;
	setTimeout(function() { timer.run(); }, this.time);
};

XsltForms_timer.prototype.stop = function() {
	this.running = false;
};

XsltForms_timer.prototype.run = function() {
	if (this.running) {
		var timer = this;
		XsltForms_engine.openAction();
		XsltForms_xmlevents.dispatch(timer.element, "ajx-time");
		XsltForms_engine.closeAction();
		setTimeout(function() { timer.run(); }, this.time);
	}
};