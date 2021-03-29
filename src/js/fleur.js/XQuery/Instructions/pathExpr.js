/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_pathExpr = function(children, atomicType) {
	let result = this.inst("xqx_pathExpr()");
	const children2 = [];
	for (let i = 0, l = children.length; i < l; i++) {
		children2.push(children[i]);
		const arr = children[i][1];
		for (let j = 0, l2 = arr.length; j < l2; j++) {
			if (arr[j][0] === Fleur.XQueryX.predicates) {
				for (let k = 0, l3 = arr[j][1].length; k < l3; k++) {
					children2.push(arr[j][1][k]);
				}
			}
		}
	}
	const previndent = this.indent;
	for (let i = 0, l = children2.length; i < l; i++) {
		if (i !== 0) {
			result += "\n" + this.indent + "if (" + this.ctxvarname + ".item.isNotEmpty()) {";
			this.indent += this.step;
		}
		if (children2[i][0] === Fleur.XQueryX.stepExpr || children2[i][0] === Fleur.XQueryX.rootExpr) {
			result += this.gen(children2[i]);
		} else {
			const predindent = this.indent;
			this.indent += this.step;
			const prevasync = this.async;
			this.async = false;
			let pred = this.funcdef(children2[i]);
			this.indent = predindent;
			result += "\n" + this.indent + (this.async ? "await " : "") + this.ctxvarname + ".xqx_predicateExpr(" + pred;
			this.async = this.async || prevasync;
			result += "\n" + this.indent + ");";
		}
	}
	this.indent = previndent;
	let closes = "";
	for (let i = 0, l = children2.length; i < l; i++) {
		if (i !== 0) {
			closes = "\n" + this.indent + "}" + closes;
			this.indent += this.step;
		}
	}
	this.indent = previndent;
	return result + closes + this.inst("restoreContext()", false, atomicType);
};

Fleur.Context.prototype.xqx_pathExpr = function() {
	this.itemstack.push(this.item);
	this.pathstack.push(this.path);
	this.item = this.path;
	return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.pathExpr] = function(ctx, children, callback) {
//console.log("pathExpr - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	var next;
	var result = Fleur.EmptySequence;
	var tests = [];
	var preds = [];
	children[0][1].forEach(function(child) {
		if (child[0] === Fleur.XQueryX.predicates) {
			child[1].forEach(function(subchild) {preds.push(subchild);});
		} else if (child[0] === Fleur.XQueryX.predicate) {
			preds.push(child[1][0]);
		} else if (child[0] === Fleur.XQueryX.lookup) {
			preds.push(child);
		} else {
			tests.push(child);
		}
	});
	var cb = function(n, eob) {
//console.log("pathExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.pathExpr ? "pathExpr" : "stepExpr") : ""));
		if (eob === Fleur.XQueryX.pathExpr) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence || (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_error)) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			n = next;
		}
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(result, Fleur.XQueryX.pathExpr);});
			return;
		}
		var cb2 = function(n) {
			if (children.length === 1 || n === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(n, Fleur.XQueryX.pathExpr);});
				return;
			}
			var subcurr;
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				subcurr = n.childNodes[0];
				if (n.childNodes.length === 2) {
					n = n.childNodes[1];
				} else {
					var seq2 = new Fleur.Sequence();
					seq2.childNodes = new Fleur.NodeList();
					seq2.children = new Fleur.NodeList();
					seq2.textContent = "";
					n.childNodes.forEach(function(n2) {
						seq2.appendChild(n2);
					});
					seq2.childNodes.shift();
					n = seq2;
				}
			} else {
				subcurr = n;
				n = Fleur.EmptySequence;
			}
			next = n;
			Fleur.XQueryEngine[Fleur.XQueryX.pathExpr]({
				_curr: subcurr,
				_item: ctx._item,
				env: ctx.env
			}, children.slice(1), cb);
		};
		if (preds.length !== 0) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				next = new Fleur.Sequence();
				next.childNodes = new Fleur.NodeList();
				n.childNodes.forEach(function(node) {
					next.appendChild(node);
				});
				next.collabels = n.collabels;
			} else {
				next = n;
			}
			Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
				_next: next,
				_item: ctx._item,
				env: ctx.env
			}, preds, function(n) {
				Fleur.callback(function() {preds = []; cb2(n);});
			});
			return;
		}
		cb2(n);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, tests, cb);
};