/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur._Atomize = function(a, n) {
	var i, l;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			return n;
		case Fleur.Node.DOCUMENT_NODE:
			n = n.documentElement;
		//$FALLTHROUGH$
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.MAP_NODE:
		case Fleur.Node.ENTRY_NODE:
			a = new Fleur.Text();
			a.data = n.textContent;
			return a;
		case Fleur.Node.ATTRIBUTE_NODE:
			a = new Fleur.Text();
			a.data = n.data.slice(0);
			return a;
		case Fleur.Node.SEQUENCE_NODE:
		case Fleur.Node.ARRAY_NODE:
			if (!a) {
				a = new Fleur.Sequence();
			}
			for (i = 0, l < n.children.length; i < l; i++) {
				a.appendChild(Fleur._Atomize(a, n.children[i]));
			}
			return a;
	}
};
Fleur.Atomize = function(ctx) {
	ctx._result = Fleur._Atomize(null, ctx._result);
};