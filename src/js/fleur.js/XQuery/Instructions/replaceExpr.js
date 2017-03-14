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
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};