/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
if (typeof BigInt === "undefined") {
	Fleur.BigInt = function(arg) {
		return parseInt(arg, 10);
	};
} else {
	Fleur.BigInt = BigInt;
}