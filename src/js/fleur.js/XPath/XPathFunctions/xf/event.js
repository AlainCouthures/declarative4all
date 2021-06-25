"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_event_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Node},
  params_type: [
    {type: Fleur.Type_string}
  ]
};
Fleur.Context.prototype.xf_event_1 = function() {
  for (let i = XsltForms_xmlevents.EventContexts.length - 1; i >= 0 ; i--) {
    const evcontext = XsltForms_xmlevents.EventContexts[i];
    if (evcontext[this.item.data]) {
      this.item.data = evcontext[this.item.data];
      return this;
    }
  }
  this.item.data = "";
  return this;
};