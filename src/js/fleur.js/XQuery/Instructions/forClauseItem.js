/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.forClauseItem] = function(ctx, children, callback) {
	var varname = children[0][1][0][1][0];
	var allowingEmpty = children[1][0] === Fleur.XQueryX.allowingEmpty ? 1 : 0;
	var positionalVariableBinding = children[1 + allowingEmpty][0] === Fleur.XQueryX.positionalVariableBinding ? 1 : 0;
	var pvarname = positionalVariableBinding !== 0 ? children[1 + allowingEmpty][1][0] : "";
	Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], function(n) {
		var next = Fleur.EmptySequence;
		var currval;
		var cb = function() {
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				currval = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
			} else {
				currval = next;
				next = Fleur.EmptySequence;
			}
			//alert(varname + " = " + currval.data);
			ctx.env.varresolver.set(ctx, "", varname, currval);
			Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem, next === Fleur.EmptySequence ? null : cb);});
		};
		if (n === Fleur.EmptySequence) {
			if (allowingEmpty !== 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem, null);});
				return;
			}
			Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem);});
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			currval = n.childNodes.shift();
			if (n.childNodes.length === 1) {
				n = n.childNodes[0];
			}
		} else {
			currval = n;
			n = Fleur.EmptySequence;
		}
		next = n;
		//alert(varname + " = " + currval.data);
		ctx.env.varresolver.set(ctx, "", varname, currval);
		Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem, next === Fleur.EmptySequence ? null : cb);});
	});
};