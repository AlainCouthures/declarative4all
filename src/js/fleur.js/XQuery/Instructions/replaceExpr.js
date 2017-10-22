/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.replaceExpr] = function(ctx, children, callback) {
	var replaceValue = children[0][0] === Fleur.XQueryX.replaceValue ? 1 : 0;
	Fleur.XQueryEngine[children[replaceValue][1][0][0]](ctx, children[replaceValue][1][0][1], function(target) {
		if (target !== Fleur.EmptySequence) {
			Fleur.XQueryEngine[children[replaceValue + 1][1][0][0]](ctx, children[replaceValue + 1][1][0][1], function(replacement) {
				if (replaceValue === 1) {
					var a = Fleur.Atomize(replacement);
					target.textContent = a.data;
				} else if (replacement === Fleur.EmptySequence) {
					if (target.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
						target.ownerElement.removeAttributeNode(target);
					} else if (target.nodeType === Fleur.Node.ENTRY_NODE) {
						target.ownerMap.removeEntryNode(target);
					} else {
						target.parentElement.removeChild(target);
					}
				} else {
					var parelt = target.nodeType === Fleur.Node.ATTRIBUTE_NODE ? target.ownerElement : target.nodeType === Fleur.Node.ENTRY_NODE ? target.ownerMap : target.parentElement;
					var n2;
					if (target instanceof Fleur.Node) {
						n2 = target.ownerDocument.importNode(replacement.nodeType === Fleur.Node.SEQUENCE_NODE ? replacement.firstChild : replacement, true);
					} else {
						n2 = Fleur.Document.docImportNode(target.ownerDocument, replacement.nodeType === Fleur.Node.SEQUENCE_NODE ? replacement.firstChild : replacement, true);
					}
					if (target.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
						parelt.removeAttributeNode(target);
						parelt.setAttributeNode(n2);
					} else if (target.nodeType === Fleur.Node.ENTRY_NODE) {
						parelt.removeEntryNode(target);
						parelt.setEntryNode(n2);
					} else {
						parelt.replaceChild(n2, target);
					}
					if (replacement.nodeType === Fleur.Node.SEQUENCE_NODE) {
						var n3;
						for (var i = 1, l = replacement.childNodes.length; i < l; i++) {
							if (parelt instanceof Fleur.Node) {
								n3 = parelt.ownerDocument.importNode(replacement.childNodes[i], true);
							} else {
								n3 = Fleur.Document.docImportNode(parelt.ownerDocument, replacement.childNodes[i], true);
							}
							if (n3.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
								parelt.setAttributeNode(n3);
							} else if (n3.nodeType === Fleur.Node.ENTRY_NODE) {
								parelt.setEntryNode(n3);
							} else {
								parelt.insertBefore(n3, n2.followingSibling);
							}
						}
					}
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};