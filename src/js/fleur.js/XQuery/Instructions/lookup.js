/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.lookup] = function(ctx, children, callback) {
//console.log("lookup - " + pos + " - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	var maps = [];
	if (ctx._curr.nodeType === Fleur.Node.MAP_NODE) {
		maps.push(ctx._curr);
	} else if (ctx._curr.childNodes) {
		maps = ctx._curr.childNodes.filter(function(c) { return c.nodeType === Fleur.Node.MAP_NODE;});	
	}
	if (maps.length === 0) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.lookup);});
		return;
	}
	var seq = new Fleur.Sequence();
	seq.childNodes = new Fleur.NodeList();
	if (children[0][0] === Fleur.XQueryX.NCName) {
		var ncname = children[0][1][0];
		maps.forEach(function(m) {
			var e = m.getEntryNode(ncname);
			if (e) {
				seq.appendChild(e);
			}
		});
		if (seq.childNodes.length === 0) {
			seq = Fleur.EmptySequence;
		} else if (seq.childNodes.length === 1) {
			seq = seq.childNodes[0];
		}
		Fleur.callback(function() {callback(seq, Fleur.XQueryX.lookup);});
	} else if (children[0][0] === Fleur.XQueryX.star) {
		maps.forEach(function(m) {
			m.entries.forEach(function(e) {
				seq.appendChild(e);
			});
		});
		if (seq.childNodes.length === 0) {
			seq = Fleur.EmptySequence;
		} else if (seq.childNodes.length === 1) {
			seq = seq.childNodes[0];
		}
		Fleur.callback(function() {callback(seq, Fleur.XQueryX.lookup);});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				maps.forEach(function(m) {
					var e = m.getEntryNode(a.data);
					if (e) {
						seq.appendChild(e);
					}
				});
				if (seq.childNodes.length === 0) {
					seq = Fleur.EmptySequence;
				} else if (seq.childNodes.length === 1) {
					seq = seq.childNodes[0];
				}
				Fleur.callback(function() {callback(seq, Fleur.XQueryX.lookup);});
			}
		});
	}
};