/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["seconds-from-time"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_time, /^\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_decimal, callback);
};