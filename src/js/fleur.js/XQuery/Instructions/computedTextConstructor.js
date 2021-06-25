"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedTextConstructor = function(children) {
  return (children.length === 1 ? this.gen(children[0][1][0], Fleur.atomicTypes) : this.inst("emptySequence()")) + this.inst("xqx_computedTextConstructor()");
};

Fleur.Context.prototype.xqx_computedTextConstructor = function() {
  const txt = new Fleur.Text(this.item.data);
  this.item = txt;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.computedTextConstructor] = function(ctx, children, callback) {
  var txt = new Fleur.Text();
  txt.data = "";
  txt.schemaTypeInfo = Fleur.Type_string;
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var a = Fleur.Atomize(n);
    if (a === Fleur.EmptySequence) {
      Fleur.callback(function() {callback(a);});
      return;
    }
    txt.data = a.data;
    txt.schemaTypeInfo = n.schemaTypeInfo;
    Fleur.callback(function() {callback(txt);});
  });
};