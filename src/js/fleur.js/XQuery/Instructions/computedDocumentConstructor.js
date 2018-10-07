/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.computedDocumentConstructor] = function(ctx, children, callback) {
	var doc = new Fleur.Document();
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			n.childNodes.forEach(function(c) {
				doc.appendChild(c);
			});
		} else {
			doc.appendChild(n);
		}
		Fleur.callback(function() {callback(doc);});
	});
};