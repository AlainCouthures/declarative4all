"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_instance$_ids_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_string},
  params_type: []
};
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