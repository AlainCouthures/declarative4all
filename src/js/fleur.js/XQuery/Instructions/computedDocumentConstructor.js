"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedDocumentConstructor = function(children) {
  let r = (children.length === 1 ? this.gen(children[0][1][0]).inst : this.inst("emptySequence()").inst) + this.inst("xqx_computedDocumentConstructor()").inst;
  return {
    inst: r
  };
};

Fleur.Context.prototype.xqx_computedDocumentConstructor = function() {
  const doc = new Fleur.Document();
  doc.appendContent(this.item, "");
  this.item = doc;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.computedDocumentConstructor] = function(ctx, children, callback) {
  var doc = new Fleur.Document();
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
      n.childNodes.forEach(function(c) {
        doc.appendChild(c);
      });
    } else {
      doc.appendChild(n);
    }
    Fleur.callback(function() {callback(doc);});
  });
};