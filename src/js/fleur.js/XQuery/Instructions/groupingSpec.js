/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.groupingSpec] = function(ctx, children, callback, resarr, groupkeynames) {
  //console.log("groupingSpec");
  var varname = children[0][1][0];
  groupkeynames.push(varname);
  var i = 0;
  var cb = function(n) {
    if (n.nodeType === Fleur.Node.SEQUENCE_NODE && n !== Fleur.EmptySequence) {
      Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
    }
    var a = Fleur.Atomize(n);
    resarr[i].set(ctx, "", varname, a);
    i++;
    if (i !== resarr.length) {
      if (children.length === 1) {
        cb(resarr[i].get(ctx, "", varname));  
      } else {
        ctx.env.varresolver = resarr[i];
        Fleur.XQueryEngine[children[1][1][0][1][0][0]](ctx, children[1][1][0][1][0][1], cb);
      }
    } else {
      Fleur.callback(function() {callback(Fleur.EmptySequence);});
    }
  };
  if (children.length === 1) {
        cb(resarr[i].get(ctx, "", varname));  
  } else {
    ctx.env.varresolver = resarr[0];
    Fleur.XQueryEngine[children[1][1][0][1][0][0]](ctx, children[1][1][0][1][0][1], cb);
  }
};