/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["current-time"] = function(ctx, children, callback) {
	var a;
	if (children.length !== 0) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	a = new Fleur.Text();
	var date = new Date();
	var o = date.getTimezoneOffset();
	a.schemaTypeInfo = Fleur.Type_time;
	a.data = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "." + ("00" + date.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
	callback(a);
};