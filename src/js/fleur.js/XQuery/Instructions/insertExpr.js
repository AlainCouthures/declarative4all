/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.insertExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(source) {
		if (source !== Fleur.EmptySequence) {
			Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], function(target) {
				var targetChoice = children[1][0];
				var intoPos = null;
				if (targetChoice === Fleur.XQueryX.insertInto) {
					if (children[1][1].length !== 0) {
						intoPos = children[1][1][0][0];
					}
				}
				if (source.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var tnode;
					if (target instanceof Fleur.Node) {
						tnode = target.ownerDocument ? target.ownerDocument.importNode(source, true) : source;
					} else {
						tnode = Fleur.Document.docImportNode(target.ownerDocument, source, true);
					}
					switch (target.nodeType) {
						case Fleur.Node.ELEMENT_NODE:
							switch (targetChoice) {
								case Fleur.XQueryX.insertInto:
									if (source.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
										target.setAttributeNode(source);
									} else {
										if (intoPos === Fleur.XQueryX.insertAsFirst) {
											target.insertBefore(tnode, target.firstChild);
										} else {
											target.appendChild(tnode);
										}
									}
									break;
								case Fleur.XQueryX.insertBefore:
									target.parentNode.insertBefore(tnode, target);
									break;
								case Fleur.XQueryX.insertAfter:
									if (target.nextSibling) {
										target.parentNode.insertBefore(tnode, target.nextSibling);
									} else {
										target.parentNode.appendChild(tnode);
									}
									break;
							}
							break;
						case Fleur.Node.MAP_NODE:
							target.setEntryNode(tnode);
							break;
					}
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};