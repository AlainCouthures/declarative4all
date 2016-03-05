/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.error = function(ctx, ename) {
	Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr](ctx, [[Fleur.XQueryX.functionName,['error']],[Fleur.XQueryX.arguments,[[Fleur.XQueryX.functionCallExpr,[[Fleur.XQueryX.functionName,['QName']],[Fleur.XQueryX.arguments,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['http://www.w3.org/2005/xqt-errors']]]],[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['err:' + ename]]]]]]]]]]]);
};
