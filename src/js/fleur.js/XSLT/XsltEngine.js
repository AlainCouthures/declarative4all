/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XsltEngine = Fleur.XQueryEngine.slice(0);
Fleur.XsltX = {};
Fleur.XsltX._pattern2xpath = function(xqueryx) {
	var i, step, newaxis, t;
	switch (xqueryx[0]) {
		case Fleur.XQueryX.pathExpr:
			i = xqueryx[1].length - 1;
			newaxis = "self";
			t = [];
			while (i >= 0) {
				step = xqueryx[1][i];
				switch (step[0]) {
					case Fleur.XQueryX.rootExpr:
						t.push([Fleur.XQueryX.stepExpr, [[Fleur.XQueryX.xpathAxis, [newaxis]], [Fleur.XQueryX.documentTest, []]]]);
						break;
					case Fleur.XQueryX.stepExpr:
						if (step[1][0][0] === Fleur.XQueryX.xpathAxis &&
						    step[1][0][1][0] === "descendant-or-self" &&
							step[1][1][0] === Fleur.XQueryX.anyKindTest) {
							newaxis = "ancestor";
						} else {
							t.push([Fleur.XQueryX.stepExpr, [[Fleur.XQueryX.xpathAxis, [newaxis]], step[1][1]]]);
							newaxis = "parent";
						}
						break;
				}
				i--;
			}
			xqueryx[1] = t;
			break;
		case Fleur.XQueryX.unionOp:
			Fleur.XsltX._pattern2xpath(xqueryx[1][0][1][0]);
			Fleur.XsltX._pattern2xpath(xqueryx[1][1][1][0]);
			break;
	}
};