"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_elementConstructor = function(children) {
  let r = "";
  let l = 0;
  if (children.length > 1) {
    const transp = this;
    r = children[1][1].reduce((inst, child) => inst + transp.gen(child), "");
    l += children[1][1].length;
    if (children.length === 3) {
      r += children[2][1].reduce((inst, child) => inst + transp.gen(child), "");
      l += children[2][1].length;
    }
  }
	return r + this.inst("xqx_elementConstructor('" +  children[0][1][0] + "', " + String(l) + ")");
};

Fleur.XQueryEngine[Fleur.XQueryX.elementConstructor] = function(ctx, children, callback) {
	var elt = new Fleur.Element();
	elt.internal_id = String(Fleur.Document_index++);
	elt.internal_id = String.fromCharCode(64 + elt.internal_id.length) + elt.internal_id;
	elt.nodeName = children[0][1][0];
	elt.namespaceURI = null;
	elt.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		elt.prefix = children[0][1][1][1][0];
	} else {
		elt.prefix = null;
	}
	elt.childNodes = new Fleur.NodeList();
	elt.children = new Fleur.NodeList();
	elt.textContent = "";
	if (children.length > 1) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			elt.namespaceURI = elt.lookupNamespaceURI(elt.prefix) || ctx.env.nsresolver.lookupNamespaceURI(elt.prefix);
			if (children.length > 2) {
				var nsr = ctx.env.nsresolver;
				ctx.env.nsresolver = new Fleur.XPathNSResolver(elt);
				Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
					ctx.env.nsresolver = nsr;
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(n);});
			}
		}, elt);
	} else {
		elt.namespaceURI = ctx.env.nsresolver.lookupNamespaceURI(elt.prefix);
		Fleur.callback(function() {callback(elt);});
	}
};