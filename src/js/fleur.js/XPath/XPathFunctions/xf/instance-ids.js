"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_instance$_ids_0 = function() {
  this.itemstack.push(this.item);
  const seq = new Fleur.Sequence();
  XsltForms_globals.models.forEach(m => {
    for (let i in m.instances) {
      if (m.instances.hasOwnProperty(i)) {
        seq.appendChild(new Fleur.Text(i));
      }
    }
  });
  this.item = seq.singleton();
  return this;
};

Fleur.XPathFunctions_xf["instance-ids#0"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:instance-ids", Fleur.Context.prototype.xf_instance$_ids_0,
  [], Fleur.SequenceType_string_0n, {dynonly: true});