/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["encode-for-uri"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return encodeURIComponent(s).replace(/[!'()*]/g, function(c) {return '%' + c.charCodeAt(0).toString(16).toUpperCase();});}, null, callback);
};