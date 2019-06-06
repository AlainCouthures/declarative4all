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

Fleur._Atomize = function(a, n, force) {
	var i, l, n2, seq;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (n.schemaTypeInfo === Fleur.Type_error || n.nodeName !== "#text") {
				return n;
			}
			a = new Fleur.Text();
			a.data = n.data;
			a.schemaTypeInfo = n.schemaTypeInfo;
			return a;
		case Fleur.Node.DOCUMENT_NODE:
			n = n.documentElement;
		//$FALLTHROUGH$
		case Fleur.Node.ELEMENT_NODE:
			a = new Fleur.Text();
			a.data = n.textContent;
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.ATTRIBUTE_NODE:
			a = new Fleur.Text();
			a.data = n.value.slice(0);
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.MAP_NODE:
			a = new Fleur.Map();
			i = 0;
			l = n.entries.length;
			while (i < l) {
				a.setEntryNode(Fleur._Atomize(null, n.entries[i]));
				i++;
			}
			return a;
		case Fleur.Node.ENTRY_NODE:
			if (force) {
				return Fleur._Atomize(null, n.firstChild);
			}
			a = new Fleur.Entry();
			a.nodeName = n.nodeName;
			a.namespaceURI = null;
			a.localName = n.nodeName;
			a.appendChild(Fleur._Atomize(null, n.firstChild));
			return a;
		case Fleur.Node.SEQUENCE_NODE:
			if (force) {
				var seq = new Fleur.Sequence();
				seq.childNodes = new Fleur.NodeList();
				n.childNodes.forEach(function(n3) {
					seq.appendChild(Fleur._Atomize(null, n3));
				});
				return seq;
			}
			a = new Fleur.Text();
			a.data = "";
			var nextsep = "";
			for (i = 0, l = n.childNodes.length; i < l; i++) {
				n2 = Fleur._Atomize(a, n.childNodes[i], n.childNodes[i].nodeType === Fleur.Node.ENTRY_NODE ? true : force);
				if (n2.schemaTypeInfo === Fleur.Type_error || n2.nodeName !== "#text") {
					return n2;
				}
				a.data += nextsep + n2.data;
				nextsep = " ";
			}
			return a;
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
						if (a.nodeType !== Fleur.Node.ARRAY_NODE) {
							seq = new Fleur.Array();
							seq.appendChild(a);
							a = seq;
						}
						if (n2.nodeType !== Fleur.Node.ARRAY_NODE) {
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
		case Fleur.Node.FUNCTION_NODE:
			if (force) {
				a = new Fleur.Text();
				a.schemaTypeInfo = Fleur.Type_error;
				a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:FOTY0013");
			} else {
				a = new Fleur.Function(n.namespaceURI, n.nodeName, n.jsfunc, n.xqxfunc, n.argtypes, n.needctx, n.needcallback, n.restype, n.updating);
			}
			return a;
	}
};
Fleur.Atomize = function(n, force) {
	return n === Fleur.EmptySequence ? Fleur.EmptySequence : Fleur._Atomize(null, n, n.nodeType === Fleur.Node.ENTRY_NODE ? true : force);
};