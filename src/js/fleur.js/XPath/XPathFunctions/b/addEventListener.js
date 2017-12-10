/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["addEventListener#3"] = new Fleur.Function("http://xqib.org", "b:addEventListener",
	function(htmlelt, eventname, handler, ctx) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.addEventListener(eventname, function(evt) {
			var newctx = {
				_curr: null,
				env: {}
			};
			newctx.env.varresolver = new Fleur.varMgr([], ctx.env.varresolver);
			newctx.env.nsresolver = ctx.env.nsresolver;
			newctx.env.varresolver.set(ctx, "", handler.argtypes[0].name, evt.target);
			var evtelt = new Fleur.Element();
			evtelt.nodeName = "event";
			evtelt.namespaceURI = null;
			evtelt.localName = "event";
			evtelt.prefix = null;
			evtelt.childNodes = new Fleur.NodeList();
			evtelt.children = new Fleur.NodeList();
			evtelt.textContent = "";
			["screenX", "screenY", "clientX", "clientY", "button"].forEach(function(p) {
				var prop;
				if (evt[p] !== null && evt[p] !== undefined) {
					prop = new Fleur.Element();
					prop.nodeName = p;
					prop.namespaceURI = null;
					prop.localName = p;
					prop.prefix = null;
					prop.childNodes = new Fleur.NodeList();
					prop.children = new Fleur.NodeList();
					prop.textContent = String(evt[p]);
					evtelt.appendChild(prop);
				}
			});
			newctx.env.varresolver.set(ctx, "", handler.argtypes[1].name, evtelt);
			newctx.evt = evt;
			Fleur.XQueryEngine[handler.xqxfunc[0]](newctx, handler.xqxfunc[1], function() {});
			return false;
		}, false);
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node}], true, false, {type: Fleur.EmptySequence});