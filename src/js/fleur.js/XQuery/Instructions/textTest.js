/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_textTest = function() {
  return this.inst("xqx_textTest()");
};

Fleur.Context.prototype.xqx_textTest = function() {
  let item = new Fleur.Sequence();
  switch (this.xpathAxis) {
    case Fleur.Context.XPATHAXIS_CHILD:
      this.item.childNodes.forEach(
        it => {
          if (it.nodeType === Fleur.Node.TEXT_NODE) {
            item.appendChild(it);
          }
        }
      );
  }
  this.item = item.singleton();
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.textTest] = function(ctx, children, callback) {
  Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.TEXT_NODE ? Fleur.EmptySequence : ctx._curr);});
};