/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.geOp = function(op1, op2) {
	if (op1[0] < 4 || (op1[0] > 5 && op1[0] < 9)) {
		return op1[1] >= op2[1];
	}
	if (op1[0] === 4) {
		return op1[1].localeCompare(op2[1]) >= 0;
	}
	if (op1[0] === 5) {
		return (op1[1] === "true") >= (op2[1] === "true");
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) >= op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) >= op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.geOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.geOp, callback);
};