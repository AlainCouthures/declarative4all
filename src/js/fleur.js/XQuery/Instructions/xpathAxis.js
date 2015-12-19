/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.xpathAxis] = function(ctx, children) {
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