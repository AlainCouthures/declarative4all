/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XsltEngine[Fleur.XsltX.stylesheet] = function(ctx, children) {
	var i = 0, l;
	l = children.length;
	while (i < l) {
		Fleur.XsltEngine[children[i][0]](ctx, children[i][1]);
		i++;
	}
};