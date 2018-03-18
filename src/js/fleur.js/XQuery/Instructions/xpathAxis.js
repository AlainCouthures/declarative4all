/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.xpathAxis] = function(ctx, children, callback) {
//console.log("xpathAxis - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, "") + " - " + children[0]);
	var seq, n, i, l;
	var curr = ctx._curr;
	switch(children[0]) {
		case "ancestor-or-self":
			if (!curr.parentNode && !curr.ownerElement) {
				Fleur.callback(function() {callback(curr);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(curr);
			n = curr.parentNode || curr.ownerElement;
			seq.appendChild(n);
			n = n.parentNode;
			while (n) {
				seq.appendChild(n);
				n = n.parentNode;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "ancestor":
			if (!curr.parentNode && !curr.ownerElement) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.parentNode || curr.ownerElement;
			if (!n.parentNode) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.parentNode;
			while (n) {
				seq.appendChild(n);
				n = n.parentNode;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "attribute":
			if (!curr.attributes || curr.attributes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.attributes.length === 1 && curr.attributes[0].nodeName !== "xmlns" && curr.attributes[0].prefix !== "xmlns") {
				Fleur.callback(function() {callback(curr.attributes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			if (curr.attributes.forEach) {
				curr.attributes.forEach(function(a) {
					if (a.nodeName !== "xmlns" && a.prefix !== "xmlns") {
						seq.appendChild(a);
					}
				});
			} else {
				for (i = 0, l = curr.attributes.length; i < l; i++) {
					if (curr.attributes[i].nodeName !== "xmlns" && curr.attributes[i].prefix !== "xmlns") {
						seq.appendChild(curr.attributes[i]);
					}
				}
			}
			if (seq.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			} else {
				if (seq.childNodes.length === 1) {
					seq = seq.childNodes[0];
				}
				Fleur.callback(function() {callback(seq);});
			}
			return;
		case "entry":
			if (!curr.entries || curr.entries.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.entries.length === 1) {
				Fleur.callback(function() {callback(curr.entries[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			curr.entries.forEach(function(a) {seq.appendChild(a);});
			Fleur.callback(function() {callback(seq);});
			return;
		case "child":
			if (!curr.hasOwnProperty("childNodes") || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.childNodes.length === 1) {
				Fleur.callback(function() {callback(curr.childNodes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			if (curr.childNodes.forEach) {
				curr.childNodes.forEach(function(a) {seq.appendChild(a);});
			} else {
				for (i = 0, l = curr.childNodes.length; i < l; i++) {
					seq.appendChild(curr.childNodes[i]);
				}
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "descendant":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.childNodes.length === 1 && curr.childNodes[0].childNodes.length === 0) {
				Fleur.callback(function() {callback(curr.childNodes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendDescendants(curr);
			Fleur.callback(function() {callback(seq);});
			return;
		case "descendant-or-self":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(curr);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(curr);
			seq.appendDescendants(curr);
			Fleur.callback(function() {callback(seq);});
			return;
		case "following":
			if (!curr.nextSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.nextSibling;
			if (!n.nextSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.nextSibling;
			while (n) {
				seq.appendChild(n);
				seq.appendDescendants(n);
				n = n.nextSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "following-sibling":
			if (!curr.nextSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.nextSibling;
			if (!n.nextSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.nextSibling;
			while (n) {
				seq.appendChild(n);
				n = n.nextSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "parent":
			Fleur.callback(function() {callback(curr.parentNode || curr.ownerElement || Fleur.EmptySequence);});
			return;
		case "preceding":
			if (!curr.previousSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.previousSibling;
			if (!n.previousSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.previousSibling;
			while (n) {
				seq.appendDescendantsRev(n);
				seq.appendChild(n);
				n = n.previousSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "preceding-sibling":
			if (!curr.previousSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.previousSibling;
			if (!n.previousSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.previousSibling;
			while (n) {
				seq.appendChild(n);
				n = n.previousSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "self":
			Fleur.callback(function() {callback(curr);});
			return;
	}
};
/*
	var ancestor;
	if (ctx._stepctx.domAxis) {
		ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr[ctx._stepctx.domAxis];
		return;
	}
	if (!ctx._stepctx.curr) {
		ctx._stepctx.xpathAxis = children[0];
		ctx._stepctx.curr = ctx._curr;
		switch (ctx._stepctx.xpathAxis) {
			case "ancestor-or-self":
				ctx._stepctx.xpathAxis = "ancestor";
				ctx._stepctx.continue = ctx._stepctx.curr;
				return;
			case "ancestor":
				ctx._stepctx.domAxis = "parentNode";
				ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.parentNode | ctx._stepctx.curr.ownerElement;
				return;
			case "attribute":
				ctx._stepctx.iattr = 0;
				ctx._stepctx.curr = ctx._stepctx.curr.attributes[ctx._stepctx.iattr++];
				ctx._stepctx.continue = ctx._stepctx.curr && ctx._stepctx.iattr < ctx._stepctx.curr.ownerElement.attributes.length ? ctx._stepctx.curr : null;
				return;
			case "child":
				ctx._stepctx.domAxis = "nextSibling";
				ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.childNodes && ctx._stepctx.curr.childNodes.length > 0 ? ctx._stepctx.curr.childNodes[0] : null;
				return;
			case "descendant":
				ctx._stepctx.down = true;
				break;
			case "descendant-or-self":
				ctx._stepctx.xpathAxis = "descendant";
				ctx._stepctx.continue = ctx._stepctx.curr;
				return;
			case "following":
				ctx._stepctx.down = false;
				break;
			case "following-sibling":
				ctx._stepctx.domAxis = "nextSibling";
				ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.nextSibling;
				return;
			case "parent":
				ctx._stepctx.curr = ctx._curr.parentNode | ctx._stepctx.curr.ownerElement;
				return;
			case "preceding":
				ctx._stepctx.down = false;
				return;
			case "preceding-sibling":
				ctx._stepctx.domAxis = "previousSibling";
				ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.previousSibling;
				return;
			case "self":
				return;
		}
	}
	switch (ctx._stepctx.xpathAxis) {
		case "ancestor":
			ctx._stepctx.domAxis = "parentNode";
			ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.parentNode | ctx._stepctx.curr.ownerElement;
			return;
		case "attribute":
			ctx._stepctx.curr = ctx._stepctx.curr.ownerElement.attributes[ctx._stepctx.iattr++];
			ctx._stepctx.continue = ctx._stepctx.curr && ctx._stepctx.iattr < ctx._stepctx.curr.ownerElement.attributes.length ? ctx._stepctx.curr : null;
			return;
		case "descendant":
			do {
				if (ctx._stepctx.down && ctx._stepctx.curr.childNodes && ctx._stepctx.curr.childNodes.length > 0) {
					ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.childNodes[0];
					return;
				} else if (ctx._stepctx.curr.nextSibling) {
					ctx._stepctx.down = true;
					ctx._stepctx.continue = ctx._stepctx.curr.nextSibling;
					return;
				} else {
					ctx._stepctx.curr = ctx._stepctx.curr.parentNode;
					ctx._stepctx.down = false;
					if (ctx._stepctx.curr === ctx._curr) {
						ctx._stepctx.continue = ctx._stepctx.curr = null;
						return;
					}
				}
			} while (1);
			return;
		case "following":
			do {
				if (ctx._stepctx.down && ctx._stepctx.curr.childNodes && ctx._stepctx.curr.childNodes.length > 0) {
					ctx._stepctx.continue = ctx._stepctx.curr = ctx._stepctx.curr.childNodes[0];
					return;
				} else if (ctx._stepctx.curr.nextSibling) {
					ctx._stepctx.down = true;
					ctx._stepctx.continue = ctx._stepctx.curr.nextSibling;
					return;
				} else {
					ctx._stepctx.curr = ctx._stepctx.curr.parentNode;
					ctx._stepctx.down = false;
					if (!ctx._stepctx.curr) {
						ctx._stepctx.continue = ctx._stepctx.curr = null;
						return;
					}
				}
			} while (1);
			return;
		case "namespace":
			return;
		case "preceding":
			do {
				if (ctx._stepctx.down) {
					while (ctx._stepctx.curr.childNodes && ctx._stepctx.curr.childNodes.length > 0) {
						ctx._stepctx.curr = ctx._stepctx.curr.childNodes[ctx._stepctx.curr.childNodes.length - 1];
					}
					return;
				} else if (ctx._stepctx.curr.previousSibling) {
					ctx._stepctx.down = true;
					ctx._stepctx.continue = ctx._stepctx.curr.nextSibling;
					return;
				} else {
					ctx._stepctx.curr = ctx._stepctx.curr.parentNode;
					ctx._stepctx.down = false;
					if (ctx._stepctx.curr) {
						ancestor = ctx._curr.parentNode;
						while (ancestor && ancestor !== ctx._stepctx.curr) {
							ancestor = ancestor.parentNode;
						}
					}
					if (!ctx._stepctx.curr || !ancestor) {
						ctx._stepctx.continue = ctx._stepctx.curr;
						return;
					}
				}
			} while (1);
			return;
	}
};
*/