/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser XsltForms_engine*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module script
 * @description  === "XsltForms_script" class ===
 * Script Action Class
 * * constructor function : stores specific properties
 */
		
function XsltForms_script(subform, binding, stype, script, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.stype = stype;
	this.script = script;
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_script.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : opens a new window or changes current location according to "show" attribute
 */

XsltForms_script.prototype.run = function(element, ctx) {
	var script = this.script;
	switch (this.stype) {
		case "text/javascript":
			if (this.binding) {
				var node = this.binding.bind_evaluate(this.subform, ctx)[0];
				if (node) {
					script = XsltForms_browser.getValue(node);
				}
			} else {
				if (typeof script === 'object') {
					script = XsltForms_engine.stringValue(this.script.xpath.xpath_evaluate(ctx));
				} else {
					if (typeof script === 'string') {
						script = XsltForms_browser.unescape(script); 
					}
				}
			}
			if (script) {
				try {
					eval("{XsltForms_context={elementId:\""+element.getAttribute("id")+"\"};"+script+"}");
				} catch (e) {
					alert("XSLTForms Exception\n--------------------------\n\nError evaluating the following Javascript expression :\n\n"+script+"\n\n"+e);
				}
			}
			break;
		case "application/xquery":
			this.script.xpath.xpath_evaluate(ctx);
			break;
	}
};