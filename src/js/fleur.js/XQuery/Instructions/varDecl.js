"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_varDecl = function(children) {
  let r = "";
  let vstype = Fleur.SequenceType_string_01; 
  const vname = children[0][1][0];
  const namespaceURI = this.rs.nsresolver.lookupNamespaceURI((children[0][1].length === 2 ? children[0][1][1][1][0] : "")) || "";
  if (children[1][0] !== Fleur.XQueryX.external) {
    const vvalue = this.gen(children[1][1][0]);
    r = vvalue.inst;
    vstype = vvalue.sequenceType;
    r += this.inst("xqx_varDecl('" + namespaceURI + "', '" + vname + "')").inst;
  }
  this.rs.varresolver.set(null, namespaceURI, vname, vstype);
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_empty_sequence
  };
};

Fleur.Context.prototype.xqx_varDecl = function(namespaceURI, vname) {
  this.rs.varresolver.set(null, namespaceURI, vname, this.item);
  this.item = this.itemstack.pop();
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.varDecl] = function(ctx, children, callback) {
  var vname = children[0][1][0];
  var uri = "";
  var prefix = null;
  if (children[0][1][1]) {
    if (children[0][1][1][0] === Fleur.XQueryX.URI) {
      uri = children[0][1][1][1][0];
    } else if (children[0][1][1][0] === Fleur.XQueryX.prefix) {
      prefix = children[0][1][1][1][0];
      uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
    }
  }
  if (children[1][0] === Fleur.XQueryX.external) {
    if (ctx.env.args && ctx.env.args[vname]) {
      var n = new Fleur.Text();
      n.data = ctx.env.args[vname];
      n.schemaTypeInfo = Fleur.Type_untypedAtomic;
      ctx.env.globalvarresolver.set(ctx, uri, vname, n);
      Fleur.callback(function() {callback();});
    } else if (children.length === 3) {
      Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], function(n) {
        ctx.env.globalvarresolver.set(ctx, uri, vname, n);
        Fleur.callback(function() {callback();});
      });
    } else {
      callback(Fleur.error(ctx, "XPDY0002"));
    }
  } else {
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
      ctx.env.globalvarresolver.set(ctx, uri, vname, n);
      Fleur.callback(function() {callback();});
    });
  }
};
*/