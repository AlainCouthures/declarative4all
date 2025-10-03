export class varMgr {
  vars = [];
  previous = null;
  globals = 0;
  constructor(vars, previous) {
    this.vars = vars ?? [];
    this.previous = previous;
  }
  clone() {
    return new varMgr(this.vars.map(v => ({ ...v })), this.previous);
  }
  get(vuri, vname) {
    for (let r = this; r; r = r.previous) {
      const match = r.vars.find(v => v.vuri === vuri && v.vname === vname);
      if (match) {
        return match.value;
      }
    }
    xqueryError("XPST0008", null, `$${vuri ? `Q{${vuri}}${vname}` : vname} is undefined`);
  }
  set(vuri, vname, value) {
    this.vars.push({vuri: vuri, vname: vname, value: value});
    return value;
  }
  replace(vuri, vname, value) {
    const match = this.vars.find(v => v.vuri === vuri && v.vname === vname);
    if (match) {
      match.value = value;
    } else {
      xqueryError("XPST0008", null, `$${vuri ? `Q{${vuri}}${vname}` : vname} is undefined`);
    }
  }
}