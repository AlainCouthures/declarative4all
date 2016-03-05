/*eslint-env browser*/
/*globals XsltForms_browser XsltForms_listener*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module XMLEvents
 * @description  === "XsltForms_xmlevents" class ===
 * XML Event Management Class
 */
		
var XsltForms_xmlevents = {

		
/**
 * * '''REGISTRY''' associative array : stores properties for each predefined event
 * ** bubbles : boolean
 * ** cancelable : boolean
 * ** defaultAction : handler function with empty function as default
 */

    REGISTRY : [],

		
/**
 * * '''EventContexts''' array: A stack of event-contexts, maintained right-before and right-after issuing an event 
 * 
 */

	EventContexts : [],

		
/**
 * * '''define''' function : convenient function to add a new event in the event registry
 */

	define : function(evtname, bubbles, cancelable, defaultAction) {
		XsltForms_xmlevents.REGISTRY[evtname] = {
			bubbles:       bubbles,
			cancelable:    cancelable,
			defaultAction: defaultAction? defaultAction : function() { }
		};
	},

		
/**
 * * '''makeEventContext''' function : convenient function to add predfined properties for all event-contexts
 */

	makeEventContext : function(evcontext, type, targetid, bubbles, cancelable) {
		if (!evcontext) {
			evcontext = {};
		}
		if (!evcontext.type) {
			evcontext.type = type;
		}
		try {
			evcontext.targetid = targetid;
			evcontext.bubbles = bubbles;
			evcontext.cancelable = cancelable;
		} catch (e) {
		}
		return evcontext;
	}
};

		
/**
 * * '''dispatch''' function : dispatches the given event at a given target with possibly different properties
 * @callback
 */

XsltForms_xmlevents.dispatch = function(target, evtname, type, bubbles, cancelable, defaultAction, evcontext) {
	if (!target) {
		XsltForms_browser.debugConsole.write("ERROR: Cannot dispatch event " + name + " as the target is null");
		return;
	}
	target = target.element || target;
	XsltForms_browser.assert(target && typeof(target.nodeName) !== "undefined");
	XsltForms_browser.debugConsole.write("Dispatching event " + evtname + " on <" + target.nodeName.toLowerCase() +
		(target.className? " class=\"" + (typeof target.className === "string" ? target.className : target.className.baseVal) + "\"" : "") +
		(target.id? " id=\"" + target.id + "\"" : "") + "/>");
	var reg = XsltForms_xmlevents.REGISTRY[evtname];
	if (reg) {
		bubbles = reg.bubbles;
		cancelable = reg.cancelable;
		defaultAction = reg.defaultAction;
	}
	if (!defaultAction) {
		defaultAction = function() { };
	}
	evcontext = XsltForms_xmlevents.makeEventContext(evcontext, evtname, target.id, bubbles, cancelable);
	XsltForms_xmlevents.EventContexts.push(evcontext);
	try {
		var evt, res;
		if (target.dispatchEvent) {
			evt = document.createEvent("Event");
			evt.initEvent(evtname, bubbles, cancelable);
			res = target.dispatchEvent(evt);
			if ((res && !evt.stopped) || !cancelable) {
				defaultAction.call(target, evt);
			}
		} else {
			var canceler = null;
			// Capture phase.
			var ancestors = [];
			for (var a = target.parentNode; a; a = a.parentNode) {
				ancestors.unshift(a);
			}
			for (var i = 0, len = ancestors.length; i < len; i++) {
				evt = document.createEventObject();
				evt.trueName = evtname;
				evt.phase = "capture";
				ancestors[i].fireEvent("onerrorupdate", evt);
				if (evt.stopped) {
					return;
				}
			}
			evt = document.createEventObject();
			evt.trueName = evtname;
			evt.phase = "capture";
			evt.target = target;
			target.fireEvent("onerrorupdate" , evt);
			// Bubble phase.
			if (!bubbles) {
				canceler = new XsltForms_listener(null, target, null, evtname, "default", function(evt) { evt.cancelBubble = true; });
			}
			evt = document.createEventObject();
			evt.trueName = evtname;
			evt.phase = "default";
			evt.target = target;
			res = target.fireEvent("onerrorupdate", evt);
			try {
				if ((res && !evt.stopped) || !cancelable) {
					defaultAction.call(target, evt);
				}
				if (!bubbles) {
					canceler.detach();
				}
			} catch (e2) {
			}
		}
	} catch (e) {
		alert("XSLTForms Exception\n--------------------------\n\nError dispatching event '"+evtname+"' :\n\n"+(typeof(e.stack)==="undefined"?"":e.stack)+"\n\n"+(e.name?e.name+(e.message?"\n\n"+e.message:""):e));
	} finally {
		if (XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1].rheadsdoc) {
			XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1].rheadsdoc = null;
		}
		if (XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1]["response-body"]) {
			XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1]["response-body"] = null;
		}
		XsltForms_xmlevents.EventContexts.pop();
	}
};


		
/**
 * * default event management :
 * ** '''xforms-model-construct''' : fired at the end of the xforms.init() function before '''xforms-ready''' been fired
 * *** bubbles : yes
 * *** cancelable : no
 * *** default handler : construct() method
 */

XsltForms_xmlevents.define("xforms-model-construct", true, false, function() { this.construct(); });

		
/**
 * ** '''xforms-model-construct-done''' : fired at the end of the XFModel.construct() method after '''xforms-rebuild''' beeing fired
 * *** bubbles : yes
 * *** cancelable : no
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-model-construct-done", true, false);

		
/**
 * ** '''xforms-ready'''' : fired at the end of the xforms.init() function after '''xforms-model-construct''' been fired
 * *** bubbles : yes
 * *** cancelable : no
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-ready", true, false);

		
/**
 * ** '''xforms-model-destruct''' : fired in the xforms.close() function to every models
 * *** bubbles : yes
 * *** cancelable : no
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-model-destruct", true, false);

		
/**
 * ** '''xforms-rebuild''' : fired in the xforms.closeChanges() function when a rebuild is required,
 * in the XFModel.construct() method before '''xforms-model-construct-done''' being fired and
 * in the XFSubmission.submit() method when the corresponding instance has just been replaced
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : rebuild() method
 */

XsltForms_xmlevents.define("xforms-rebuild", true, true, function() { this.rebuild(); });

		
/**
 * ** '''xforms-recalculate''' : fired in the xforms.closeChanges() function when a rebuild is not required,
 * at the end of the XFModel.rebuild() method and
 * in the XFControl.valueChanged() method when the new value is different
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : recalculate() method
 */

XsltForms_xmlevents.define("xforms-recalculate", true, true, function() { this.recalculate(); });

		
/**
 * ** '''xforms-revalidate''' : fired at the end of the XFModel.recalculate() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : revalidate() method
 */

XsltForms_xmlevents.define("xforms-revalidate", true, true, function() { this.revalidate(); });

		
/**
 * ** '''xforms-reset''' : fired by a listener generated by the XSL transformation for the xforms:reset element
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : reset() method
 */

XsltForms_xmlevents.define("xforms-reset", true, true, function() { this.reset(); });

		
/**
 * ** '''xforms-submit''' : fired by a listener generated by the XSL transformation for the xforms:submit element
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : submit() method
 */

XsltForms_xmlevents.define("xforms-submit", true, true, function() { this.submit(); });

		
/**
 * ** '''xforms-submit-serialize''' : fired by the XFSubmission.submit() method
 * *** bubbles : yes
 * *** cancelable : no
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-submit-serialize", true, false);

		
/**
 * ** '''xforms-refresh''' : fired at the end of the XFModel.revalidate() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : refresh() method
 */

XsltForms_xmlevents.define("xforms-refresh", true, true, function() { this.refresh(); });

		
/**
 * ** '''xforms-focus''' : fired by a listener generated by the XSL transformation for the xforms:setfocus action
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : focus() method
 */

XsltForms_xmlevents.define("xforms-focus", true, true, function() { this.focus ? this.focus() : this.element.focus(); } );


		
/**
 * ** '''DOMActivate''' : fired by the XFTrigger.click() method and by a listener generated by the XSL transformation for the xforms:submit element
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("DOMActivate", true,  true);

		
/**
 * ** '''DOMFocusIn''' : fired by the XFControl.focus() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("DOMFocusIn", true, false);

		
/**
 * ** '''DOMFocusOut''' : fired by the xforms.blur() function to the element already having focus
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("DOMFocusOut", true, false);

		
/**
 * ** '''xforms-select''' : fired by the XFToggle.toggle(), XFSelect.normalChange() functions and XFSelect.itemClick() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-select", true, false);

		
/**
 * ** '''xforms-deselect''' : fired by the XFToggle.toggle(), XFSelect.normalChange() functions and XFSelect.itemClick() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-deselect", true, false);

		
/**
 * ** '''xforms-value-changed''' : fired by the XFControl.refresh() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-value-changed", true, false);


		
/**
 * ** '''xforms-insert''' : fired by the XFInsert.run() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-insert", true, false);

		
/**
 * ** '''xforms-delete''' : fired by the XFDelete.run() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-delete", true, false);

		
/**
 * ** '''xforms-valid''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-valid", true, false);

		
/**
 * ** '''xforms-invalid''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-invalid", true, false);

		
/**
 * ** '''xforms-enabled''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-enabled", true, false);

		
/**
 * ** '''xforms-disabled''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-disabled", true, false);

		
/**
 * ** '''xforms-optional''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-optional", true, false);

		
/**
 * ** '''xforms-required''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-required", true, false);

		
/**
 * ** '''xforms-readonly''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-readonly", true, false);

		
/**
 * ** '''xforms-readwrite''' : fired by XFControl.refresh() method via the XFControl.changeProp() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-readwrite", true, false);

		
/**
 * ** '''xforms-in-range''' : fired by the XFSelect.setValue() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-in-range", true, false);

		
/**
 * ** '''xforms-out-of-range''' : fired by the XFSelect.setValue() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-out-of-range", true, false);

		
/**
 * ** '''xforms-submit-done''' : fired by the XFSubmission.submit() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-submit-done", true, false);

		
/**
 * ** '''xforms-submit-error''' : fired by the XFSubmission.submit() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-submit-error", true, false);

		
/**
 * ** '''xforms-compute-exception''' : unused
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-compute-exception", true, false);

		
/**
 * ** '''xforms-binding-exception''' : fired by the XFBind.refresh() method
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-binding-exception", true, false);

XsltForms_xmlevents.define("ajx-start", true, true, function(evt) { evt.target.xfElement.start(); });
XsltForms_xmlevents.define("ajx-stop", true, true, function(evt) { evt.target.xfElement.stop(); });
XsltForms_xmlevents.define("ajx-time", true, true);

		
/**
 * ** '''xforms-dialog-open''' : fired by a listener generated by the XSL transformation for the xforms:show action
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : show() method of the corresponding dialog
 */

XsltForms_xmlevents.define("xforms-dialog-open", true, true, function(evt) { XsltForms_browser.dialog.show(evt.target, null, true); });

		
/**
 * ** '''xforms-dialog-close''' : fired by a listener generated by the XSL transformation for the xforms:hide action
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : hide() method of the corresponding dialog
 */

XsltForms_xmlevents.define("xforms-dialog-close", true, true, function(evt) { XsltForms_browser.dialog.hide(evt.target, true); });

		
/**
 * ** '''xforms-load-done''' : fired by the XFSubmission.submit() method
 * *** bubbles : yes
 * *** cancelable : false
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-load-done", true, false);

		
/**
 * ** '''xforms-load-error''' : fired by the XFSubmission.submit() method
 * *** bubbles : yes
 * *** cancelable : false
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-load-error", true, false);

		
/**
 * ** '''xforms-unload-done''' : fired by the unload method
 * *** bubbles : yes
 * *** cancelable : false
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-unload-done", true, false);

		
/**
 * ** '''xforms-upload-done''' : fired by the Upload control
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-upload-done", true, false);

		
/**
 * ** '''xforms-upload-error''' : fired by the Upload control
 * *** bubbles : yes
 * *** cancelable : yes
 * *** default handler : empty
 */

XsltForms_xmlevents.define("xforms-upload-error", true, false);