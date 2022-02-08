"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.varMgr = function(vars, previous) {
  this.vars = vars || [];
  this.previous = previous;
  this.globals = 0;
};
Fleur.varMgr.prototype.clone = function() {
  var vars = [];
  this.vars.forEach(function(v) {
    vars.push({
      vuri: v.vuri,
      vname: v.vname,
      value: v.value
    });
  });
  return new Fleur.varMgr(vars, this.previous);
};
Fleur.varMgr.prototype.get = function(ctx, vuri, vname) {
  var i;
  var r = this;
  do {
    i = r.vars.length;
    while (i) {
      i--;
      if (r.vars[i].vuri === vuri && r.vars[i].vname === vname) {
        //console.log(vname + " eq " + Fleur.Serializer._serializeNodeToXQuery(r.vars[i].value, false, ""));
        return r.vars[i].value;
      }
    }
    r = r.previous;
  } while (r);
  return Fleur.error(ctx, "XPST0008", "$" + (vuri && vuri !== '' ? "Q{" + vuri + "}" + vname : vname) + " is undefined");
};
Fleur.varMgr.prototype.set = function(ctx, vuri, vname, value) {
  //console.log(vname + " := " + Fleur.Serializer._serializeNodeToXQuery(value, false, ""));
  var i;
  var r = this;
  do {
    i = r.vars.length;
    while (i) {
      i--;
      if (r.vars[i].vuri === vuri && r.vars[i].vname === vname) {
        r.vars[i].value = value;
        return value;
      }
    }
    r = r.previous;
  } while (r);
  this.vars.push({vuri: vuri, vname: vname, value: value});
  return value;
};