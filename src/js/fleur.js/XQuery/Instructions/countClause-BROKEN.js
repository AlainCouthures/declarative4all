/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.countClause] = function(ctx, children, callback, resarr) {
  //console.log("countClause ");
  var countname = children[0][1][0][1][0];
  resarr.forEach(function addcount(vmgr, i) {
    var countvalue = new Fleur.Text();
    countvalue.data = String(i + 1);
    countvalue.schemaTypeInfo = Fleur.Type_integer;
    vmgr.set(ctx, "", countname, countvalue);
  });
  Fleur.callback(function() {callback(Fleur.EmptySequence);});
};