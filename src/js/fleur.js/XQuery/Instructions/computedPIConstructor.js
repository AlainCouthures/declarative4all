/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.computedPIConstructor] = function(ctx, children, callback) {
	var aval, prins = new Fleur.ProcessingInstruction();
	if (children[0][0] === Fleur.XQueryX.piTarget) {
		prins.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			aval = Fleur.Atomize(n);
			if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(aval);});
			} else {
				prins.data = aval.data;
				Fleur.callback(function() {callback(prins);});
			}
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var aname = Fleur.Atomize(n);
			if (aname.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(aname);});
			} else {
				prins.nodeName = aname.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					aval = Fleur.Atomize(n);
					if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
						Fleur.callback(function() {callback(aval);});
					} else {
						prins.data = aval.data;
						Fleur.callback(function() {callback(prins);});
					}
				});
			}
		});
	}
};