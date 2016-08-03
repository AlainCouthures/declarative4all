/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.varMgr = function(vars) {
	this.vars = vars || [];
};
Fleur.varMgr.prototype.indexOf = function(vuri, vname) {
	var i = this.vars.length;
	while (i) {
		i--;
		if (this.vars[i].vuri === vuri && this.vars[i].vname === vname) {
			return i;
		}
	}
	return -1;
};
Fleur.varMgr.prototype.get = function(ctx, vuri, vname) {
	var index = this.indexOf(vuri, vname);
	if (index !== -1) {
		return this.vars[index].value;
	}
	return Fleur.error(ctx, "XPST0008");
};
Fleur.varMgr.prototype.set = function(ctx, vuri, vname, value) {
	var index = this.indexOf(vuri, vname);
	if (index === -1) {
		this.vars.push({vuri: vuri, vname: vname, value: value});
		return value;
	}
	this.vars[index].value = value;
	return Fleur.error(ctx, "XQST0049");
};
Object.defineProperties(Fleur.varMgr.prototype, {
	length: {
		set: function(value) {
			this.vars.length = value;
		},
		get: function() {
			return this.vars.length;
		}
	}
});