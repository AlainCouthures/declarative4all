"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_mapConstructorEntry = function(children) {
  let r = this.gen(children[1][1][0], Fleur.SequenceType_item_0n).inst;
  r += this.gen(children[0][1][0], Fleur.SequenceType_string_1).inst;
  r += this.inst("xqx_mapConstructorEntry()").inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_entry_1
  };
};

Fleur.Context.prototype.xqx_mapConstructorEntry = function() {
  const evalue = this.itemstack.pop();
  const ekey = this.item;
  const entry = new Fleur.Entry();
  const localName = ekey.data;
  entry.nodeName = localName;
  entry.localName = localName;
  entry.prefix = null;
  entry.namespaceURI = null;
  entry.appendChild(evalue);
  this.item = entry;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.mapConstructorEntry] = function(ctx, children, callback) {
  var entry = new Fleur.Entry();
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var a = Fleur.Atomize(n);
    if (a.nodeType !== Fleur.Node.TEXT_NODE) {
      Fleur.callback(function() {callback(a);});
    } else {
      entry.nodeName = a.data;
      entry.namespaceURI = null;
      entry.localName = a.data;
      Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
        if (n === Fleur.EmptySequence) {
          Fleur.callback(function() {callback(Fleur.EmptySequence);});
        } else {
          if (n.nodeType === Fleur.Node.ENTRY_NODE) {
            n = n.cloneNode(true).childNodes[0];
          }
          entry.appendChild(n);
          Fleur.callback(function() {callback(entry);});
        }
      });
    }
  });
};
*/