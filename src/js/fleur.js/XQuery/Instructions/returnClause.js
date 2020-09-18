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
		var seq;
		if (n !== Fleur.EmptySequence) {
			if ((result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) || (n.schemaTypeInfo && n.schemaTypeInfo === Fleur.Type_error)) {
				result = n;
			} else {
				if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					seq = new Fleur.Sequence();
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
				} else if (n.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
					n.childNodes.forEach(function(n2, index) {
						if (!result.childNodes[index]) {
							result.appendChild(new Fleur.Multidim());
						}
						n2.childNodes.forEach(function(node) {
							result.childNodes[index].appendChild(node);
						});
					});
				} else {
					n.childNodes.forEach(function(node) {
						result.appendChild(node);
					});
				}
				result.rowlabels = n.rowlabels;
				result.collabels = n.collabels;
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