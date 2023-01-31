"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedPIConstructor = function(children) {
  let r = (children.length === 2 ? this.gen(children[1][1][0], Fleur.SequenceType_anyAtomicType_1).inst : this.inst("emptySequence()").inst) + this.inst("xqx_computedPIConstructor('" + children[0][1][0] + "')").inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_processing_instruction_1
  };
};

Fleur.Context.prototype.xqx_computedPIConstructor = function(name) {
  const prins = new Fleur.ProcessingInstruction();
  prins.nodeName = name;
  prins.data = this.item.data;
  this.item = prins;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.computedPIConstructor] = function(ctx, children, callback) {
  var aval, prins = new Fleur.ProcessingInstruction();
  if (children[0][0] === Fleur.XQueryX.piTarget) {
    prins.nodeName = children[0][1][0];
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
      aval = Fleur.Atomize(n);
      if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
        Fleur.callback(function() {callback(aval);});
      } else {
        prins.data = aval.data;
        Fleur.callback(function() {callback(prins);});
      }
    });
  } else {
    Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
      var aname = Fleur.Atomize(n);
      if (aname.nodeType !== Fleur.Node.TEXT_NODE) {
        Fleur.callback(function() {callback(aname);});
      } else {
        prins.nodeName = aname.data;
        Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
          aval = Fleur.Atomize(n);
          if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
            Fleur.callback(function() {callback(aval);});
          } else {
            prins.data = aval.data;
            Fleur.callback(function() {callback(prins);});
          }
        });
      }
    });
  }
};
*/