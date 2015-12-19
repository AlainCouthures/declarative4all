/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XsltEngine[Fleur.XsltX.template] = function(ctx, children) {
	var i = 0, l, template = {};
	l = children.length;
	while (i < l) {
		if (Fleur.XsltXNames[1][children[i][0]][0] !== 2 && Fleur.XsltXNames[1][children[i][0]][1] !== 4 && Fleur.XsltXNames[1][children[i][0]][1] !== 5) {
			break;
		}
		Fleur.XsltEngine[children[i][0]](template, children[i][1]);
		i++;
	}
	template.mode = template.mode || "#default";
	if (template.name) {
		ctx.template[1][template.name] = [template, children.slice(i)];
	}
	if (template.match) {
		if (ctx.template[0][template.mode]) {
			ctx.template[0][template.mode].push([template, children.slice(i)]);
		} else {
			ctx.template[0][template.mode] = [[template, children.slice(i)]];
		}
	}
};