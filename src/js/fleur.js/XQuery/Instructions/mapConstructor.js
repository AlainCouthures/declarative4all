"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_mapConstructor = function(children) {
  let r = "";
  const transp = this;
  r = children.reduce((inst, child) => inst + transp.gen(child).inst, "");
  r += this.inst("xqx_mapConstructor(" + String(children.length) + ")").inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_map_1
  };
};

Fleur.Context.prototype.xqx_mapConstructor = function(count) {
  const map = new Fleur.Map();
  map.appendContent(this.item, "");
  const args = count !== 0 ? [this.item] : (this.itemstack.push(this.item), []);
  for (let i = 1; i < count; i++) {
    args.push(this.itemstack.pop());
  }
  args.reverse();
  args.forEach(arg => {
    map.setEntryNode(arg);
  });
  this.item = map;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.mapConstructor] = function(ctx, children, callback) {
  var map = new Fleur.Map();
  var i = 0;
  var cb = function(n) {
    if (n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    if (n !== Fleur.EmptySequence) {
      if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
        n.childNodes.forEach(function(e) {
          map.setEntryNode(e);
        });
      } else {
        map.setEntryNode(n);
      }
    }
    i++;
    if (i === children.length) {
      Fleur.callback(function() {callback(map);});
      return;
    }
    Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
  };
  if (children.length !== 0) {
    Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
  } else {
    Fleur.callback(function() {callback(map);});
  }
};
*/