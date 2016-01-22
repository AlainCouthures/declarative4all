/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_schema XsltForms_browser XsltForms_globals XsltForms_idManager XsltForms_submission XsltForms_xmlevents Fleur XsltForms_repeat*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module load
 * @description  === "XsltForms_load" class ===
 * Load Action Class
 * * constructor function : stores specific properties
 */
		
function XsltForms_load(subform, binding, resource, show, targetid, instance, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.resource = resource;
	this.show = show;
	this.targetid = targetid || "_self";
	this.instance = instance;
	this.init(ifexpr, whileexpr, iterateexpr);
}

XsltForms_load.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : opens a new window or changes current location according to "show" attribute
 */

XsltForms_load.prototype.run = function(element, ctx) {
	var href = this.resource;
	var node;
	if (this.binding) {
		var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
		node = this.binding.bind_evaluate(this.subform, ctx, varresolver)[0];
		if (node) {
			var t = XsltForms_schema.getType(XsltForms_browser.getType(node));
			if (!t.hasBase("xf:HTMLFragment")) {
				href = XsltForms_browser.getValue(node);
			}
		}
	} else {
		if (href && typeof href === 'object') {
			href = XsltForms_globals.stringValue(this.resource.xpath.xpath_evaluate(ctx));
		} else {
			if (typeof href === 'string') {
				href = XsltForms_browser.unescape(href); 
			}
		}
	}
	if (href) {
		if(href.substr(0, 11) === "javascript:") {
			try {
				eval("{XsltForms_context={elementId:\""+element.getAttribute("id")+"\"};"+href.substr(11)+"}");
			} catch (e) {
				alert("XSLTForms Exception\n--------------------------\n\nError evaluating the following Javascript expression :\n\n"+href.substr(11)+"\n\n"+e);
			}
		} else if (this.show === "new" || this.targetid === "_blank") {
			window.open(href);
		} else if (this.show === "embed" || (this.targetid !== "" && this.targetid !== "_blank" && this.targetid !== "_self")) {
			XsltForms_globals.openAction("XsltForms_load.prototype.run");
			var req = null;
			var method = "get";
			var evcontext = {"method": method, "resource-uri": href};
			var subformidx = XsltForms_globals.nbsubforms++;
			try {
				req = XsltForms_browser.openRequest(method, href, false);
				XsltForms_browser.debugConsole.write("Load " + href);
				req.send(null);
				if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
					evcontext["error-type"] = "resource-error";
					this.issueLoadException_(evcontext, req, null);
					XsltForms_globals.closeAction("XsltForms_load.prototype.run");
					return;
				}
				XsltForms_submission.requesteventlog(evcontext, req);
				XsltForms_globals.closeAction("XsltForms_load.prototype.run");
				var resp = req.responseText;
				var piindex = resp.indexOf("<?xml-stylesheet", 0);
				while ( piindex !== -1) {
					var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
					resp = XsltForms_browser.transformText(resp, xslhref, false);
					piindex = resp.indexOf("<?xml-stylesheet", 0);
				}
				XsltForms_browser.dialog.hide("statusPanel", false);
				var sp = XsltForms_globals.stringSplit(resp, "XsltForms_MagicSeparator");
				var subbody, subjs;
				var targetelt = XsltForms_idManager.find(this.targetid);
				if (sp.length === 1) {
					subbody = resp;
				} else {
					subjs = "/\* xsltforms-subform-" + subformidx + " " + sp[2] + " xsltforms-subform-" + subformidx + " *\/";
					var imain = subjs.indexOf('"xsltforms-mainform"');
					var targetsubform = targetelt.xfSubform;
					if (targetsubform) {
						targetsubform.dispose();
					}
					subjs = '(function(){var xsltforms_subform_eltid = "' + targetelt.id + '";var xsltforms_parentform = XsltForms_subform.subforms["' + this.subform.id + '"];' + subjs.substring(0, imain) + '"xsltforms-subform-' + subformidx + '"' + subjs.substring(imain + 20) + "})();";
					subbody = "<!-- xsltforms-subform-" + subformidx + " " + sp[4] + " xsltforms-subform-" + subformidx + " -->";
					imain = subbody.indexOf(' id="xsltforms-mainform');
					while (imain !== -1) {
						subbody = subbody.substring(0, imain) + ' id="xsltforms-subform-' + subformidx + subbody.substring(imain + 23);
						imain = subbody.indexOf(' id="xsltforms-mainform');
					}
				}
				var targetxf = targetelt.xfElement;
				if (targetelt.xfElement) {
					targetelt = targetelt.children[targetelt.children.length - 1];
				}
				targetelt.innerHTML = subbody;
				targetelt.hasXFElement = null;
				var parentNode = targetelt.parentNode;
				while (parentNode) {
					if (parentNode.hasXFElement !== false) {
						break;
					}
					parentNode.hasXFElement = null;
					parentNode = parentNode.parentNode;
				}
				if (sp.length !== 1) {
					var scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
					scriptelt.setAttribute("id", "xsltforms-subform-" + subformidx + "-script");
					scriptelt.setAttribute("type", "text/javascript");
					if (XsltForms_browser.isIE) {
						scriptelt.text = subjs;
					} else {
						scriptelt.appendChild(document.createTextNode(subjs));
					}
					var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
					body.insertBefore(scriptelt, body.firstChild);
				}
				XsltForms_browser.setClass(targetelt, "xforms-subform-loaded", true);
				if (targetxf) {
					XsltForms_xmlevents.dispatch(targetxf, "xforms-load-done", null, null, null, null, evcontext);
				}
			} catch(e2) {
				XsltForms_browser.debugConsole.write(e2.message || e2);
				evcontext["error-type"] = "resource-error";
				this.issueLoadException_(evcontext, req, e2);
				XsltForms_globals.closeAction("XsltForms_load.prototype.run");
			}
		} else {
			location.href = href;
		}
	} else {
		if (node) {
			try {
				var v = XsltForms_browser.getValue(node).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
				var lw;
				if (this.show === "new" || this.targetid === "_blank") {
					lw = window.open("about:blank","_blank");
					lw.document.write(v);
					lw.document.close();
				} else {
					lw = window.open("about:blank", "_self");
					lw.document.write(v);
					lw.document.close();
				}
			} catch (e) {
				XsltForms_browser.debugConsole.write("ERROR: Load:" + e.message);
			}
		}
	}
};

		
/**
 * * '''issueLoadException_''' method : Prepares the event-context and issues a 'xforms-load-error' event.
 */

XsltForms_load.prototype.issueLoadException_ = function(evcontext, req, ex) {
	if (ex) {
		evcontext.message = ex.message || ex;
		evcontext["stack-trace"] = ex.stack;
	}
	if (req) {
		XsltForms_submission.requesteventlog(evcontext, req);
	}
	XsltForms_xmlevents.dispatch(document.getElementById(this.targetid), "xforms-link-exception", null, null, null, null, evcontext);
};

		
/**
 * * '''subform''' method : loads a subform directly from Javascript instruction
 */

XsltForms_load.subform = function(resource, targetid, ref) {
	if (ref) {
		var parentNode = ref;
		while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (XsltForms_browser.hasClass(parentNode, "xforms-repeat-item")) {
				XsltForms_repeat.selectItem(parentNode);
			}
			parentNode = parentNode.parentNode;
		}
	}
	var targetelt = XsltForms_idManager.find(targetid);
	var subform = null;
	parentNode = targetelt;
	while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
		if (parentNode.xfSubform) {
			subform = parentNode.xfSubform;
			break;
		}
		parentNode = parentNode.parentNode;
	}
	var a = new XsltForms_load(subform, null, resource, "embed", targetid);
	a.run();
};