/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["insert-before"] = function(ctx, children, callback) {
	if (children.length !== 3) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			callback(n);
			return;
		}
		var seq = n;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var index;
			var a1 = Fleur.Atomize(n);
			if (a1.schemaTypeInfo === Fleur.Type_error) {
				callback(a1);
				return;
			}
			if (a1.schemaTypeInfo !== Fleur.Type_integer) {
				callback(Fleur.error(ctx, "XPTY0004"));
				return;
			}
			index = Math.max(parseInt(a1.data, 10) - 1, 0);
			Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
				var a2 = Fleur.Atomize(n);
				if (a2 === Fleur.EmptySequence) {
					callback(seq);
					return;
				}
				if (seq === Fleur.EmptySequence) {
					callback(a2);
					return;
				}
				var result = new Fleur.Sequence();
				if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
					var i = 0, l;
					l = seq.childNodes.length;
					index = Math.min(index, l);
					while (i < index) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
						a2.childNodes.forEach(function(m) {result.appendChild(m);});
					} else {
						result.appendChild(a2);
					}
					while (i < l) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
				} else {
					result = new Fleur.Sequence();
					if (index !== 0) {
						result.appendChild(seq);
					}
					if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
						a2.childNodes.forEach(function(m) {result.appendChild(m);});
					} else {
						result.appendChild(a2);
					}
					if (index === 0) {
						result.appendChild(seq);
					}
				}
				callback(result);
			});
		});
	});
};