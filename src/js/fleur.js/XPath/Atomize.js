/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur._schemaTypeInfoLookup = function(n) {
	var i, l, s;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			return n.schemaTypeInfo;
		//$FALLTHROUGH$
		case Fleur.Node.ATTRIBUTE_NODE:
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.MAP_NODE:
		case Fleur.Node.ENTRY_NODE:
			for (i = 0, l < n.childNodes.length; i < l; i++) {
				s = Fleur._schemaTypeInfoLookup(n.childNodes[i]);
				if (s !== Fleur.Type_untypedAtomic) {
					return s;
				}
			}
			return Fleur.Type_untypedAtomic;
	}
};

Fleur._Atomize = function(a, n) {
	var i, l, n2, seq;
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
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.ATTRIBUTE_NODE:
			a = new Fleur.Text();
			a.data = n.value.slice(0);
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.SEQUENCE_NODE:
		case Fleur.Node.ARRAY_NODE:
			if (n.childNodes.length === 0) {
				return null;
			}
			for (i = 0, l = n.childNodes.length; i < l; i++) {
				n2 = Fleur._Atomize(a, n.childNodes[i]);
				if (n2) {
					if (!a) {
						a = n2;
					} else {
						if (a.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							seq = new Fleur.Sequence();
							seq.appendChild(a);
							a = seq;
						}
						if (n2.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							a.appendChild(n2);
						} else {
							n2.childNodes.forEach(function(n3) {
								a.appendChild(n3);
							});
						}
					}
				}
			}
			return a;
	}
};
Fleur.Atomize = function(n) {
	return n === Fleur.EmptySequence ? Fleur.EmptySequence : Fleur._Atomize(null, n);
};