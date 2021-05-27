"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_simpleMapExpr = function(children) {
	const previndent = this.indent;
	this.indent += this.step;
	const prevasync = this.async;
	this.async = false;
	let result = this.funcdef(children[1][1].length === 1 && children[1][1][0][1][0][0] === Fleur.XQueryX.filterExpr ? children[1][1][0][1][0][1][0] : children[1]);
	this.indent = previndent;
	result = "\n" + this.indent + (this.async ? "await " : "") + this.ctxvarname + ".xqx_simpleMapExpr" + (this.async ? "_async" : "") + "(" + result;
	this.async = this.async || prevasync;
	return this.gen(children[0][1].length === 1 && children[0][1][0][1][0][0] === Fleur.XQueryX.filterExpr ? children[0][1][0][1][0][1][0] : children[0]) + result + "\n" + this.indent + ");";
};

Fleur.Context.prototype.xqx_simpleMapExpr = function(f) {
	if (!this.item || this.item.isSingle()) {
		const ctx = this.clone(this.initialpath);
		ctx.position = 1;
		ctx.item = this.item;
		ctx.path = this.item;
		ctx.last = 1;
		f(ctx);
		this.item = ctx.item;
		return this;
	}
	const seq = new Fleur.Sequence();
	const l = this.item.childNodes.length;
	const children = this.item.childNodes;
	for (let i = 0; i < l; i++) {
		const ctx = this.clone(this.initialpath);
		ctx.position = i + 1;
		ctx.item = children[i];
		ctx.path = children[i];
		ctx.last = l;
		f(ctx);
		seq.appendChild(ctx.item);
	}
	this.item = seq.singleton();
	return this;
};

Fleur.Context.prototype.xqx_simpleMapExpr_async = async function(f) {
	if (!this.item || this.item.isSingle()) {
		const ctx = this.clone(this.initialpath);
		ctx.position = 1;
		ctx.item = this.item;
		ctx.path = this.item;
		ctx.last = 1;
		await f(ctx);
		this.item = ctx.item;
		return this;
	}
	const seq = new Fleur.Sequence();
	const l = this.item.childNodes.length;
	const children = this.item.childNodes;
	for (let i = 0; i < l; i++) {
		const ctx = this.clone(this.initialpath);
		ctx.position = i + 1;
		ctx.item = children[i];
		ctx.path = children[i];
		ctx.last = l;
		await f(ctx);
		seq.appendChild(ctx.item);
	}
	this.item = seq.singleton();
	return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.simpleMapExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		//console.log("simpleMapExpr - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		var subcurr, next, last, pos = 1, result = Fleur.EmptySequence;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		next = n;
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			next = new Fleur.Sequence();
			next.childNodes = new Fleur.NodeList();
			for (var i = 0, l = n.childNodes.length; i < l; i++) {
				next.appendChild(n.childNodes[i]);
			}
			next.rowlabels = n.rowlabels;
			next.collabels = n.collabels;
			if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
				last = next.childNodes[0].childNodes.length;
				if (last !== 1) {
					subcurr = new Fleur.Sequence();
					for (i = 0, l = next.childNodes.length; i < l; i++) {
						var subitem = next.childNodes[i].childNodes.shift();
						var multi = new Fleur.Multidim();
						multi.appendChild(subitem);
						subcurr.appendChild(multi);
					}
					subcurr.rowlabels = next.rowlabels;
				} else {
					subcurr = next;
					next = Fleur.EmptySequence;
				}
			} else {
				last = next.childNodes.length;
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
				subcurr.rowlabels = next.rowlabels;
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
			last = 1;
		}
		var cb = function(n) {
			//console.log("simpleMapExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
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
			if (next === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.simpleMapExpr);});
				return;
			}
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
					if (next.childNodes[0].childNodes.length !== 1) {
						subcurr = new Fleur.Sequence();
						for (i = 0, l = next.childNodes.length; i < l; i++) {
							var subitem = next.childNodes[i].childNodes.shift();
							var multi = new Fleur.Multidim();
							multi.appendChild(subitem);
							subcurr.appendChild(multi);
						}
						subcurr.rowlabels = next.rowlabels;
					} else {
						subcurr = next;
						next = Fleur.EmptySequence;
					}
				} else {
					subcurr = next.childNodes.shift();
					if (next.childNodes.length === 1) {
						next = next.childNodes[0];
					}
					subcurr.rowlabels = next.rowlabels;
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
			}
			pos++;
			Fleur.XQueryEngine[children[1][0]]({
				_curr: subcurr,
				_item: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[1][1], cb);
		};
		Fleur.XQueryEngine[children[1][0]]({
			_curr: subcurr,
			_item: subcurr,
			_next: next,
			_last: last,
			_pos: pos,
			env: ctx.env
		}, children[1][1], cb);
	});
};