/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.returnClause] = function(ctx, children, callback, resarr) {
	//console.log("returnClause");
	var i = 0;
	var result = Fleur.EmptySequence;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		//console.log("result eq " + Fleur.Serializer._serializeNodeToXQuery(result, false, ""));
		//console.log("n eq " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		if (n !== Fleur.EmptySequence) {
			if (result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				result = n;
			} else {
				if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					if (result !== Fleur.EmptySequence) {
						seq.appendChild(result);
					}
					result = seq;
				}
				if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result.appendChild(n);
				} else {
					n.childNodes.forEach(function(node) {
						result.appendChild(node);
					});
				}
				//console.log(result.childNodes.length);
			}
		}
		//console.log("result := " + Fleur.Serializer._serializeNodeToXQuery(result, false, ""));
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		} else {
			Fleur.callback(function() {callback(result);});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};