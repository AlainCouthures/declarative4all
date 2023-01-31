"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedCommentConstructor = function(children) {
  let r = children.length === 1 ? this.gen(children[0][1][0], Fleur.SequenceType_anyAtomicType_1).inst + this.inst("xqx_computedCommentConstructor()").inst: this.inst("emptySequence()").inst;
  return {
    inst: r,
    sequenceType: children.length === 1 ? Fleur.SequenceType_comment_01 : Fleur.SequenceType_empty_sequence
  };
};

Fleur.Context.prototype.xqx_computedCommentConstructor = function() {
  const cmt = new Fleur.Comment();
  cmt.data = this.item.data || "";
  this.item = cmt;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.computedCommentConstructor] = function(ctx, children, callback) {
  var cmt = new Fleur.Comment();
  cmt.data = "";
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    cmt.data = n.data;
    Fleur.callback(function() {callback(cmt);});
  });
};
*/