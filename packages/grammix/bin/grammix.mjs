class V {
  constructor(e, t) {
    if (this.nodeType = 2, this.nodeName = t, e) {
      this.namespaceURI = e;
      const s = t.split(":");
      this.prefix = s.length > 1 ? s[0] : "", this.localName = s.length > 1 ? s[1] : s[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = t;
    this.name = t, this.value = "";
  }
  appendChild(e) {
    e && (this.value += e.textContent || "");
  }
}
class me {
  constructor(e, t) {
    this.nodeType = 133, this.URI = e ?? "", this.prefix = t ?? "";
  }
}
class z {
  attributes = [];
  namespaces = [];
  childNodes = [];
  nodeType = 1;
  parentNode = null;
  previousSibling = null;
  nextSibling = null;
  constructor(e, t) {
    if (this.nodeName = t, e) {
      this.namespaceURI = e;
      const s = t.split(":");
      this.prefix = s.length > 1 ? s[0] : "", this.localName = s.length > 1 ? s[1] : s[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = t;
  }
  appendChild(e) {
    e && (e.previousSibling = this.childNodes[this.childNodes.length - 1], e.previousSibling && (e.previousSibling.nextSibling = e), this.childNodes.push(e), e.parentNode = this);
  }
  removeChild(e) {
    e.previousSibling && (e.previousSibling.nextSibling = e.nextSibling), this.childNodes = this.childNodes.filter((t) => t !== e);
  }
  getAttribute(e) {
    for (let t = 0, s = this.attributes.length; t < s; t++)
      if (this.attributes[t].name === e)
        return this.attributes[t].value;
    return "";
  }
  getAttributeNS(e, t) {
    const s = t.split(":"), i = s.length > 1 ? s[1] : s[0];
    for (let a = 0, r = this.attributes.length; a < r; a++)
      if (this.attributes[a].namespaceURI === e && this.attributes[a].localName === i)
        return this.attributes[a].value;
    return "";
  }
  setAttributeNS(e, t, s) {
    if (e === "http://www.w3.org/2000/xmlns/")
      this.setNamespace(s, t === "xmlns" ? "" : t.slice(6));
    else {
      const i = t.split(":"), a = i.length > 1 ? i[1] : i[0];
      for (let c = 0, _ = this.attributes.length; c < _; c++)
        if (this.attributes[c].namespaceURI === e && this.attributes[c].localName === a) {
          this.attributes[c].value = s;
          return;
        }
      const r = new V(e, t);
      r.value = s, this.attributes.push(r), r.ownerElement = this;
    }
  }
  setAttribute(e, t) {
    this.setAttributeNS("", e, t);
  }
  setAttributeNodeNS(e) {
    for (let t = 0, s = this.attributes.length; t < s; t++)
      if (this.attributes[t].namespaceURI === e.namespaceURI && this.attributes[t].localName === e.localName) {
        this.attributes[t] = e;
        return;
      }
    this.attributes.push(e), e.ownerElement = this;
  }
  setAttributeNode(e) {
    this.setAttributeNodeNS(e);
  }
  removeAttribute(e) {
    this.attributes = this.attributes.filter((t) => t.name !== e);
  }
  setNamespace(e, t) {
    const s = new me(e, t);
    this.namespaces.push(s);
  }
}
class le {
  constructor(e) {
    this.nodeType = 3, this.textContent = e ?? "";
  }
}
class Ne {
  constructor() {
    this.nodeType = 132, this.childNodes = [];
  }
  appendChild(e) {
    e && this.childNodes.push(e);
  }
}
const ce = (m) => m.replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[e]), ge = (m) => m.replace(/[&<]/g, (e) => ({ "&": "&amp;", "<": "&lt;" })[e]);
class ue {
  textContent = "";
  attributes = [];
  constructor(e, t) {
    if (this.nodeName = t, e) {
      this.namespaceURI = e;
      const s = t.split(":");
      this.prefix = s.length > 1 ? s[0] : "", this.localName = s.length > 1 ? s[1] : s[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = t;
  }
  toParentNode() {
    if (this.nodeName) {
      let e = "<" + this.nodeName;
      if (this.attributes.length !== 0) {
        const t = [], s = [];
        this.attributes.forEach((i) => {
          i.name === "xmlns" ? t.unshift(i) : i.name.startsWith("xmlns:") ? t.push(i) : s.push(i);
        }), t.sort((i, a) => i.name === "xmlns" ? -1 : a.name === "xmlns" ? 1 : i.name.localeCompare(a.name)), s.sort((i, a) => {
          const r = i.name.split(":"), c = a.name.split(":"), _ = r.length > 1 ? r[0] : "", f = r.length > 1 ? r[1] : r[0], n = c.length > 1 ? c[0] : "", d = c.length > 1 ? c[1] : c[0];
          return _ < n ? -1 : _ > n ? 1 : f.localeCompare(d);
        });
        for (let i = 0, a = t.length; i < a; i++)
          e += " " + t[i].name + '="' + ce(t[i].value) + '"';
        for (let i = 0, a = s.length; i < a; i++)
          e += " " + s[i].name + '="' + ce(s[i].value) + '"';
      }
      return this.textContent ? e += ">" + this.textContent + (this.ownerDocument.indent && this.textContent.startsWith(`
`) ? `
` : "") + "</" + this.nodeName + ">" : e += "/>", e;
    }
    return this.textContent;
  }
  appendChild(e) {
    const t = e.toParentNode(this);
    if (this.ownerDocument.indent) {
      const s = " ".repeat(this.ownerDocument.indent);
      t.startsWith("<") || this.textContent ? (this.textContent && !this.textContent.startsWith(`
`) && (this.textContent = `
` + s + this.textContent), this.textContent += `
` + s + t.replace(/\n/g, `
` + s)) : this.textContent += t;
    } else
      this.textContent += t;
  }
  setAttributeNS(e, t, s) {
    const i = t.split(":"), a = i.length > 1 ? i[1] : i[0];
    for (let c = 0, _ = this.attributes.length; c < _; c++)
      if (this.attributes[c].namespaceURI === e && this.attributes[c].localName === a) {
        this.attributes[c].value = s;
        return;
      }
    const r = new V(e, t);
    r.value = s, this.attributes.push(r);
  }
  setAttributeNodeNS(e) {
    this.attributes.push(e);
  }
}
class _e {
  constructor(e, t) {
    if (this.nodeName = t, e) {
      this.namespaceURI = e;
      const s = t.split(":");
      this.prefix = s.length > 1 ? s[0] : "", this.localName = s.length > 1 ? s[1] : s[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = t;
    this.name = t, this.value = "";
  }
  appendChild(e) {
    e && (this.value += e.textContent || "");
  }
}
class be {
  constructor(e) {
    this.textContent = ge(e);
  }
  toParentNode() {
    return this.textContent;
  }
}
class B {
  constructor(e) {
    this.textContent = "", this.indent = e;
  }
  createElement(e) {
    const t = new ue("", e);
    return t.ownerDocument = this, t;
  }
  createElementNS(e, t) {
    const s = new ue(e, t);
    return s.ownerDocument = this, s;
  }
  createAttribute(e) {
    return new _e("", e);
  }
  createAttributeNS(e, t) {
    return new _e(e, t);
  }
  createTextNode(e) {
    return new be(e);
  }
  appendChild(e) {
    this.textContent = `<?xml version="1.0" encoding="UTF-8"?>
` + e.toParentNode();
  }
}
class he {
  textContent = "";
  attributes = "";
  childNodes = "";
  ownerDocument = null;
  constructor(e, t, s) {
    const [i, a] = e && t.includes(":") ? t.split(":") : [null, t];
    this.textContent = [
      '"nodeType": 1,',
      `"nodeName": "${t}",`,
      `"namespaceURI": ${JSON.stringify(e || null)},`,
      `"prefix": ${JSON.stringify(i)},`,
      `"localName": "${a}"`
    ].join(s ? `
` : " ");
  }
  setAttributeNS(e, t, s) {
    const [i, a] = e && t.includes(":") ? t.split(":") : [null, t], { indent: r } = this.ownerDocument;
    let c = [
      '"nodeType": 2,',
      `"nodeName": "${t}",`,
      `"namespaceURI": ${JSON.stringify(e || null)},`,
      `"prefix": ${JSON.stringify(i)},`,
      `"localName": "${a}",`,
      `"value": ${JSON.stringify(s)}`
    ].join(r ? `
` : " ");
    if (r) {
      const _ = " ".repeat(r);
      c = `
${_}${c.replaceAll(`
`, `
${_}`)}
${_}`, this.attributes += `${this.attributes ? `,
` : `
`}${_}{${c}}`;
    } else
      this.attributes += `${this.attributes ? ", " : ""}{${c}}`;
  }
  appendChild(e) {
    const t = e.toParentNode(this), { indent: s } = this.ownerDocument;
    if (s) {
      const i = " ".repeat(this.ownerDocument.indent);
      this.childNodes += `${this.childNodes ? `,
` : `
`}${i}${t.replaceAll(`
`, `
${i}`)}`;
    } else
      this.childNodes += `${this.childNodes ? ", " : ""}${t}`;
  }
  toParentNode() {
    const { indent: e } = this.ownerDocument, t = e ? `
` : "";
    let s = [
      `${t}${this.textContent},`,
      `"attributes": [${this.attributes ? this.attributes + t : ""}],`,
      `"childNodes": [${this.childNodes ? this.childNodes + t : ""}]`
    ].join(e ? `
` : " ");
    if (e) {
      const i = " ".repeat(e);
      s = s.replaceAll(`
`, `
${i}`);
    }
    return `{${s}${t}}`;
  }
}
const Ae = (m) => m.split("-").map(([e, ...t]) => e.toUpperCase() + t.join("")).join(""), U = (m) => m.includes('"') ? m.includes("'") ? `"${m.replaceAll('"', '""')}"` : `'${m}'` : `"${m}"`, Te = (m) => m.includes("'") ? m.includes('"') ? `'${m.replaceAll("'", "\\'").replace(/\r?\n/g, "\\n")}'` : `"${m.replace(/\r?\n/g, "\\n")}"` : `'${m.replace(/\r?\n/g, "\\n")}'`;
class Re {
  textContent = "";
  ownerDocument = null;
  constructor(e, t) {
    this.textContent = `"nodeType": 3,${t ? `
` : " "}"textContent": ${Te(e)}`;
  }
  toParentNode() {
    const { indent: e } = this.ownerDocument, t = e ? `
` : "";
    let s = `${t}${this.textContent}`;
    if (e) {
      const i = " ".repeat(e);
      s = s.replaceAll(`
`, `
${i}`);
    }
    return `{${s}${t}}`;
  }
}
class pe {
  textContent = "";
  indent = 0;
  constructor(e) {
    this.indent = e;
  }
  createElement(e) {
    const t = new he("", e, this.indent);
    return t.ownerDocument = this, t;
  }
  createElementNS(e, t) {
    const s = new he(e, t, this.indent);
    return s.ownerDocument = this, s;
  }
  createTextNode(e) {
    const t = new Re(e, this.indent);
    return t.ownerDocument = this, t;
  }
  appendChild(e) {
    this.textContent = e.toParentNode();
  }
}
function Se(m, e) {
  const t = {
    amp: "&",
    lt: "<",
    gt: ">",
    apos: "'",
    quot: '"'
  }, [s, ...i] = e.split("&");
  return i.reduce((a, r) => {
    const [c, ..._] = r.split(";"), f = c.startsWith("#") ? String.fromCharCode(c[1] === "x" ? parseInt(c.slice(2), 16) : parseInt(c.slice(1), 10)) : t[c] ?? m?.getEntity(c);
    return a + (f ?? `&${c};`) + _.join(";");
  }, s);
}
function K(m, e, t) {
  const s = t.substring(0, e).split(`
`).length, i = e - t.lastIndexOf(`
`, e - 1) + 1;
  return `Error: ${m} at line ${s}, column ${i}`;
}
function Q(m) {
  if (typeof m != "string" || !m)
    return !1;
  const e = m.indexOf(":");
  if (e !== -1) {
    if (e === 0 || e === m.length - 1 || m.indexOf(":", e + 1) !== -1)
      return !1;
    const r = m.substring(0, e), c = m.substring(e + 1);
    return Q(r) && Q(c);
  }
  const t = (r) => r >= 65 && r <= 90 || r === 95 || r >= 97 && r <= 122 || r >= 192 && r <= 214 || r >= 216 && r <= 246 || r >= 248 && r <= 767 || r >= 880 && r <= 893 || r >= 895 && r <= 8191 || r >= 8204 && r <= 8205 || r >= 8304 && r <= 8591 || r >= 11264 && r <= 12271 || r >= 12289 && r <= 55295 || r >= 63744 && r <= 64975 || r >= 65008 && r <= 65533 || r >= 65536 && r <= 983039, s = (r) => t(r) || r === 45 || r === 46 || r >= 48 && r <= 57 || r === 183 || r >= 768 && r <= 879 || r >= 8255 && r <= 8256;
  let i = 0, a = m.codePointAt(i);
  if (!t(a))
    return !1;
  for (i += a > 65535 ? 2 : 1; i < m.length; ) {
    if (a = m.codePointAt(i), !s(a))
      return !1;
    i += a > 65535 ? 2 : 1;
  }
  return !0;
}
function de(m) {
  return Q(m) && !/^[Xx][Mm][Ll]/.test(m);
}
const se = 0;
function fe(m, e, t, s) {
  t = t ?? se;
  for (var i, a, r, c, _, f, n = 0, d = e.length, x, o, l, p, h = [], E = m.ownerDocument || m, O = m, A, N, u, T = ` 	
\r?`, D = ` 	
\r[>`, $ = ` 	
\r>`, k = ` 	
\r/>`, G = ` 	
\r=/<>'"`, R = ` 	
\r`, C, I = { xmlns: "http://www.w3.org/2000/xmlns/", xml: "http://www.w3.org/XML/1998/namespace" }, L = {}, y, g, J, Y, F, X, P, te, v; n !== d; ) {
    for (r = "", u = e.charAt(n); u !== "<" && n !== d; ) {
      if (u === "&") {
        for (u = e.charAt(++n), c = n, _ = ""; u !== ";" && n !== d; )
          _ += u, u = e.charAt(++n);
        if (n === d)
          break;
        switch (P = "", _) {
          case "amp":
            r += "&";
            break;
          case "lt":
            r += "<";
            break;
          case "gt":
            r += ">";
            break;
          case "apos":
            r += "'";
            break;
          case "quot":
            r += '"';
            break;
          default:
            _.charAt(0) === "#" ? r += String.fromCharCode(parseInt(_.charAt(1).toLowerCase() === "x" ? "0" + _.substring(1).toLowerCase() : _.substring(1), _.charAt(1).toLowerCase() === "x" ? 16 : 10)) : E.doctype && (P = E.doctype.getEntity(_), e = e.substring(0, c - 1) + P + e.substring(n + 1), n = c - 2, d = e.length);
        }
      } else
        r += u;
      u = e.charAt(++n);
    }
    if (r.trim() !== "" && O.appendChild(E.createTextNode(r.trim())), n === d)
      break;
    if (n++, e.charAt(n) === "!") {
      if (n++, e.substr(n, 2) === "--") {
        if (n += 2, f = e.indexOf("-->", n), f !== n) {
          for (f === -1 && (f = d), r = "", i = n; i < f; )
            r += e.charAt(i++);
          if (O.appendChild(E.createComment(r)), f === d)
            break;
          n = f;
        }
        n += 3;
      } else if (e.substr(n, 7) === "[CDATA[") {
        if (n += 7, f = e.indexOf("]]>", n), f !== n) {
          for (f === -1 && (f = d), r = "", i = n; i < f; )
            r += e.charAt(i++);
          if (O.appendChild(E.createCDATASection(r)), f === d)
            break;
          n = f;
        }
        n += 3;
      } else if (e.substr(n, 7) === "DOCTYPE") {
        for (n += 7, f = e.indexOf(">", n); R.indexOf(u) !== -1; )
          u = e.charAt(n++);
        for (x = ""; D.indexOf(u) === -1 && n !== d; )
          x += u, u = e.charAt(n++);
        for (; R.indexOf(u) !== -1; )
          u = e.charAt(n++);
        for (Y = ""; D.indexOf(u) === -1 && n !== d; )
          Y += u, u = e.charAt(n++);
        if (Y === "PUBLIC" || Y === "SYSTEM") {
          if (Y === "PUBLIC") {
            for (; R.indexOf(u) !== -1; )
              u = e.charAt(n++);
            for (F = "", i = n, a = Math.min(f - 1, e.indexOf(u, n)); i < a; )
              F += e.charAt(i++);
            n += F.length + 1, u = e.charAt(n++);
          }
          for (; R.indexOf(u) !== -1; )
            u = e.charAt(n++);
          for (X = "", i = n, a = Math.min(f - 1, e.indexOf(u, n)); i < a; )
            X += e.charAt(i++);
          for (n += X.length + 1, u = e.charAt(n++); R.indexOf(u) !== -1; )
            u = e.charAt(n++);
        } else
          F = X = null;
        if (E.implementation && (O.appendChild(E.doctype = E.implementation.createDocumentType(x, F, X)), E.doctype.ownerDocument = E), u === "[") {
          for (f = e.indexOf("]", n), u = e.charAt(n++); u !== "]" && n < d; ) {
            for (; R.indexOf(u) !== -1; )
              u = e.charAt(n++);
            if (u === "]")
              break;
            if (e.substr(n, 7) === "!ENTITY") {
              for (n += 7, u = e.charAt(n++); R.indexOf(u) !== -1; )
                u = e.charAt(n++);
              if (u === "%")
                for (u = e.charAt(n++); R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
              for (x = ""; D.indexOf(u) === -1; )
                x += u, u = e.charAt(n++);
              for (; R.indexOf(u) !== -1; )
                u = e.charAt(n++);
              if (e.substr(n - 1, 6) === "SYSTEM")
                for (n += 5, u = e.charAt(n++); R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
              else if (e.substr(n - 1, 6) === "PUBLIC") {
                for (n += 5, u = e.charAt(n++); R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
                for (; D.indexOf(u) === -1 && n !== d; )
                  u = e.charAt(n++);
                for (; R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
              }
              for (P = "", i = n, a = Math.min(f - 1, e.indexOf(u, n)); i < a; )
                P += e.charAt(i++);
              n += P.length + 1, u = e.charAt(n++), E.doctype.setEntity(x, P);
            } else if (e.substr(n, 9) === "!NOTATION") {
              for (n += 9, u = e.charAt(n++); R.indexOf(u) !== -1; )
                u = e.charAt(n++);
              for (x = ""; D.indexOf(u) === -1 && n !== d; )
                x += u, u = e.charAt(n++);
              for (; R.indexOf(u) !== -1; )
                u = e.charAt(n++);
              if (e.substr(n - 1, 6) === "SYSTEM")
                for (n += 5, u = e.charAt(n++); R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
              else if (e.substr(n - 1, 6) === "PUBLIC") {
                for (n += 5, u = e.charAt(n++); R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
                for (; D.indexOf(u) === -1 && n !== d; )
                  u = e.charAt(n++);
                for (; R.indexOf(u) !== -1; )
                  u = e.charAt(n++);
              }
              if (u === '"' || u === "'") {
                for (te = "", i = n, a = Math.min(f - 1, e.indexOf(u, n)); i < a; )
                  te += e.charAt(i++);
                n += te.length + 1, u = e.charAt(n++);
              }
            }
            n = e.indexOf(">", n - 1) + 1, u = e.charAt(n++);
          }
          f = e.indexOf(">", n);
        }
        if (f !== n) {
          if (f === -1 && (f = d), f === d)
            break;
          n = f;
        }
        n++;
      }
    } else if (e.charAt(n) === "?") {
      for (n++, u = e.charAt(n++), x = ""; T.indexOf(u) === -1 && n !== d; )
        x += u, u = e.charAt(n++);
      if (f = e.indexOf("?>", n - 1), f === -1 && (f = d), x === "xml") {
        if (n != 6)
          throw new Error(K("Invalid position for XML declaration", n - 7, e));
        e.charCodeAt(f + 2) === 13 && f++, e.charCodeAt(f + 2) === 10 && f++;
      } else if (x !== "") {
        for (r = "", i = n; i < f; )
          r += e.charAt(i++);
        O.appendChild(E.createProcessingInstruction(x, f === n - 1 ? "" : r));
      }
      if (f === d)
        break;
      n = f + 2;
    } else if (e.charAt(n) === "/") {
      for (n++, u = e.charAt(n++), x = ""; $.indexOf(u) === -1 && n !== d; )
        x += u, u = e.charAt(n++);
      if (!de(x))
        throw new Error(K("Invalid XML element name", n - 2 - x.length, e));
      if (x === A) {
        C = h.pop(), I = {};
        for (g in C.namespaces)
          Object.prototype.hasOwnProperty.call(C.namespaces, g) && (I[g] = C.namespaces[g]);
        O = C.node, A = C.nodeName;
      } else {
        if (t === se)
          throw new Error(K("Not well-formed XML", n - 2 - x.length, e));
        for (; h.length !== 0; )
          if (C = h.pop(), x === C.node.nodeName) {
            I = {};
            for (g in C.namespaces)
              Object.prototype.hasOwnProperty.call(C.namespaces, g) && (I[g] = C.namespaces[g]);
            O = C.node, A = C.nodeName;
            break;
          }
      }
      if (n = e.indexOf(">", n - 1) + 1, n === 0)
        break;
    } else {
      for (u = e.charAt(n++), x = ""; k.indexOf(u) === -1 && n !== d; )
        x += u, u = e.charAt(n++);
      if (f = e.indexOf(">", n - 1), x !== "") {
        if (!de(x))
          throw new Error(K("Invalid XML element name", n - 2 - x.length, e));
        L = {};
        for (g in I)
          Object.prototype.hasOwnProperty.call(I, g) && (L[g] = I[g]);
        for (p = {}; n !== d; ) {
          for (; R.indexOf(u) !== -1; )
            u = e.charAt(n++);
          if (G.indexOf(u) !== -1 || n === d)
            break;
          for (o = ""; G.indexOf(u) === -1 && n !== d; )
            o += u, u = e.charAt(n++);
          if (o !== "") {
            if (o !== "xmlns" && !Q(o))
              throw new Error(K("Invalid XML attribute name", n - 2 - o.length, e));
            for (; R.indexOf(u) !== -1 && n !== d; )
              u = e.charAt(n++);
            if (u === "=") {
              for (u = e.charAt(n++); R.indexOf(u) !== -1 && n !== d; )
                u = e.charAt(n++);
              if (l = "", u === "'" || u === '"') {
                l = "", i = n;
                const oe = e.indexOf(u, n);
                if (oe !== -1) {
                  for (a = Math.min(f - 1, oe); i < a; )
                    l += e.charAt(i++);
                  n += l.length + 1, u = e.charAt(n++);
                } else
                  n = d;
              } else
                for (; k.indexOf(u) === -1 && n !== d; )
                  l += u, u = e.charAt(n++);
            } else
              l = o;
            y = o.indexOf(":"), g = y !== -1 ? o.substring(0, y) : "", J = y !== -1 ? o.substring(y + 1) : o, g === "xmlns" ? L[J] = l : g === "" && J === "xmlns" && (L[""] = l), p[g] || (p[g] = {}), p[g][J] = l;
          }
        }
        y = x.indexOf(":"), v = L[y !== -1 ? x.substring(0, y) : ""], N = E.createElementNS(v, x), E._elementsByTagName && (E._elementsByTagName[v] ? E._elementsByTagName[v][x] ? E._elementsByTagName[v][x].push(N) : E._elementsByTagName[v][x] = [N] : (E._elementsByTagName[v] = {}, E._elementsByTagName[v][x] = [N]));
        for (g in p)
          if (Object.prototype.hasOwnProperty.call(p, g)) {
            if (g !== "" && !(g in L))
              throw new Error(K(`Prefix '${g}' not declared`, n - 2 - o.length, e));
            for (o in p[g])
              Object.prototype.hasOwnProperty.call(p[g], o) && (l = Se(E.doctype, p[g][o]), E._elementById && o === "id" && (g === "" || g === "xml") && (E._elementById[l] = N), N.setAttributeNS(g !== "" ? L[g] : o === "xmlns" ? "http://www.w3.org/2000/xmlns/" : null, g !== "" ? g + ":" + o : o, l));
          }
        if (O.appendChild(N), e.charAt(n - 1) !== "/") {
          h.push({ node: O, nodeName: A, namespaces: I }), O = N, A = x, I = {};
          for (g in L)
            Object.prototype.hasOwnProperty.call(L, g) && (I[g] = L[g]);
        }
      }
      if (n = f + 1, n === 0)
        break;
    }
  }
  if (h.length !== 0 && t === se)
    throw new Error(K("Not well-formed XML", n - 2 - x.length, e));
}
const S = (m, e) => {
  const t = e.ownerDocument ?? e;
  switch (m.nodeType) {
    case 1: {
      const s = t.createElementNS(m.namespaceURI, m.nodeName);
      if (m.namespaces)
        for (const i of m.namespaces)
          s.setAttributeNS("http://www.w3.org/2000/xmlns/", i.prefix ? `xmlns:${i.prefix}` : "xmlns", i.URI);
      for (const i of m.attributes)
        S(i, s);
      for (const i of m.childNodes)
        S(i, s);
      e.appendChild(s);
      break;
    }
    case 2: {
      e.setAttributeNS(m.namespaceURI, m.name, m.value);
      break;
    }
    case 3: {
      e.appendChild(t.createTextNode(m.textContent));
      break;
    }
  }
}, Oe = {
  entities: {
    quot: '"',
    amp: "&",
    apos: "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
    iexcl: "¡",
    cent: "¢",
    pound: "£",
    curren: "¤",
    yen: "¥",
    brvbar: "¦",
    sect: "§",
    uml: "¨",
    copy: "©",
    ordf: "ª",
    laquo: "«",
    not: "¬",
    shy: "­",
    reg: "®",
    macr: "¯",
    deg: "°",
    plusmn: "±",
    sup2: "²",
    sup3: "³",
    acute: "´",
    micro: "µ",
    para: "¶",
    middot: "·",
    cedil: "¸",
    sup1: "¹",
    ordm: "º",
    raquo: "»",
    frac14: "¼",
    frac12: "½",
    frac34: "¾",
    iquest: "¿",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Auml: "Ä",
    Aring: "Å",
    AElig: "Æ",
    Ccedil: "Ç",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Euml: "Ë",
    Igrave: "Ì",
    Iacute: "Í",
    Icirc: "Î",
    Iuml: "Ï",
    ETH: "Ð",
    Ntilde: "Ñ",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ouml: "Ö",
    times: "×",
    Oslash: "Ø",
    Ugrave: "Ù",
    Uacute: "Ú",
    Ucirc: "Û",
    Uuml: "Ü",
    Yacute: "Ý",
    THORN: "Þ",
    szlig: "ß",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    auml: "ä",
    aring: "å",
    aelig: "æ",
    ccedil: "ç",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    euml: "ë",
    igrave: "ì",
    iacute: "í",
    icirc: "î",
    iuml: "ï",
    eth: "ð",
    ntilde: "ñ",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ouml: "ö",
    divide: "÷",
    oslash: "ø",
    ugrave: "ù",
    uacute: "ú",
    ucirc: "û",
    uuml: "ü",
    yacute: "ý",
    thorn: "þ",
    yuml: "ÿ",
    OElig: "Œ",
    oelig: "œ",
    Scaron: "Š",
    scaron: "š",
    Yuml: "Ÿ",
    fnof: "ƒ",
    circ: "ˆ",
    tilde: "˜",
    Alpha: "Α",
    Beta: "Β",
    Gamma: "Γ",
    Delta: "Δ",
    Epsilon: "Ε",
    Zeta: "Ζ",
    Eta: "Η",
    Theta: "Θ",
    Iota: "Ι",
    Kappa: "Κ",
    Lambda: "Λ",
    Mu: "Μ",
    Nu: "Ν",
    Xi: "Ξ",
    Omicron: "Ο",
    Pi: "Π",
    Rho: "Ρ",
    Sigma: "Σ",
    Tau: "Τ",
    Upsilon: "Υ",
    Phi: "Φ",
    Chi: "Χ",
    Psi: "Ψ",
    Omega: "Ω",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
    zeta: "ζ",
    eta: "η",
    theta: "θ",
    iota: "ι",
    kappa: "κ",
    lambda: "λ",
    mu: "μ",
    nu: "ν",
    xi: "ξ",
    omicron: "ο",
    pi: "π",
    rho: "ρ",
    sigmaf: "ς",
    sigma: "σ",
    tau: "τ",
    upsilon: "υ",
    phi: "φ",
    chi: "χ",
    psi: "ψ",
    omega: "ω",
    thetasym: "ϑ",
    upsih: "ϒ",
    piv: "ϖ",
    ensp: " ",
    emsp: " ",
    thinsp: " ",
    zwnj: "‌",
    zwj: "‍",
    lrm: "‎",
    rlm: "‏",
    ndash: "–",
    mdash: "—",
    lsquo: "‘",
    rsquo: "’",
    sbquo: "‚",
    ldquo: "“",
    rdquo: "”",
    bdquo: "„",
    dagger: "†",
    Dagger: "‡",
    bull: "•",
    hellip: "…",
    permil: "‰",
    prime: "′",
    Prime: "″",
    lsaquo: "‹",
    rsaquo: "›",
    oline: "‾",
    frasl: "⁄",
    euro: "€",
    image: "ℑ",
    weierp: "℘",
    real: "ℜ",
    trade: "™",
    alefsym: "ℵ",
    larr: "←",
    uarr: "↑",
    rarr: "→",
    darr: "↓",
    harr: "↔",
    crarr: "↵",
    lArr: "⇐",
    uArr: "⇑",
    rArr: "⇒",
    dArr: "⇓",
    hArr: "⇔",
    forall: "∀",
    part: "∂",
    exist: "∃",
    empty: "∅",
    nabla: "∇",
    isin: "∈",
    notin: "∉",
    ni: "∋",
    prod: "∏",
    sum: "∑",
    minus: "−",
    lowast: "∗",
    radic: "√",
    prop: "∝",
    infin: "∞",
    ang: "∠",
    and: "∧",
    or: "∨",
    cap: "∩",
    cup: "∪",
    int: "∫",
    there4: "∴",
    sim: "∼",
    cong: "≅",
    asymp: "≈",
    ne: "≠",
    equiv: "≡",
    le: "≤",
    ge: "≥",
    sub: "⊂",
    sup: "⊃",
    nsub: "⊄",
    sube: "⊆",
    supe: "⊇",
    oplus: "⊕",
    otimes: "⊗",
    perp: "⊥",
    sdot: "⋅",
    lceil: "⌈",
    rceil: "⌉",
    lfloor: "⌊;",
    rfloor: "⌋",
    lang: "〈",
    rang: "〉",
    loz: "◊",
    spades: "♠",
    clubs: "♣",
    hearts: "♥",
    diams: "♦"
  },
  getEntity: function(m) {
    return this.entities[m];
  }
};
class q {
  doctype = Oe;
  documentElement = null;
  childNodes = [];
  nodeType = 0;
  constructor(e) {
    e && this.fromString(e);
  }
  createElement(e) {
    const t = new z("", e);
    return t.ownerDocument = this, t;
  }
  createElementNS(e, t) {
    const s = new z(e, t);
    return s.ownerDocument = this, s;
  }
  createAttribute(e) {
    return new V("", e);
  }
  createAttributeNS(e, t) {
    return new V(e, t);
  }
  createNamespace(e, t) {
    return new me(e, t);
  }
  createTextNode(e) {
    return new le(e);
  }
  createComment() {
    return null;
  }
  createProcessingInstruction() {
    return null;
  }
  createCDATASection(e) {
    return new le(e);
  }
  createArray() {
    return new Ne();
  }
  appendChild(e) {
    e && e.nodeType === 1 && (this.documentElement = e), this.childNodes.push(e);
  }
  fromString(e) {
    fe(this, e);
  }
  toString() {
    const e = new B();
    return S(this.documentElement, e), e.textContent;
  }
  toNode(e) {
    return S(this.documentElement, e), e;
  }
  toIndentedString() {
    const e = new B(2);
    return S(this.documentElement, e), e.textContent;
  }
  toJson() {
    const e = new pe();
    return S(this.documentElement, e), e.textContent;
  }
  toIndentedJson() {
    const e = new pe(2);
    return S(this.documentElement, e), e.textContent;
  }
}
const re = (m) => JSON.stringify(
  m,
  (e, t) => t instanceof RegExp ? "__REGEX__" + t.toString().replace(/"/g, "___quote___") + "___REGEXEND___" : t
).replace(/"__REGEX__/g, "").replace(/___REGEXEND___"/g, "").replace(/___quote___/g, '"');
class Me extends q {
  globalNamespaceURI = "";
  globalPrefix = "";
  rules = [];
  normalizingRules = [];
  toArray() {
    return this.rules;
  }
  toJSON() {
    return re(this.rules);
  }
  addNamespace(e, t) {
    this.globalNamespaceURI = e, this.globalPrefix = t;
  }
}
class M {
  textContent = "";
  toParentNode() {
    return this.textContent;
  }
  appendChild(e) {
    this.textContent += e.toParentNode(this);
  }
  setAttributeNS(e, t, s) {
    this[`$$${t}`] = s;
  }
}
class we extends M {
  appendChild(e) {
    this.textContent += (e instanceof xe ? " " : this.textContent && `
`) + e.toParentNode(this);
  }
}
class xe extends M {
  toParentNode() {
    return `{${this.textContent}}`;
  }
}
class De extends M {
  toParentNode() {
    return `ixml ${this.textContent}.`;
  }
  appendChild(e) {
    this.textContent += (this.textContent && " ") + e.toParentNode(this);
  }
}
class Ce extends M {
  toParentNode() {
    return `version ${U(this.$$string)}`;
  }
}
class $e extends M {
  toParentNode() {
    return `${this.$$mark ?? ""}${this.$$name}${this.$$alias ? `>${this.$$alias}` : ""}: ${this.textContent}.`;
  }
  appendChild(e) {
    this.textContent += (this.textContent && "; ") + e.toParentNode(this);
  }
}
class Ie extends M {
  toParentNode() {
    return `(${this.textContent})`;
  }
  appendChild(e) {
    this.textContent += (this.textContent && "; ") + e.toParentNode(this);
  }
}
class Le extends M {
  appendChild(e) {
    this.textContent += (this.textContent && ", ") + e.toParentNode(this);
  }
}
class ke extends M {
  toParentNode() {
    return `${this.textContent}?`;
  }
}
class ye extends M {
  constructor() {
    super(), this.hasSeparator = !1;
  }
  toParentNode() {
    return this.textContent + (this.hasSeparator ? "" : "*");
  }
  appendChild(e) {
    this.textContent += (e instanceof j ? "**" : "") + e.toParentNode(this), this.hasSeparator = e instanceof j;
  }
}
class ve extends M {
  constructor() {
    super(), this.hasSeparator = !1;
  }
  toParentNode() {
    return this.textContent + (this.hasSeparator ? "" : "+");
  }
  appendChild(e) {
    this.textContent += (e instanceof j ? "++" : "") + e.toParentNode(this), this.hasSeparator = e instanceof j;
  }
}
class j extends M {
}
class Be extends M {
  toParentNode() {
    return (this.$$tmark ?? "") + (this.$$string ? U(this.$$string) : `#${this.$$hex}`);
  }
}
class Pe extends M {
  toParentNode() {
    return `${this.$$tmark ?? ""}[${this.textContent}]`;
  }
  appendChild(e) {
    this.textContent += (this.textContent && "; ") + e.toParentNode(this);
  }
}
class Ke extends M {
  toParentNode() {
    return `${this.$$tmark ?? ""}~[${this.textContent}]`;
  }
  appendChild(e) {
    this.textContent += (this.textContent && "; ") + e.toParentNode(this);
  }
}
class Ue extends M {
  toParentNode() {
    return this.$$string ? U(this.$$string) : this.$$hex ? `#${this.$$hex}` : this.$$from ? `${this.$$from.startsWith("#") ? this.$$from : U(this.$$from)}-${this.$$to.startsWith("#") ? this.$$to : U(this.$$to)}` : this.$$code;
  }
}
class Ye extends M {
  toParentNode() {
    return `${this.$$mark ?? ""}${this.$$name}${this.$$alias ? `>${this.$$alias}` : ""}`;
  }
}
class Fe extends M {
  toParentNode() {
    return `+${this.$$string ? U(this.$$string) : this.$$hex}`;
  }
}
const Xe = {
  IXmlElementIxml: we,
  IXmlElementComment: xe,
  IXmlElementProlog: De,
  IXmlElementVersion: Ce,
  IXmlElementRule: $e,
  IXmlElementAlts: Ie,
  IXmlElementAlt: Le,
  IXmlElementOption: ke,
  IXmlElementRepeat0: ye,
  IXmlElementRepeat1: ve,
  IXmlElementSep: j,
  IXmlElementLiteral: Be,
  IXmlElementInclusion: Pe,
  IXmlElementExclusion: Ke,
  IXmlElementMember: Ue,
  IXmlElementNonterminal: Ye,
  IXmlElementInsertion: Fe
};
class ze {
  textContent = "";
  constructor(e) {
    this.textContent = e ?? "";
  }
  toParentNode() {
    return this.textContent;
  }
}
class ie {
  textContent = "";
  createElementNS(e, t) {
    const s = new Xe[`IXmlElement${Ae(t.substring(t.indexOf(":") + 1))}`]();
    return s.ownerDocument = this, s;
  }
  createTextNode(e) {
    return new ze(e);
  }
  appendChild(e) {
    this.textContent = e.toParentNode();
  }
}
class ee {
  #t = "";
  #i = 0;
  #s = 1;
  #n = 1;
  #e = 0;
  [Symbol.iterator]() {
    return this;
  }
  reset(e, t) {
    this.#t = e, this.#i = 0, this.#s = t?.line ?? 1, this.#n = this.#s, this.#e = t ? -t.col : 0;
  }
  next() {
    if (this.#i < this.#t.length) {
      const e = this.#t[this.#i++];
      return e === `
` && (this.#s += 1, this.#e = this.#i), {
        value: {
          char: e
        },
        done: !1
      };
    }
    return {
      value: null,
      done: !0
    };
  }
  save() {
    return {
      line: this.#s,
      col: this.#i - this.#e
    };
  }
  formatError(e, t) {
    if (typeof this.#t != "string")
      return `${t} at index ${this.#i - 1}`;
    const s = this.#i - this.#e + (e.endOfText ? 1 : 0), i = this.#t.split(`
`).slice(Math.max(0, this.#s - this.#n - 4), this.#s - this.#n + 1), a = String(this.#s).length, r = (c, _) => " ".repeat(_ - String(c).length) + c;
    return [
      e.endOfText ? `${t} at end of line ${this.#s}` : `${t} at line ${this.#s} col ${s}:`,
      "",
      i.map(
        (c, _) => `${r(this.#s - i.length + _ + 1, a)}: ${c}`
      ).join(`
`),
      `${" ".repeat(a + s + 1)}^`
    ].join(`
`);
  }
}
class b {
  data = [];
  constructor(e, t, s, i, a) {
    Object.assign(this, { rule: e, dot: t, reference: s, wantedBy: i, parser: a }), this.isComplete = this.dot === e.symbols.length;
  }
  toString() {
    return `{${this.rule.toString(this.dot)}}, from: ${this.reference || 0}, wantedBy: ${this.wantedBy.map((e) => e.rule.name).join(", ")}`;
  }
  expectingState(e, t, s, i) {
    if (e) {
      if ("string" in e)
        return this.nextState({ data: e.string, reference: t }, s, i);
      if ("attributeName" in e && "attributes" in s && e.alias in s.attributes) {
        const a = new H(i.grammar, new ee(), e.attributeName);
        a.feed(s.attributes[e.alias]);
        const r = a.finish();
        return r.length > 0 ? this.nextState({
          data: {
            attributeName: e.alias,
            resultingValue: r[0].childNodes[0]?.textContent ?? ""
          },
          reference: this.reference
        }, s, i) : null;
      } else return i.lexer instanceof ee && ("startName" in e || "endName" in e) ? this.nextState({ data: "", reference: t }, s, i) : this;
    } else
      return this;
  }
  nextState(e, t, s) {
    let i = this.dot + 1;
    const a = new b(this.rule, i, this.reference, this.wantedBy, s);
    if (a.left = this, a.right = e, a.isComplete)
      a.data = a.build(), a.right = void 0;
    else
      return a.expectingState(this.rule.symbols[i], this.reference, t, s);
    return a;
  }
  build() {
    const e = [];
    for (let t = this; t.left; t = t.left)
      t.right?.data !== null && e.unshift(t.right.data);
    return e;
  }
  finish() {
    const e = {
      1: () => b.createElement(this.rule.alias, this.rule.ns),
      2: () => b.createAttribute(this.rule.alias),
      [-1]: () => b.createArray()
    };
    this.#t(e[this.rule.mark]?.()) || (this.data = Ee);
  }
  static getTextContent(e) {
    switch (e.nodeType) {
      case 1:
      case 132:
        return e.childNodes.reduce((t, s) => t + b.getTextContent(s), "");
      case 2:
        return e.value;
      case 3:
        return e.textContent;
    }
  }
  static appendToNode(e, t) {
    switch (t.nodeType) {
      case 1: {
        e.nodeType == 2 ? e.value += b.getTextContent(t) : e.appendChild(t);
        break;
      }
      case 2: {
        e.nodeType == 2 ? e.value += b.getTextContent(t) : e.nodeType == 1 ? e.attributes.push(t) : e.appendChild(t);
        break;
      }
      case 3: {
        switch (e.nodeType) {
          case 1:
          case 132: {
            e.childNodes.at(-1)?.nodeType === 3 ? e.childNodes.at(-1).textContent += b.getTextContent(t) : e.appendChild(b.createTextNode(b.getTextContent(t)));
            break;
          }
          case 2: {
            e.value += b.getTextContent(t);
            break;
          }
        }
        break;
      }
      case 132: {
        t.childNodes.forEach((s) => b.appendToNode(e, s)), t.attributes && e.nodeType === 132 && t.attributes.forEach((s) => e.setAttribute(s.name, s.value));
        break;
      }
    }
  }
  #t(e) {
    let t = 0, s = {}, i = [];
    for (const a of this.rule.symbols) {
      const r = this.data[t];
      if (typeof r == "object" && r !== null && "startName" in r)
        Object.keys(r.attributes).forEach((c) => {
          s[c] = "";
        }), i = e.attributes, e.attributes = [];
      else if (typeof r == "object" && r !== null && "endName" in r) {
        if (e.attributes.forEach((c) => {
          delete s[c.name];
        }), e.attributes = i, Object.keys(s).length > 0)
          return !1;
      } else if (typeof r == "object" && r !== null && "attributeName" in r)
        b.appendToNode(e, b.createTextNode(r.resultingValue)), e.setAttribute(r.attributeName, r.resultingValue);
      else if (r || a.string || a.attributeName)
        switch (a.mark) {
          case -1: {
            if (a.name)
              switch (r.nodeType) {
                case 1: {
                  r.attributes.forEach((c) => b.appendToNode(e, c)), r.childNodes.forEach((c) => b.appendToNode(e, c));
                  break;
                }
                case 132: {
                  r.childNodes.forEach((c) => b.appendToNode(e, c)), e.nodeType === 132 && r.attributes && r.attributes.forEach((c) => e.setAttribute(c.name, c.value));
                  break;
                }
                case 2: {
                  b.appendToNode(e, b.createTextNode(r.value));
                  break;
                }
              }
            break;
          }
          case 0: {
            const c = a.name ? r : a.regExp || a.attributeName ? b.createTextNode(r) : b.createTextNode(a.char || a.string);
            b.appendToNode(e, c);
            break;
          }
          case 1: {
            if (r.nodeType === 132) {
              const c = b.createElement(a.alias);
              r.childNodes.forEach((_) => b.appendToNode(c, _)), b.appendToNode(e, c);
            } else
              b.appendToNode(e, r);
            break;
          }
          case 2: {
            if ([132, 1, 3].includes(r.nodeType)) {
              const c = b.createAttribute(a.alias);
              c.value = b.getTextContent(r), b.appendToNode(e, c);
            } else
              b.appendToNode(e, r);
            break;
          }
        }
      t++;
    }
    return this.data = e, !0;
  }
  static createElement(e, t) {
    return {
      nodeType: 1,
      attributes: [],
      namespaces: t || [],
      childNodes: [],
      nodeName: e,
      localName: e,
      appendChild: function(s) {
        this.childNodes.push(s);
      },
      getAttribute: function(s) {
        return this.attributes.find((a) => a.name === s)?.value ?? "";
      },
      setAttribute: function(s, i) {
        const a = this.attributes.find((r) => r.name === s);
        a ? a.value = i : this.attributes.push({
          nodeType: 2,
          name: s,
          value: i
        });
      },
      setNamespace(s, i) {
        this.namespaces.push({
          nodeType: 133,
          prefix: i,
          URI: s
        });
      },
      lookupNamespaceURI(s) {
        const i = this.namespaces.find((a) => a.prefix === s);
        return i ? i.URI : null;
      },
      lookupPrefix(s) {
        const i = this.namespaces.find((a) => a.URI === s);
        return i ? i.prefix : null;
      }
    };
  }
  static createAttribute(e) {
    return {
      nodeType: 2,
      name: e,
      value: ""
    };
  }
  static createTextNode(e) {
    return {
      nodeType: 3,
      textContent: e
    };
  }
  static createArray() {
    return {
      nodeType: 132,
      attributes: [],
      childNodes: [],
      appendChild: function(e) {
        this.childNodes.push(e);
      },
      setAttribute: function(e, t) {
        const s = this.attributes.find((i) => i.name === e);
        s ? s.value = t : this.attributes.push({
          nodeType: 2,
          name: e,
          value: t
        });
      }
    };
  }
}
class ne {
  states = [];
  wants = {};
  scannable = [];
  completed = {};
  constructor(e, t) {
    Object.assign(this, { parser: e, reference: t });
  }
  process(e) {
    const { states: t, wants: s, completed: i } = this;
    for (const a of t) {
      if (a.isComplete) {
        if (a.finish(), a.data !== Ee) {
          for (const c of a.wantedBy)
            this.#t(c, a, e);
          if (a.reference === this.reference) {
            const c = a.rule.name;
            (i[c] ??= []).push(a);
          }
        }
        continue;
      }
      const r = a.rule.symbols[a.dot]?.name;
      if (!r) {
        this.scannable.push(a);
        continue;
      }
      if (s[r]) {
        if (s[r].push(a), i[r])
          for (const c of i[r])
            this.#t(a, c, e);
      } else
        s[r] = [a], this.predict(r, e);
    }
  }
  predict(e, t) {
    const s = this.parser.grammar.byName[e] ?? [];
    for (const i of s) {
      const r = new b(i, 0, this.reference, this.wants[e], this.parser).expectingState(i.symbols[0], this.reference, t, this.parser);
      r && this.states.push(r);
    }
  }
  #t(e, t, s) {
    this.states.push(e.nextState(t, s, this.parser));
  }
}
class W extends Error {
  constructor(e, t, s) {
    super(e), this.name = "EarleyParserError", this.offset = t, this.value = s;
  }
}
class H {
  static fail = {};
  grammar = null;
  lexer = null;
  #t = null;
  #i = [];
  #s = 0;
  #n = null;
  #e = {
    char: null
  };
  //  #stringInput = true;
  constructor(e, t, s) {
    this.grammar = e, this.lexer = t;
    const i = new ne(this, 0);
    this.#i = [i], this.#n = s ?? e.rules[0]?.name, i.wants[this.#n] = [], i.predict(this.#n), i.process();
  }
  feed(e) {
    const t = this.lexer;
    t.reset(e, this.#t);
    try {
      for (this.#e of t) {
        const s = this.#i[this.#s];
        delete this.#i[this.#s - 1];
        const i = new ne(this, this.#s + 1);
        if (this.#i.push(i), s.scannable.forEach((a) => {
          if (!this.#e.endOfText) {
            const r = a.rule.symbols[a.dot];
            let c = null;
            if ("char" in r && "char" in this.#e && r.char === this.#e.char ? c = this.#e.char : "regExp" in r && "char" in this.#e && r.regExp.test(this.#e.char) ? c = this.#e.char : "startName" in r && r.startName === this.#e.startName ? (this.#e.attributes = this.#e.nextAttributes, c = {
              startName: this.#e.startName,
              attributes: this.#e.attributes
            }) : "endName" in r && r.endName === this.#e.endName && (c = {
              endName: this.#e.endName,
              attributes: this.#e.attributes
            }, this.#e.attributes = this.#e.nextAttributes), c !== null) {
              const _ = a.nextState({ data: c, reference: this.#s }, this.#e, this);
              _ && i.states.push(_);
            }
          }
        }), i.process(this.#e), i.states.length === 0)
          throw new W(this.#l(), this.#s, this.#e.char);
        this.#s++;
      }
    } catch (s) {
      if (s instanceof W)
        throw s;
      {
        const i = new ne(this, this.#s + 1);
        throw this.#i.push(i), new W(this.#r(s), this.#s, s.value?.char);
      }
    }
    return this.#e = {
      endOfText: !0
    }, this.#i[this.#s] && (this.#t = t.save()), this;
  }
  #r(e) {
    const { token: t } = e, s = t ? `input ${JSON.stringify(t.text[0])} (lexer error)` : "input (lexer error)", i = t ? this.lexer.formatError(t, "Syntax error") : e.message;
    return this.#a(i, s);
  }
  #l() {
    let e = "";
    return this.#e.endOfText ? e = "end of text" : "startName" in this.#e ? e = `<${this.#e.startName}>` : "endName" in this.#e ? e = `</${this.#e.endName}>` : e = JSON.stringify(this.#e.char), this.#a(this.lexer.formatError(this.#e, this.lexer instanceof ee ? "Syntax error" : "Normalizing error"), e);
  }
  #a(e, t) {
    const s = [e], i = this.#i[this.#i.length - (this.#e.endOfText ? 1 : 2)];
    if (!i)
      return s.concat("").join(`
`);
    const a = i.states.filter((r) => {
      const c = r.rule.symbols[r.dot];
      return c?.char || c?.regExp || c?.startName || c?.endName;
    });
    return a.length === 0 ? (s.push(`Unexpected ${t}. I did not expect any more input. Here is the state of my parse table:
`), this.#o(i.states, s)) : (s.push(`Unexpected ${t}. Instead, I was expecting to see one of the following:
`), a.map((r) => this.#u(r, []) || [r]).forEach((r) => {
      const c = r[0].rule.symbols[r[0].dot], _ = this.#c(c);
      s.push(`${/^[aeiou]/i.test(_) ? "An" : "A"} ${_} based on:`), this.#o(r, s);
    })), s.concat("").join(`
`);
  }
  #o(e, t) {
    let s = null, i = 0;
    for (const a of e) {
      const r = a.rule.toString(a.dot);
      if (r === s) {
        i++;
        continue;
      }
      i > 0 && t.push(`    ^ ${i} more lines identical to this`), t.push(`    ${r}`), s = r, i = 0;
    }
  }
  #c(e) {
    return e.name || e.char ? e.toString() : e.regExp ? `character matching ${e.toString()}` : e.startName ? `start tag <${e.startName}>` : e.endName ? `end tag </${e.endName}>` : e.attributeName ? `attribute ${e.attributeName}` : `insertion of ${JSON.stringify(e.string)}`;
  }
  #u(e, t) {
    if (t.indexOf(e) !== -1)
      return null;
    if (e.wantedBy.length === 0)
      return [e];
    const s = e.wantedBy[0], i = [e].concat(t), a = this.#u(s, i);
    return a === null ? null : [e].concat(a);
  }
  finish() {
    if (this.#e.endOfText || this.#e.char) {
      const e = this.#i.at(-1).states.filter(
        (t) => t.rule.name === this.#n && t.dot === t.rule.symbols.length && t.reference === 0 && t.data !== H.fail
      ).map((t) => t.data);
      if (e.length === 0)
        throw new W(this.#l(), this.#s, this.#e.char);
      return e;
    }
    return [];
  }
}
const Ee = H.fail;
class je {
  constructor([e, t, s, i]) {
    return this.mark = e, {
      2: () => this.char = s,
      3: () => this.regExp = s,
      4: () => this.string = s,
      1: () => {
        this.name = s, this.alias = i;
      },
      5: () => {
        this.startName = s, this.ns = (i ?? []).map((r) => ({
          prefix: r[0],
          URI: r[1]
        }));
      },
      6: () => this.endName = s,
      7: () => {
        this.attributeName = s, this.alias = i;
      }
    }[t]?.(), this;
  }
  toString() {
    if (this.name)
      return `${Z[this.mark]}${this.name}${this.alias && this.name !== this.alias ? ">" + this.alias : ""}`;
    if (this.startName)
      return `<${this.startName}${this.ns.reduce((e, t) => e + ` xmlns${t.prefix ? ":" + t.prefix : ""}="${t.URI}"`, "")}>`;
    if (this.endName)
      return `</${this.endName}>`;
    if (this.attributeName)
      return `<@${this.attributeName}>`;
    if (this.char) {
      const e = this.char.codePointAt(0);
      if (e <= 31 || e >= 127)
        return `${Z[this.mark]}#${e.toString(16)}`;
      const t = this.char.includes('"') ? "'" : '"';
      return `${Z[this.mark]}${t}${this.char}${t}`;
    }
    if (this.regExp) {
      const e = [...this.regExp.source], t = e[1] === "^" ? 2 : 1, s = [];
      let i = "", a = !1;
      for (let r = t; r < e.length - 1; r++) {
        const c = e[r];
        if (c === "\\") {
          const _ = e[++r];
          if (_ === "p") {
            r += 2;
            let f = "";
            for (; e[r] !== "}"; )
              f += e[r++];
            if (i) {
              const n = i.includes('"') ? "'" : '"';
              s.push(`${n}${i}${n}`), i = "";
            }
            s.push(f);
          } else if (["x", "u"].includes(_)) {
            if (i) {
              const d = i.includes('"') ? "'" : '"';
              s.push(`${d}${i}${d}`), i = "";
            }
            const f = _ === "x" ? 2 : 4, n = e.slice(r + 1, r + 1 + f).join("");
            a ? (s[s.length - 1] += `#${n}`, a = !1) : s.push(`#${n}`), r += f;
          } else
            i += _;
        } else if (c === "-") {
          if (i.length > 1) {
            const [f, ...n] = [...i].reverse();
            if (n.length) {
              const d = n.join("").includes('"') ? "'" : '"';
              s.push(`${d}${n.reverse().join("")}${d}`);
            }
            i = f;
          }
          const _ = i.includes('"') ? "'" : '"';
          s.push(`${_}${i}${_}-`), a = !0, i = "";
        } else {
          const _ = c.codePointAt(0);
          if (_ <= 31 || _ >= 127) {
            if (i) {
              const f = i.includes('"') ? "'" : '"';
              s.push(`${f}${i}${f}`), i = "";
            }
            a ? (s[s.length - 1] += `#${_.toString(16)}`, a = !1) : s.push(`#${_.toString(16)}`);
          } else if (a) {
            const f = c.includes('"') ? "'" : '"';
            s[s.length - 1] += `${f}${c}${f}`, a = !1;
          } else
            i += c;
        }
      }
      if (i) {
        const r = i.includes('"') ? "'" : '"';
        s.push(`${r}${i}${r}`);
      }
      return `${Z[this.mark]}${t === 1 ? "" : "~"}[${s.join("; ")}]`;
    }
    if (this.string) {
      const e = [];
      let t = "";
      for (const s of this.string) {
        const i = s.codePointAt(0);
        if (i >= 32 && i <= 126)
          t += s;
        else {
          if (t) {
            const a = t.includes('"') ? "'" : '"';
            e.push(`+${a}${t}${a}`), t = "";
          }
          e.push(`+#${i.toString(16)}`);
        }
      }
      if (t) {
        const s = t.includes('"') ? "'" : '"';
        e.push(`+${s}${t}${s}`);
      }
      return e.join(", ");
    }
  }
}
class He {
  constructor([e, t, s, i, a]) {
    Object.assign(this, { mark: e, name: t, alias: s, ns: i }), this.ns = i.map((r) => ({ prefix: r[0], URI: r[1] })), this.symbols = a.map((r) => new je(r));
  }
  toString(e) {
    const t = this.symbols.map((s, i) => [i === e ? "● " : "", s.toString()].join("")).join(", ");
    return `${We[this.mark]}${this.name}${this.alias !== this.name ? `>${this.alias}` : ""}${this.ns.reduce((s, i) => s + ` xmlns${i.prefix ? ":" + i.prefix : ""}="${i.URI}"`, "")}: ${t}${e === this.symbols.length ? ". ●" : "."}`;
  }
}
class Ge {
  byName = {};
  constructor(e) {
    this.rules = e.map((t) => new He(t)), this.rules.forEach((t) => {
      (this.byName[t.name] ??= []).push(t);
    });
  }
  toString() {
    return this.rules.map((e) => e.toString()).join(`
`);
  }
}
class Je {
  #t = null;
  #i = [];
  #s = "";
  #n = 0;
  #e = !0;
  #r = !1;
  #l = !1;
  #a = "";
  #o = 0;
  #c = !1;
  [Symbol.iterator]() {
    return this;
  }
  reset(e) {
    this.#t = e.documentElement ?? e;
  }
  inject(e) {
    this.#a = e, this.#c = !0, this.#o = 0;
  }
  #u() {
    this.#s = "", this.#n = 0, this.#t.nextSibling ? (this.#t = this.#t.nextSibling, this.#t.nodeType === 3 ? (this.#s = this.#t.textContent, this.#n = 0) : this.#e = !0) : (this.#t = this.#t.parentNode, this.#r = !0, this.#l = !this.#t);
  }
  next() {
    if (this.#l)
      return {
        done: !0
      };
    if (this.#c)
      return this.#o < this.#a.length ? {
        value: {
          char: this.#a[this.#o++],
          injected: !0
        }
      } : (this.#c = !1, {
        value: {
          completed: !0,
          injected: !0
        }
      });
    if (this.#t.nodeType === 3 && this.#n < this.#s.length) {
      const e = this.#s[this.#n++], t = this.#i[this.#i.length - 1];
      return this.#n === this.#s.length && this.#u(), {
        value: {
          char: e,
          attributes: t
        }
      };
    }
    if (this.#e) {
      const e = this.#i[this.#i.length - 1] ?? {}, t = Object.fromEntries((this.#t.attributes?.filter((i) => i.namespaceURI !== "http://invisiblexml.org/NS") ?? []).map(({ name: i, value: a }) => [i, a]));
      this.#i.push(t), this.#e = !1;
      const s = this.#t.nodeName;
      return this.#t.childNodes.length > 0 ? (this.#t = this.#t.childNodes[0], this.#t.nodeType === 3 ? (this.#s = this.#t.textContent, this.#n = 0) : this.#e = !0) : this.#r = !0, {
        value: {
          startName: s,
          attributes: e,
          nextAttributes: t
        }
      };
    }
    if (this.#r) {
      this.#r = !1;
      const e = this.#t.nodeName, t = this.#i.pop(), s = this.#i[this.#i.length - 1] ?? {};
      return this.#u(), {
        value: {
          endName: e,
          attributes: t,
          nextAttributes: s
        }
      };
    }
  }
  save() {
    return null;
  }
  formatError(e, t) {
    let s = "";
    return e.endOfText ? s = "end of text" : "startName" in e ? s = `<${e.startName}>` : "endName" in e ? s = `</${e.endName}>` : s = JSON.stringify(e.char), `${t} at ${s}`;
  }
}
const ae = (m, e, t, s, i) => {
  const a = typeof e == "string";
  try {
    const r = new H(new Ge(m), a ? new ee() : new Je());
    r.feed(e);
    const c = r.finish();
    let _ = c[0];
    if (_?.nodeType === 132 && _?.childNodes.length === 1 && (_ = _.childNodes[0]), a && _?.nodeType !== 1)
      throw new Error("Parse error");
    if (c.length > 1 && a) {
      const f = _.lookupNamespaceURI("") === "http://invisiblexml.org/NS" ? "" : _.lookupPrefix("http://invisiblexml.org/NS") ?? "ixml";
      f === "ixml" && !_.lookupPrefix("http://invisiblexml.org/NS") && _.setNamespace("http://invisiblexml.org/NS", "ixml"), _.attributes.push({
        nodeType: 2,
        namespaceURI: "http://invisiblexml.org/NS",
        prefix: f,
        name: (f === "" ? "" : f + ":") + "state",
        value: "ambiguous"
      });
    }
    S(_, i);
  } catch ({ message: r }) {
    const c = {
      nodeType: 1,
      attributes: [],
      childNodes: [],
      nodeName: "ixml",
      localName: "ixml",
      appendChild: function(_) {
        this.childNodes.push(_);
      },
      getAttribute: function(_) {
        return this.attributes.find((n) => n.name === _)?.value ?? "";
      },
      setAttribute: function(_, f) {
        const n = this.attributes.find((d) => d.name === _);
        n ? n.value = f : this.attributes.push({
          nodeType: 2,
          name: _,
          value: f
        });
      }
    };
    c.attributes.push({
      nodeType: 2,
      namespaceURI: "http://invisiblexml.org/NS",
      prefix: c.namespaceURI === "http://invisiblexml.org/NS" ? c.prefix ?? null : "ixml",
      name: (c.namespaceURI === "http://invisiblexml.org/NS" ? c.prefix ? c.prefix + ":" : "" : "ixml:") + "state",
      value: "failed"
    }), c.appendChild({
      nodeType: 3,
      textContent: r
    }), S(c, i);
  }
};
class w extends Me {
  grammarElement = null;
  normalizedGrammarElement = null;
  static MARK_to_rulemark = {
    2: "@",
    [-1]: "-",
    1: ""
  };
  static MARK_to_termmark = {
    2: "@",
    [-1]: "-",
    1: "^",
    0: ""
  };
  static #t = {
    L: "A",
    Ll: "a",
    Lu: "A",
    Lt: "A",
    Lm: "A",
    Lo: "A",
    M: "̀",
    Mn: "̀",
    Mc: "ः",
    Me: "⃝",
    N: "0",
    Nd: "0",
    Nl: "Ⅰ",
    No: "²",
    P: ".",
    Pc: "_",
    Pd: "-",
    Ps: "(",
    Pe: ")",
    Pi: '"',
    Pf: '"',
    Po: ".",
    S: "+",
    Sm: "+",
    Sc: "$",
    Sk: "^",
    So: "©",
    Z: " ",
    Zs: " ",
    Zl: "\u2028",
    Zp: "\u2029",
    C: "",
    Cc: "",
    Cf: "​",
    Cs: "\uD800",
    Co: "",
    Cn: "͸",
    White_Space: " ",
    Cased_Letter: "A",
    LC: "A",
    Alphabetic: "A",
    Upper: "A",
    Lower: "a",
    Title: "A",
    Digit: "0",
    Hex_Digit: "0",
    ASCII_Hex_Digit: "0",
    Alnum: "A",
    Punctuation: ".",
    Graph: "!",
    Print: " ",
    Blank: " ",
    Control: "",
    XID_Start: "A",
    XID_Continue: "0",
    Assigned: " ",
    Space: " ",
    Letter: "A",
    Mark: "̀",
    Number: "0-9",
    Symbol: "+",
    Separator: " ",
    Other: ""
  };
  appendChild(e) {
    e?.nodeType === 1 && (this.grammarElement = e);
  }
  toNode(e) {
    this.grammarElement && S(this.grammarElement, e);
  }
  toString() {
    const e = new B();
    return S(this.grammarElement, e), e.textContent;
  }
  toNormalizedString() {
    const e = new B();
    return S(this.normalizedGrammarElement, e), e.textContent;
  }
  toExpandedString() {
    const e = new B();
    return S(this.documentElement, e), e.textContent;
  }
  toIndentedString() {
    const e = new B(2);
    return S(this.grammarElement, e), e.textContent;
  }
  toIndentedNormalizedString() {
    const e = new B(2);
    return S(this.normalizedGrammarElement, e), e.textContent;
  }
  toIndentedExpandedString() {
    const e = new B(2);
    return S(this.documentElement, e), e.textContent;
  }
  toIXml() {
    const e = new ie();
    return S(this.grammarElement, e), e.textContent;
  }
  toNormalizedIXml() {
    const e = new ie();
    return S(this.normalizedGrammarElement, e), e.textContent;
  }
  toExpandedIXml() {
    const e = new ie();
    return S(this.documentElement, e), e.textContent;
  }
  toRules() {
    let e = "[";
    return e += this.rules.reduce((t, s, i) => t + (i !== 0 ? "," : "") + re(s).replace(/\\/g, "\\"), "[") + "]", e += ",", e += this.normalizingRules.reduce((t, s, i) => t + (i !== 0 ? "," : "") + re(s).replace(/\\/g, "\\"), "[") + "]", e += "]", e;
  }
  fromString(e) {
    fe(this, e);
  }
  generateParseFunction() {
    this.parse = (e, t) => (t || (t = new q()), ae(this.rules, e, this.defaultNamespaceURI, this.defaultPrefix, t), t);
  }
  generateNormalizeFunction() {
    this.normalize = (e) => {
      const t = new q(), s = new q(e);
      if (ae(this.normalizingRules, s, this.defaultNamespaceURI, this.defaultPrefix, t), t.childNodes[0]?.localName === "ixml")
        throw new Error(t.childNodes[0]?.childNodes[0]?.textContent ?? "Invalid XML document for IXML grammar");
      return t.childNodes[0]?.textContent ?? "";
    };
  }
  #i() {
    const e = this.createElement("ixml");
    let t = "", s = null;
    this.rules.forEach((i) => {
      const a = w.MARK_to_rulemark[i[0]] + i[1] + (i[1] !== i[2] ? ">" + i[2] : "");
      (!s || t !== a) && (s = this.createElement("rule"), w.MARK_to_rulemark[i[0]] && s.setAttribute("mark", w.MARK_to_rulemark[i[0]]), s.setAttribute("name", i[1]), i[2] !== i[1] && s.setAttribute("alias", i[2]), e.appendChild(s), t = a);
      const r = this.createElement("alt");
      i[4].forEach((c) => {
        switch (c[1]) {
          case 1: {
            const _ = this.createElement("nonterminal");
            _.setAttribute("name", c[2]), c[3] !== c[2] && _.setAttribute("alias", c[3]), c[0] !== 0 && _.setAttribute("mark", w.MARK_to_termmark[c[0]]), r.appendChild(_);
            break;
          }
          case 2: {
            const _ = this.createElement("literal"), f = c[2].codePointAt(0);
            f >= 32 && f <= 126 ? _.setAttribute("string", c[2]) : _.setAttribute("hex", f.toString(16)), c[0] !== 0 && _.setAttribute("tmark", w.MARK_to_termmark[c[0]]), r.appendChild(_);
            break;
          }
          case 3: {
            const _ = c[2].source.split(""), f = _[1] === "^" ? 2 : 1, n = this.createElement(f === 1 ? "inclusion" : "exclusion");
            c[0] !== 0 && n.setAttribute("tmark", w.MARK_to_termmark[c[0]]);
            let d = null, x = null;
            for (let o = f, l = _.length - 1; o < l; o++)
              if (_[o] === "\\")
                if (o++, _[o] === "p") {
                  o += 2;
                  let p = "";
                  for (; _[o] !== "}"; )
                    p += _[o], o++;
                  if (d) {
                    const E = this.createElement("member");
                    E.setAttributeNode(d), n.appendChild(E), d = null;
                  }
                  const h = this.createElement("member");
                  h.setAttribute("code", p), n.appendChild(h);
                } else if (_[o] === "x") {
                  if (o++, x)
                    d = this.createAttribute("to"), d.value = "#" + _[o] + _[o + 1], x.setAttributeNode(d), n.appendChild(x), x = null, d = null;
                  else {
                    if (d) {
                      const p = this.createElement("member");
                      p.setAttributeNode(d), n.appendChild(p), d = null;
                    }
                    d = this.createAttribute("hex"), d.value = _[o] + _[o + 1];
                  }
                  o++;
                } else if (_[o] === "u") {
                  if (o++, x)
                    d = this.createAttribute("to"), d.value = "#" + _[o] + _[o + 1] + _[o + 2] + _[o + 3], x.setAttributeNode(d), n.appendChild(x), x = null, d = null;
                  else {
                    if (d) {
                      const p = this.createElement("member");
                      p.setAttributeNode(d), n.appendChild(p), d = null;
                    }
                    d = this.createAttribute("hex"), d.value = _[o] + _[o + 1] + _[o + 2] + _[o + 3];
                  }
                  o += 3;
                } else if (d)
                  if (d.name === "string")
                    d.value += _[o];
                  else {
                    const p = this.createElement("member");
                    p.setAttributeNode(d), n.appendChild(p), d = this.createAttribute("string"), d.value = _[o];
                  }
                else
                  d = this.createAttribute("string"), d.value = _[o];
              else if (_[o] === "-") {
                const p = (d.nodeName === "hex" ? "#" : "") + d.value;
                d = this.createAttribute("from"), d.value = p, x = this.createElement("member"), x.setAttributeNode(d);
              } else if (x)
                d = this.createAttribute("to"), d.value = _[o], x.setAttributeNode(d), n.appendChild(x), x = null, d = null;
              else if (_[o].codePointAt(0) <= 31 || _[o].codePointAt(0) >= 127) {
                if (d) {
                  const h = this.createElement("member");
                  h.setAttributeNode(d), n.appendChild(h), d = null;
                }
                const p = this.createElement("member");
                p.setAttribute("hex", _[o].codePointAt(0).toString(16)), n.appendChild(p);
              } else if (d)
                if (d.name === "string")
                  d.value += _[o];
                else {
                  const p = this.createElement("member");
                  p.setAttributeNode(d), n.appendChild(p), d = this.createAttribute("string"), d.value = _[o];
                }
              else
                d = this.createAttribute("string"), d.value = _[o];
            if (d) {
              const o = this.createElement("member");
              o.setAttributeNode(d), n.appendChild(o);
            }
            r.appendChild(n);
            break;
          }
          case 4: {
            const _ = c[2].split("");
            let f = "";
            for (let n = 0, d = _.length; n < d; n++) {
              const x = _[n].codePointAt(0);
              if (x >= 32 && x <= 126)
                f += _[n];
              else {
                if (f !== "") {
                  const l = this.createElement("insertion");
                  l.setAttribute("string", f), r.appendChild(l), f = "";
                }
                const o = this.createElement("insertion");
                o.setAttribute("hex", x.toString(16)), r.appendChild(o);
              }
            }
            if (f !== "") {
              const n = this.createElement("insertion");
              n.setAttribute("string", f), r.appendChild(n), f = "";
            }
            break;
          }
        }
      }), s.appendChild(r);
    }), super.appendChild(e);
  }
  #s() {
    const e = new w();
    S(this.grammarElement, e), this.normalizedGrammarElement = e.grammarElement;
    let t = this.normalizedGrammarElement.childNodes.filter((o) => o.nodeName === "rule");
    const s = (o) => {
      if (o.nodeName === "inclusion" && o.getAttribute("tmark") === "-") {
        o.nodeName = o.localName = "literal";
        const l = o.childNodes[0], p = l.getAttribute("code");
        if (p)
          o.setAttribute("string", w.#t[p]);
        else {
          const h = l.getAttribute("from");
          if (h)
            h.startsWith("#") ? o.setAttribute("hex", h.substring(1)) : o.setAttribute("string", h);
          else {
            const E = l.getAttribute("string");
            if (E)
              o.setAttribute("string", E[0]);
            else {
              const O = l.getAttribute("hex");
              O && o.setAttribute("hex", O);
            }
          }
        }
        o.childNodes = [];
      } else if (o.nodeName === "exclusion" && o.getAttribute("tmark") === "-") {
        const l = new RegExp(this.#n(o));
        o.nodeName = o.localName = "literal";
        let p = "";
        for (let h = 32; h <= 126; h++) {
          const E = String.fromCodePoint(h);
          if (l.test(E)) {
            p = E, o.setAttribute("string", p);
            break;
          }
        }
        if (p === "")
          for (let h = 160; h < 55296; h++) {
            const E = String.fromCodePoint(h);
            if (l.test(E)) {
              p = E, o.setAttribute("hex", h.toString(16));
              break;
            }
          }
        if (p === "")
          for (let h = 57344; h <= 1114111; h++) {
            const E = String.fromCodePoint(h);
            if (l.test(E)) {
              p = E, o.setAttribute("hex", h.toString(16));
              break;
            }
          }
      } else
        for (const l of o.childNodes)
          s(l);
    };
    t.forEach(s);
    const i = Object.fromEntries(t.map((o) => [o.getAttribute("name"), o]));
    let a;
    const r = (o) => {
      if (o.getAttribute("ignoredText") === "")
        switch (o.nodeName) {
          case "inclusion":
          case "exclusion":
          case "literal": {
            o.setAttribute("ignoredText", String(o.getAttribute("tmark") === "-")), a = !0;
            break;
          }
          case "comment":
          case "insertion": {
            o.setAttribute("ignoredText", "true"), a = !0;
            break;
          }
          case "nonterminal": {
            const l = i[o.getAttribute("name")], p = l?.getAttribute("ignoredText");
            l?.getAttribute("mark") === "-" || o.getAttribute("mark") === "-" ? p && (o.setAttribute("ignoredText", p), a = !0) : (o.setAttribute("ignoredText", "false"), a = !0);
            break;
          }
          default: {
            let l = "";
            for (const p of o.childNodes)
              p.getAttribute("ignoredText") === "" && (r(p), p.getAttribute("ignoredText") === "" && (l = null)), l === "" ? l = p.getAttribute("ignoredText") : l === "true" && p.getAttribute("ignoredText") === "false" && (l = "false");
            l && (o.setAttribute("ignoredText", l), a = !0);
          }
        }
    };
    do
      a = !1, t.forEach(r);
    while (a);
    const c = (o) => {
      if ((o.nodeName === "alts" || o.nodeName === "rule") && o.childNodes.length > 1) {
        const l = o.childNodes.every((h) => h.getAttribute("ignoredText") === "true"), p = o.childNodes.some((h) => h.childNodes.length === 0);
        l && (o.childNodes = [o.childNodes[0]], p && o.childNodes.push(this.createElement("alt")), a = !0);
      }
      for (const l of o.childNodes)
        c(l);
    };
    do
      a = !1, t.forEach(c);
    while (a);
    const _ = (o) => {
      for (const l of o.childNodes)
        _(l);
      if (o.getAttribute("disposable") === "")
        switch (o.nodeName) {
          case "option":
          case "repeat0": {
            let l = "true";
            for (const p of o.childNodes) {
              if (p.getAttribute("disposable") === "") {
                l = null;
                break;
              }
              if (p.getAttribute("ignoredText") !== "true" && p.getAttribute("disposable") !== "true") {
                l = "false";
                break;
              }
            }
            if (l && (o.setAttribute("disposable", l), a = !0), o.childNodes.length === 1 && o.childNodes[0].nodeName === "alts" && o.getAttribute("disposable") === "false")
              for (const p of o.childNodes[0].childNodes)
                (p.getAttribute("disposable") === "true" || p.getAttribute("ignoredText") === "true") && (o.childNodes[0].removeChild(p), a = !0);
            break;
          }
          case "nonterminal": {
            const l = o.getAttribute("mark"), p = i[o.getAttribute("name")], h = l === "^" || l === "@" ? "false" : p?.getAttribute("disposable");
            h && (o.setAttribute("disposable", String(h)), a = !0);
            break;
          }
          case "insertion":
          case "inclusion":
          case "exclusion":
          case "member":
          case "literal": {
            o.setAttribute("disposable", "false"), a = !0;
            break;
          }
          default: {
            let l = o.nodeName === "alt" && o.childNodes.length == 0 ? "false" : "true";
            for (const p of o.childNodes) {
              if (p.getAttribute("disposable") === "") {
                l = null;
                break;
              }
              if (p.getAttribute("disposable") !== "true") {
                l = "false";
                break;
              }
            }
            l && (o.nodeName === "rule" ? o.setAttribute("disposable", l === "true" && o.getAttribute("mark") === "-" ? "true" : "false") : o.setAttribute("disposable", l), a = !0);
            break;
          }
        }
    };
    do
      a = !1, t.forEach(_);
    while (a);
    const f = (o) => {
      for (const l of o.childNodes)
        if (l instanceof z)
          if (l.getAttribute("disposable") === "true")
            o.removeChild(l);
          else if (l.nodeName === "repeat1")
            if (l.getAttribute("ignoredText") === "true")
              if (l.removeAttribute("disposable"), l.removeAttribute("ignoredText"), f(l), l.childNodes.length === 1)
                o.childNodes[o.childNodes.indexOf(l)] = l.childNodes[0];
              else {
                l.nodeName = l.localName = "alts";
                const p = this.createElement("alt");
                l.childNodes.forEach((h) => p.appendChild(h)), l.childNodes = [p];
              }
            else if (l.childNodes.length === 1 && l.childNodes[0].nodeName === "alts") {
              let p = null;
              for (const E of l.childNodes[0].childNodes)
                if (E.getAttribute("disposable") === "true" || E.getAttribute("ignoredText") === "true") {
                  p = E;
                  break;
                }
              l.removeAttribute("disposable"), l.removeAttribute("ignoredText");
              const h = l.childNodes[0].childNodes.filter((E) => E.getAttribute("disposable") !== "true" && E.getAttribute("ignoredText") !== "true");
              if (f(l), p) {
                l.nodeName = l.localName = "alts", this.createElement("alt").appendChild(p);
                const O = this.createElement("alt"), A = this.createElement("repeat1"), N = this.createElement("alts");
                N.childNodes = h, A.appendChild(N), O.appendChild(A), l.childNodes = [p, O];
              }
            } else
              l.removeAttribute("disposable"), l.removeAttribute("ignoredText"), f(l);
          else
            l.removeAttribute("disposable"), l.removeAttribute("ignoredText"), f(l);
    };
    t.forEach(f);
    const n = /* @__PURE__ */ new Set();
    t.length > 0 && n.add(t[0].getAttribute("name"));
    const d = (o) => {
      for (const l of o.childNodes ?? [])
        d(l);
      o.nodeName === "nonterminal" && n.add(o.getAttribute("name"));
    };
    this.normalizedGrammarElement.childNodes.forEach(d), this.normalizedGrammarElement.childNodes = this.normalizedGrammarElement.childNodes.filter((o) => !(o instanceof z) || n.has(o.getAttribute("name"))), this.normalizedGrammarElement.childNodes.forEach((o) => {
      o instanceof z && (o.removeAttribute("disposable"), o.removeAttribute("ignoredText"));
    }), t = this.normalizedGrammarElement.childNodes.filter((o) => o.nodeName === "rule");
    const x = (o) => {
      for (const l of o.childNodes)
        x(l), l.nodeName === "alts" && l.childNodes.length === 1 && l.childNodes[0].childNodes.length === 1 && !["option", "repeat0", "repeat1"].includes(l.childNodes[0].childNodes[0].nodeName) && (o.childNodes[o.childNodes.indexOf(l)] = l.childNodes[0].childNodes[0], a = !0);
    };
    do
      a = !1, t.forEach(x);
    while (a);
  }
  #n(e) {
    return (e.localName === "inclusion" ? "[" : "[^") + e.childNodes.reduce((t, s) => {
      let i = "", a = s.getAttribute("from") || "";
      if (a !== "") {
        let r = s.getAttribute("to") || "";
        if (a.startsWith("#")) {
          const c = parseInt(a.substring(1), 16).toString(16);
          c.length < 3 ? a = "\\x" + c.padStart(2, "0") : a = "\\u" + c.padStart(4, "0");
        }
        if (r.startsWith("#")) {
          const c = parseInt(r.substring(1), 16).toString(16);
          c.length < 3 ? r = "\\x" + c.padStart(2, "0") : r = "\\u" + c.padStart(4, "0");
        }
        i = a + "-" + r;
      } else {
        const r = s.getAttribute("string") || "";
        if (r !== "")
          i = r.replace(/([[\]\\^-])/g, "\\$1");
        else {
          const c = s.getAttribute("hex") || "";
          if (c !== "") {
            let _ = parseInt(c, 16);
            if (_ <= 255)
              i = "\\x" + _.toString(16).padStart(2, "0");
            else if (_ <= 65535)
              i = "\\u" + _.toString(16).padStart(4, "0");
            else {
              _ -= 65536;
              let f = _ >> 10 & 1023 | 55296, n = _ & 1023 | 56320;
              i = "\\u" + f.toString(16) + "\\u" + n.toString(16);
            }
          } else {
            const _ = s.getAttribute("code") || "";
            i += "\\p{" + _ + "}";
          }
        }
      }
      return t + i;
    }, "") + "]";
  }
  #e(e) {
    const t = { "@": 2, "-": -1, "^": 1, "": 0 }, s = { "@": 2, "-": -1, "^": 1, "": 1 };
    let i = [];
    e.childNodes.forEach((_) => {
      if (_.localName === "rule") {
        const f = _.getAttribute("name"), n = _.getAttribute("alias"), d = [], x = n || f, o = (l, p) => {
          let h = "", E = "", O = "", A = null, N = [];
          switch (p.localName) {
            case "nonterminal": {
              h = p.getAttribute("name"), E = p.getAttribute("alias"), O = E || h, A = [[t[p.getAttribute("mark") || ""], 1, h, O]];
              break;
            }
            case "attribute": {
              h = p.getAttribute("name"), A = [[0, 7, h]];
              break;
            }
            case "starttag": {
              h = p.getAttribute("name"), A = [[0, 5, h, p.childNodes.filter((u) => u.localName === "ns").map((u) => [u.getAttribute("prefix"), u.getAttribute("uri")])]];
              break;
            }
            case "endtag": {
              h = p.getAttribute("name"), A = [[0, 6, h]];
              break;
            }
            case "insertion":
            case "literal": {
              const u = p.localName === "insertion" ? "" : p.getAttribute("tmark") || "", T = p.getAttribute("string") || "";
              if (T !== "")
                if (T.length === 1 || p.localName === "insertion")
                  A = [[t[u], p.localName === "insertion" ? 4 : 2, T]];
                else {
                  h = l.name + "_" + l.rule_count + "_literal_" + l.literal_count++;
                  const D = T.split("").map(($) => {
                    const k = p.ownerDocument.createElement("literal");
                    return k.setAttribute("string", $), k.setAttribute("tmark", "-"), k;
                  }).reduce(o, { pick: [], subrules: [], name: l.name, rule_count: l.rule_count, literal_count: 1 });
                  N = [[-1, h, h, [], u !== "-" ? D.pick.concat([[0, 4, T]]) : D.pick]], A = [[t[p.getAttribute("mark") || ""], 1, h, h]];
                }
              else {
                const D = p.getAttribute("hex") || "";
                if (D !== "") {
                  let $ = parseInt(D, 16);
                  if ($ <= 65535)
                    A = [[t[u], p.localName === "insertion" ? 4 : 2, String.fromCodePoint($)]];
                  else {
                    $ -= 65536;
                    let k = $ >> 10 & 1023 | 55296, G = $ & 1023 | 56320;
                    const R = [[-1, 2, String.fromCodePoint(k)], [-1, 2, String.fromCodePoint(G)]];
                    h = l.name + "_" + l.rule_count + "_literal_" + l.literal_count++, N = [[-1, h, h, [], u !== "-" ? R.concat([[0, 4, String.fromCodePoint($)]]) : R]], A = [[t[p.getAttribute("mark") || ""], 1, h, h]];
                  }
                }
              }
              break;
            }
            case "inclusion":
            case "exclusion": {
              const u = p.getAttribute("tmark") || "", T = this.#n(p);
              A = [[t[u], 3, new RegExp(T, "u")]];
              break;
            }
            case "alts": {
              h = l.name + "_" + l.rule_count + "_alts_" + l.alts_count++, p.childNodes.forEach((u) => {
                const T = u.childNodes.reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                N.push([-1, h, h, [], T.pick]), N = N.concat(T.subrules);
              }), A = [[-1, 1, h, h]];
              break;
            }
            case "option": {
              if (h = l.name + "_" + l.rule_count + "_option_" + l.option_count++, p.childNodes[0].localName !== "alts") {
                const u = p.childNodes.reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                N.push([-1, h, h, [], u.pick]), N = N.concat(u.subrules);
              } else
                p.childNodes[0].childNodes.forEach((u) => {
                  const T = u.childNodes.reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                  N.push([-1, h, h, [], T.pick]), N = N.concat(T.subrules);
                });
              N.push([-1, h, h, [], []]), A = [[-1, 1, h, h]];
              break;
            }
            case "repeat0": {
              if (h = l.name + "_" + l.rule_count + "_repeat0_" + l.repeat0_count++, p.childNodes.length === 2) {
                const u = [];
                p.childNodes[1].childNodes.forEach(($) => {
                  u.push($);
                });
                const T = u.concat([p.childNodes[0]]).reduce(o, { pick: [], subrules: [], name: h + "_sep", rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 }), D = [p.childNodes[0]].reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                N.push([-1, h, h, [], D.pick.concat([[-1, 1, h + "_next"]])]), N = N.concat(D.subrules), N.push([-1, h + "_next", h + "_next", [], [[-1, 1, h + "_next"], [-1, 1, h + "_sep"]]]), N.push([-1, h + "_sep", h + "_sep", [], T.pick]), N = N.concat(T.subrules), N.push([-1, h + "_next", h + "_next", [], []]);
              } else if (p.childNodes[0].localName !== "alts") {
                const u = [p.childNodes[0]].reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                N.push([-1, h, h, [], [[-1, 1, h, h]].concat(u.pick)]), N = N.concat(u.subrules);
              } else
                p.childNodes[0].childNodes.forEach((u) => {
                  const T = u.childNodes.reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                  N.push([-1, h, h, [], [[-1, 1, h, h]].concat(T.pick)]), N = N.concat(T.subrules);
                });
              N.push([-1, h, h, [], []]), A = [[-1, 1, h, h]];
              break;
            }
            case "repeat1": {
              h = l.name + "_" + l.rule_count + "_repeat1_" + l.repeat1_count++;
              let u;
              if (p.childNodes.length === 2) {
                const T = p.childNodes[1].childNodes.reduce(o, { pick: [], subrules: [], name: h + "_sep", rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                u = [p.childNodes[0]].reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 }), N.push([-1, h, h, [], [[-1, 1, h, h]].concat(T.pick.concat(u.pick))]), N = N.concat(T.subrules), N = N.concat(u.subrules);
              } else
                u = [p.childNodes[0]].reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 }), N.push([-1, h, h, [], [[-1, 1, h, h]].concat(u.pick)]), N = N.concat(u.subrules);
              N.push([-1, h, h, [], []]), A = u.pick.concat([[-1, 1, h, h]]);
              break;
            }
          }
          return { pick: A ? l.pick.concat(A) : l.pick, subrules: l.subrules.concat(N), name: l.name, rule_count: l.rule_count, alts_count: l.alts_count, option_count: l.option_count, repeat0_count: l.repeat0_count, repeat1_count: l.repeat1_count, literal_count: l.literal_count };
        };
        _.childNodes.forEach((l, p) => {
          if (l.localName === "ns") {
            const h = l.getAttribute("prefix") ?? "", E = l.getAttribute("uri");
            d.push([h, E]);
          }
          if (l.localName === "alt") {
            const h = l.childNodes.reduce(o, { pick: [], subrules: [], name: f, rule_count: p + 1, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 }), E = _.getAttribute("mark") || "";
            i.push([s[E], f, x, d, h.pick]), i = i.concat(h.subrules);
          }
        });
      }
    });
    const a = [], r = {};
    i.forEach((_, f) => {
      const n = w.MARK_to_rulemark[_[0]] + _[1] + (_[1] !== _[2] ? ">" + _[2] : "");
      r[n] ? r[n].push(f) : (r[n] = [f], a.push(n));
    });
    const c = [];
    return a.forEach((_) => {
      r[_].forEach((f) => {
        c.push(i[f]);
      });
    }), c;
  }
  #r() {
    this.normalizingRules = [];
    for (const e of this.normalizedRules) {
      const [, t, s, , i] = e, a = [];
      let r = "", c = "";
      const _ = () => {
        if (c !== "")
          for (const f of c)
            a.push([-1, 2, f]);
        c = "", r !== "" && a.push([0, 4, r]), r = "";
      };
      for (const f of i) {
        const [n, d, x, o] = f;
        d === 2 && n === -1 ? r += x : d === 4 ? c += x : (_(), d === 1 ? a.push([n, d, x, o]) : a.push([n, d, x]));
      }
      _(), this.normalizingRules.push([-1, t, s, [], a]);
    }
    if (this.normalizingRules.length !== 0) {
      const [, e, t] = this.normalizingRules[0];
      this.normalizingRules = [[-1, "#initialRule", "#initialRule", [], [[1, 1, e, t]]], ...this.normalizingRules];
      const s = {}, i = {};
      this.normalizedRules.forEach((a) => {
        const [r, c, _] = a;
        s[c] = r, i[c] = _;
      }), this.normalizingRules.forEach((a) => {
        const r = a[4], c = [];
        r.forEach((_) => {
          const [f, n, d, x] = _, o = s[d], l = i[d], p = n === 1 && f === 0 ? o : f, h = n === 1 && d === x ? l : x;
          p === 2 ? c.push([0, 7, d, h]) : (n === 1 && p !== -1 && c.push([-1, 5, h]), n !== 1 || !x && !l ? c.push([p, n, d]) : c.push([-1, n, d, p !== -1 && n === 1 && d === x || !x ? l : x]), n === 1 && p !== -1 && c.push([-1, 6, h]));
        }), a[4] = c;
      });
    }
  }
  generateRules(e) {
    this.rules = e ?? this.#e(this.grammarElement), this.#i(), this.generateParseFunction(), this.#s(), this.normalizedRules = this.#e(this.normalizedGrammarElement), this.#r(), this.generateNormalizeFunction();
  }
}
const Z = w.MARK_to_termmark, We = w.MARK_to_rulemark, Ze = [
  [1, "ixml", "ixml", [["", "http://invisiblexml.org/NS"]], [[0, 1, "s", "s"], [-1, 1, "ixml_1_option_1", "ixml_1_option_1"], [0, 1, "rule", "rule"], [-1, 1, "ixml_1_repeat1_1", "ixml_1_repeat1_1"], [0, 1, "s", "s"]]],
  [-1, "ixml_1_option_1", "ixml_1_option_1", [], [[0, 1, "prolog", "prolog"], [0, 1, "RS", "RS"]]],
  [-1, "ixml_1_option_1", "ixml_1_option_1", [], []],
  [-1, "ixml_1_repeat1_1", "ixml_1_repeat1_1", [], [[-1, 1, "ixml_1_repeat1_1", "ixml_1_repeat1_1"], [0, 1, "RS", "RS"], [0, 1, "rule", "rule"]]],
  [-1, "ixml_1_repeat1_1", "ixml_1_repeat1_1", [], []],
  [-1, "s", "s", [], [[-1, 1, "s_1_repeat0_1", "s_1_repeat0_1"]]],
  [-1, "s_1_repeat0_1", "s_1_repeat0_1", [], [[-1, 1, "s_1_repeat0_1", "s_1_repeat0_1"], [0, 1, "whitespace", "whitespace"]]],
  [-1, "s_1_repeat0_1", "s_1_repeat0_1", [], [[-1, 1, "s_1_repeat0_1", "s_1_repeat0_1"], [0, 1, "comment", "comment"]]],
  [-1, "s_1_repeat0_1", "s_1_repeat0_1", [], []],
  [-1, "RS", "RS", [], [[-1, 1, "RS_1_repeat1_1_1_alts_1", "RS_1_repeat1_1_1_alts_1"], [-1, 1, "RS_1_repeat1_1", "RS_1_repeat1_1"]]],
  [-1, "RS_1_repeat1_1", "RS_1_repeat1_1", [], [[-1, 1, "RS_1_repeat1_1", "RS_1_repeat1_1"], [-1, 1, "RS_1_repeat1_1_1_alts_1", "RS_1_repeat1_1_1_alts_1"]]],
  [-1, "RS_1_repeat1_1", "RS_1_repeat1_1", [], []],
  [-1, "RS_1_repeat1_1_1_alts_1", "RS_1_repeat1_1_1_alts_1", [], [[0, 1, "whitespace", "whitespace"]]],
  [-1, "RS_1_repeat1_1_1_alts_1", "RS_1_repeat1_1_1_alts_1", [], [[0, 1, "comment", "comment"]]],
  [-1, "whitespace", "whitespace", [], [[-1, 3, /[\p{Zs}]/u]]],
  [-1, "whitespace", "whitespace", [], [[0, 1, "tab", "tab"]]],
  [-1, "whitespace", "whitespace", [], [[0, 1, "lf", "lf"]]],
  [-1, "whitespace", "whitespace", [], [[0, 1, "cr", "cr"]]],
  [-1, "tab", "tab", [], [[-1, 2, "	"]]],
  [-1, "lf", "lf", [], [[-1, 2, `
`]]],
  [-1, "cr", "cr", [], [[-1, 2, "\r"]]],
  [1, "comment", "comment", [], [[-1, 2, "{"], [-1, 1, "comment_1_repeat0_1", "comment_1_repeat0_1"], [-1, 2, "}"]]],
  [-1, "comment_1_repeat0_1", "comment_1_repeat0_1", [], [[-1, 1, "comment_1_repeat0_1", "comment_1_repeat0_1"], [0, 1, "cchar", "cchar"]]],
  [-1, "comment_1_repeat0_1", "comment_1_repeat0_1", [], [[-1, 1, "comment_1_repeat0_1", "comment_1_repeat0_1"], [0, 1, "comment", "comment"]]],
  [-1, "comment_1_repeat0_1", "comment_1_repeat0_1", [], []],
  [-1, "cchar", "cchar", [], [[0, 3, /[^{}]/u]]],
  [1, "prolog", "prolog", [], [[0, 1, "version", "version"]]],
  [1, "version", "version", [], [[0, 1, "version_1_literal_1", "version_1_literal_1"], [0, 1, "RS", "RS"], [0, 1, "version_1_literal_2", "version_1_literal_2"], [0, 1, "RS", "RS"], [0, 1, "string", "string"], [0, 1, "s", "s"], [-1, 2, "."]]],
  [-1, "version_1_literal_1", "version_1_literal_1", [], [[-1, 2, "i"], [-1, 2, "x"], [-1, 2, "m"], [-1, 2, "l"]]],
  [-1, "version_1_literal_2", "version_1_literal_2", [], [[-1, 2, "v"], [-1, 2, "e"], [-1, 2, "r"], [-1, 2, "s"], [-1, 2, "i"], [-1, 2, "o"], [-1, 2, "n"]]],
  [1, "rule", "rule", [], [[0, 1, "naming", "naming"], [-1, 1, "rule_1_repeat0_1", "rule_1_repeat0_1"], [-1, 3, /[=:]/u], [0, 1, "s", "s"], [-1, 1, "alts", "alts"], [-1, 2, "."]]],
  [-1, "rule_1_repeat0_1", "rule_1_repeat0_1", [], [[-1, 1, "rule_1_repeat0_1", "rule_1_repeat0_1"], [0, 1, "RS", "RS"], [0, 1, "ns", "ns"]]],
  [-1, "rule_1_repeat0_1", "rule_1_repeat0_1", [], []],
  [-1, "naming", "naming", [], [[-1, 1, "naming_1_option_1", "naming_1_option_1"], [0, 1, "name", "name"], [0, 1, "s", "s"], [-1, 1, "naming_1_option_2", "naming_1_option_2"]]],
  [-1, "naming_1_option_1", "naming_1_option_1", [], [[0, 1, "mark", "mark"], [0, 1, "s", "s"]]],
  [-1, "naming_1_option_1", "naming_1_option_1", [], []],
  [-1, "naming_1_option_2", "naming_1_option_2", [], [[-1, 2, ">"], [0, 1, "s", "s"], [0, 1, "alias", "alias"], [0, 1, "s", "s"]]],
  [-1, "naming_1_option_2", "naming_1_option_2", [], []],
  [2, "name", "name", [], [[0, 1, "namestart", "namestart"], [-1, 1, "name_1_repeat0_1", "name_1_repeat0_1"], [-1, 1, "name_1_option_1", "name_1_option_1"]]],
  [-1, "name_1_repeat0_1", "name_1_repeat0_1", [], [[-1, 1, "name_1_repeat0_1", "name_1_repeat0_1"], [0, 1, "namefollower", "namefollower"]]],
  [-1, "name_1_repeat0_1", "name_1_repeat0_1", [], []],
  [-1, "name_1_option_1", "name_1_option_1", [], [[0, 2, ":"], [0, 1, "namestart", "namestart"], [-1, 1, "name_1_option_1_1_repeat0_1", "name_1_option_1_1_repeat0_1"]]],
  [-1, "name_1_option_1", "name_1_option_1", [], []],
  [-1, "name_1_option_1_1_repeat0_1", "name_1_option_1_1_repeat0_1", [], [[-1, 1, "name_1_option_1_1_repeat0_1", "name_1_option_1_1_repeat0_1"], [0, 1, "namefollower", "namefollower"]]],
  [-1, "name_1_option_1_1_repeat0_1", "name_1_option_1_1_repeat0_1", [], []],
  [-1, "namestart", "namestart", [], [[0, 3, /[_\p{L}]/u]]],
  [-1, "namefollower", "namefollower", [], [[0, 1, "namestart", "namestart"]]],
  [-1, "namefollower", "namefollower", [], [[0, 3, /[-.·‿⁀\p{Nd}\p{Mn}]/u]]],
  [2, "alias", "alias", [], [[0, 1, "name", "name"]]],
  [1, "ns", "ns", [], [[0, 1, "ns_1_literal_1", "ns_1_literal_1"], [-1, 1, "ns_1_option_1", "ns_1_option_1"], [0, 1, "s", "s"], [-1, 2, "="], [0, 1, "s", "s"], [0, 1, "uri", "uri"]]],
  [-1, "ns_1_literal_1", "ns_1_literal_1", [], [[-1, 2, "x"], [-1, 2, "m"], [-1, 2, "l"], [-1, 2, "n"], [-1, 2, "s"]]],
  [-1, "ns_1_option_1", "ns_1_option_1", [], [[-1, 2, ":"], [0, 1, "prefix", "prefix"]]],
  [-1, "ns_1_option_1", "ns_1_option_1", [], []],
  [2, "prefix", "prefix", [], [[0, 1, "namestart", "namestart"], [-1, 1, "prefix_1_repeat0_1", "prefix_1_repeat0_1"]]],
  [-1, "prefix_1_repeat0_1", "prefix_1_repeat0_1", [], [[-1, 1, "prefix_1_repeat0_1", "prefix_1_repeat0_1"], [0, 1, "namefollower", "namefollower"]]],
  [-1, "prefix_1_repeat0_1", "prefix_1_repeat0_1", [], []],
  [2, "uri", "uri", [], [[0, 1, "string", "string"]]],
  [2, "uri", "uri", [], [[0, 1, "uri_2_literal_1", "uri_2_literal_1"]]],
  [2, "uri", "uri", [], [[0, 1, "uri_3_literal_1", "uri_3_literal_1"]]],
  [-1, "uri_2_literal_1", "uri_2_literal_1", [], [[-1, 2, '"'], [-1, 2, '"']]],
  [-1, "uri_3_literal_1", "uri_3_literal_1", [], [[-1, 2, "'"], [-1, 2, "'"]]],
  [1, "alts", "alts", [], [[0, 1, "alt", "alt"], [-1, 1, "alts_1_repeat1_1", "alts_1_repeat1_1"]]],
  [-1, "alts_1_repeat1_1", "alts_1_repeat1_1", [], [[-1, 1, "alts_1_repeat1_1", "alts_1_repeat1_1"], [-1, 1, "alts_1_repeat1_1_sep_1_alts_1", "alts_1_repeat1_1_sep_1_alts_1"], [0, 1, "alt", "alt"]]],
  [-1, "alts_1_repeat1_1", "alts_1_repeat1_1", [], []],
  [-1, "alts_1_repeat1_1_sep_1_alts_1", "alts_1_repeat1_1_sep_1_alts_1", [], [[-1, 3, /[;|]/u], [0, 1, "s", "s"]]],
  [1, "alt", "alt", [], [[-1, 1, "alt_1_repeat0_1", "alt_1_repeat0_1"]]],
  [-1, "alt_1_repeat0_1", "alt_1_repeat0_1", [], [[0, 1, "term", "term"], [-1, 1, "alt_1_repeat0_1_next"]]],
  [-1, "alt_1_repeat0_1", "alt_1_repeat0_1", [], []],
  [-1, "alt_1_repeat0_1_next", "alt_1_repeat0_1_next", [], [[-1, 1, "alt_1_repeat0_1_next"], [-1, 1, "alt_1_repeat0_1_sep"]]],
  [-1, "alt_1_repeat0_1_next", "alt_1_repeat0_1_next", [], []],
  [-1, "alt_1_repeat0_1_sep", "alt_1_repeat0_1_sep", [], [[-1, 1, "alt_1_repeat0_1_sep_1_alts_1", "alt_1_repeat0_1_sep_1_alts_1"], [0, 1, "term", "term"]]],
  [-1, "alt_1_repeat0_1_sep_1_alts_1", "alt_1_repeat0_1_sep_1_alts_1", [], [[-1, 2, ","], [0, 1, "s", "s"]]],
  [-1, "term", "term", [], [[0, 1, "factor", "factor"]]],
  [-1, "term", "term", [], [[0, 1, "option", "option"]]],
  [-1, "term", "term", [], [[0, 1, "repeat0", "repeat0"]]],
  [-1, "term", "term", [], [[0, 1, "repeat1", "repeat1"]]],
  [-1, "factor", "factor", [], [[0, 1, "terminal", "terminal"]]],
  [-1, "factor", "factor", [], [[0, 1, "nonterminal", "nonterminal"]]],
  [-1, "factor", "factor", [], [[0, 1, "attribute", "attribute"]]],
  [-1, "factor", "factor", [], [[0, 1, "insertion", "insertion"]]],
  [-1, "factor", "factor", [], [[-1, 2, "("], [0, 1, "s", "s"], [0, 1, "alts", "alts"], [-1, 2, ")"], [0, 1, "s", "s"]]],
  [1, "repeat0", "repeat0", [], [[0, 1, "factor", "factor"], [-1, 1, "repeat0_1_alts_1", "repeat0_1_alts_1"]]],
  [-1, "repeat0_1_alts_1", "repeat0_1_alts_1", [], [[-1, 2, "*"], [0, 1, "s", "s"]]],
  [-1, "repeat0_1_alts_1", "repeat0_1_alts_1", [], [[0, 1, "repeat0_1_alts_1_1_literal_1", "repeat0_1_alts_1_1_literal_1"], [0, 1, "s", "s"], [0, 1, "sep", "sep"]]],
  [-1, "repeat0_1_alts_1_1_literal_1", "repeat0_1_alts_1_1_literal_1", [], [[-1, 2, "*"], [-1, 2, "*"]]],
  [1, "repeat1", "repeat1", [], [[0, 1, "factor", "factor"], [-1, 1, "repeat1_1_alts_1", "repeat1_1_alts_1"]]],
  [-1, "repeat1_1_alts_1", "repeat1_1_alts_1", [], [[-1, 2, "+"], [0, 1, "s", "s"]]],
  [-1, "repeat1_1_alts_1", "repeat1_1_alts_1", [], [[0, 1, "repeat1_1_alts_1_1_literal_1", "repeat1_1_alts_1_1_literal_1"], [0, 1, "s", "s"], [0, 1, "sep", "sep"]]],
  [-1, "repeat1_1_alts_1_1_literal_1", "repeat1_1_alts_1_1_literal_1", [], [[-1, 2, "+"], [-1, 2, "+"]]],
  [1, "option", "option", [], [[0, 1, "factor", "factor"], [-1, 2, "?"], [0, 1, "s", "s"]]],
  [2, "mark", "mark", [], [[0, 3, /[@\\^\\-]/u]]],
  [1, "sep", "sep", [], [[0, 1, "factor", "factor"]]],
  [1, "nonterminal", "nonterminal", [], [[0, 1, "naming", "naming"]]],
  [-1, "terminal", "terminal", [], [[0, 1, "literal", "literal"]]],
  [-1, "terminal", "terminal", [], [[0, 1, "charset", "charset"]]],
  [-1, "terminal", "terminal", [], [[0, 1, "starttag", "starttag"]]],
  [-1, "terminal", "terminal", [], [[0, 1, "endtag", "endtag"]]],
  [1, "literal", "literal", [], [[0, 1, "quoted", "quoted"]]],
  [1, "literal", "literal", [], [[0, 1, "encoded", "encoded"]]],
  [-1, "quoted", "quoted", [], [[-1, 1, "quoted_1_option_1", "quoted_1_option_1"], [0, 1, "string", "string"], [0, 1, "s", "s"]]],
  [-1, "quoted_1_option_1", "quoted_1_option_1", [], [[0, 1, "tmark", "tmark"], [0, 1, "s", "s"]]],
  [-1, "quoted_1_option_1", "quoted_1_option_1", [], []],
  [2, "tmark", "tmark", [], [[0, 3, /[-^]/u]]],
  [2, "string", "string", [], [[-1, 2, '"'], [0, 1, "dchar", "dchar"], [-1, 1, "string_1_repeat1_1", "string_1_repeat1_1"], [-1, 2, '"']]],
  [2, "string", "string", [], [[-1, 2, "'"], [0, 1, "schar", "schar"], [-1, 1, "string_2_repeat1_1", "string_2_repeat1_1"], [-1, 2, "'"]]],
  [-1, "string_1_repeat1_1", "string_1_repeat1_1", [], [[-1, 1, "string_1_repeat1_1", "string_1_repeat1_1"], [0, 1, "dchar", "dchar"]]],
  [-1, "string_1_repeat1_1", "string_1_repeat1_1", [], []],
  [-1, "string_2_repeat1_1", "string_2_repeat1_1", [], [[-1, 1, "string_2_repeat1_1", "string_2_repeat1_1"], [0, 1, "schar", "schar"]]],
  [-1, "string_2_repeat1_1", "string_2_repeat1_1", [], []],
  [1, "dchar", "dchar", [], [[0, 3, /[^"\p{Cc}]/u]]],
  [1, "dchar", "dchar", [], [[0, 2, '"'], [-1, 2, '"']]],
  [1, "schar", "schar", [], [[0, 3, /[^'\p{Cc}]/u]]],
  [1, "schar", "schar", [], [[0, 2, "'"], [-1, 2, "'"]]],
  [-1, "encoded", "encoded", [], [[-1, 1, "encoded_1_option_1", "encoded_1_option_1"], [-1, 2, "#"], [0, 1, "hex", "hex"], [0, 1, "s", "s"]]],
  [-1, "encoded_1_option_1", "encoded_1_option_1", [], [[0, 1, "tmark", "tmark"], [0, 1, "s", "s"]]],
  [-1, "encoded_1_option_1", "encoded_1_option_1", [], []],
  [2, "hex", "hex", [], [[0, 3, /[0-9a-fA-F]/u], [-1, 1, "hex_1_repeat1_1", "hex_1_repeat1_1"]]],
  [-1, "hex_1_repeat1_1", "hex_1_repeat1_1", [], [[-1, 1, "hex_1_repeat1_1", "hex_1_repeat1_1"], [0, 3, /[0-9a-fA-F]/u]]],
  [-1, "hex_1_repeat1_1", "hex_1_repeat1_1", [], []],
  [-1, "charset", "charset", [], [[0, 1, "inclusion", "inclusion"]]],
  [-1, "charset", "charset", [], [[0, 1, "exclusion", "exclusion"]]],
  [1, "inclusion", "inclusion", [], [[-1, 1, "inclusion_1_option_1", "inclusion_1_option_1"], [0, 1, "set", "set"]]],
  [-1, "inclusion_1_option_1", "inclusion_1_option_1", [], [[0, 1, "tmark", "tmark"], [0, 1, "s", "s"]]],
  [-1, "inclusion_1_option_1", "inclusion_1_option_1", [], []],
  [1, "exclusion", "exclusion", [], [[-1, 1, "exclusion_1_option_1", "exclusion_1_option_1"], [-1, 2, "~"], [0, 1, "s", "s"], [0, 1, "set", "set"]]],
  [-1, "exclusion_1_option_1", "exclusion_1_option_1", [], [[0, 1, "tmark", "tmark"], [0, 1, "s", "s"]]],
  [-1, "exclusion_1_option_1", "exclusion_1_option_1", [], []],
  [-1, "set", "set", [], [[-1, 2, "["], [0, 1, "s", "s"], [-1, 1, "set_1_repeat0_1", "set_1_repeat0_1"], [-1, 2, "]"], [0, 1, "s", "s"]]],
  [-1, "set_1_repeat0_1", "set_1_repeat0_1", [], [[-1, 1, "set_1_repeat0_1_1_alts_1", "set_1_repeat0_1_1_alts_1"], [-1, 1, "set_1_repeat0_1_next"]]],
  [-1, "set_1_repeat0_1", "set_1_repeat0_1", [], []],
  [-1, "set_1_repeat0_1_1_alts_1", "set_1_repeat0_1_1_alts_1", [], [[0, 1, "member", "member"], [0, 1, "s", "s"]]],
  [-1, "set_1_repeat0_1_next", "set_1_repeat0_1_next", [], [[-1, 1, "set_1_repeat0_1_next"], [-1, 1, "set_1_repeat0_1_sep"]]],
  [-1, "set_1_repeat0_1_next", "set_1_repeat0_1_next", [], []],
  [-1, "set_1_repeat0_1_sep", "set_1_repeat0_1_sep", [], [[-1, 1, "set_1_repeat0_1_sep_1_alts_1", "set_1_repeat0_1_sep_1_alts_1"], [-1, 1, "set_1_repeat0_1_sep_1_alts_2", "set_1_repeat0_1_sep_1_alts_2"]]],
  [-1, "set_1_repeat0_1_sep_1_alts_1", "set_1_repeat0_1_sep_1_alts_1", [], [[-1, 3, /[;|]/u], [0, 1, "s", "s"]]],
  [-1, "set_1_repeat0_1_sep_1_alts_2", "set_1_repeat0_1_sep_1_alts_2", [], [[0, 1, "member", "member"], [0, 1, "s", "s"]]],
  [1, "member", "member", [], [[0, 1, "string", "string"]]],
  [1, "member", "member", [], [[-1, 2, "#"], [0, 1, "hex", "hex"]]],
  [1, "member", "member", [], [[0, 1, "range", "range"]]],
  [1, "member", "member", [], [[0, 1, "class", "class"]]],
  [-1, "range", "range", [], [[0, 1, "from", "from"], [0, 1, "s", "s"], [-1, 2, "-"], [0, 1, "s", "s"], [0, 1, "to", "to"]]],
  [2, "from", "from", [], [[0, 1, "character", "character"]]],
  [2, "to", "to", [], [[0, 1, "character", "character"]]],
  [-1, "character", "character", [], [[-1, 2, '"'], [0, 1, "dchar", "dchar"], [-1, 2, '"']]],
  [-1, "character", "character", [], [[-1, 2, "'"], [0, 1, "schar", "schar"], [-1, 2, "'"]]],
  [-1, "character", "character", [], [[0, 2, "#"], [0, 1, "hex", "hex"]]],
  [-1, "class", "class", [], [[0, 1, "code", "code"]]],
  [2, "code", "code", [], [[0, 1, "capital", "capital"], [-1, 1, "code_1_option_1", "code_1_option_1"]]],
  [-1, "code_1_option_1", "code_1_option_1", [], [[0, 1, "letter", "letter"]]],
  [-1, "code_1_option_1", "code_1_option_1", [], []],
  [-1, "capital", "capital", [], [[0, 3, /[A-Z]/u]]],
  [-1, "letter", "letter", [], [[0, 3, /[A-Za-z]/u]]],
  [1, "starttag", "starttag", [], [[-1, 2, "<"], [0, 1, "s", "s"], [0, 1, "name", "name"], [-1, 1, "starttag_1_repeat0_1", "starttag_1_repeat0_1"], [0, 1, "s", "s"], [-1, 2, ">"], [0, 1, "s", "s"]]],
  [-1, "starttag_1_repeat0_1", "starttag_1_repeat0_1", [], [[-1, 1, "starttag_1_repeat0_1", "starttag_1_repeat0_1"], [0, 1, "RS", "RS"], [0, 1, "ns", "ns"]]],
  [-1, "starttag_1_repeat0_1", "starttag_1_repeat0_1", [], []],
  [1, "endtag", "endtag", [], [[0, 1, "endtag_1_literal_1", "endtag_1_literal_1"], [0, 1, "s", "s"], [0, 1, "name", "name"], [0, 1, "s", "s"], [-1, 2, ">"], [0, 1, "s", "s"]]],
  [-1, "endtag_1_literal_1", "endtag_1_literal_1", [], [[-1, 2, "<"], [-1, 2, "/"]]],
  [1, "attribute", "attribute", [], [[0, 1, "attribute_1_literal_1", "attribute_1_literal_1"], [0, 1, "s", "s"], [0, 1, "name", "name"], [0, 1, "s", "s"], [-1, 2, ">"], [0, 1, "s", "s"]]],
  [-1, "attribute_1_literal_1", "attribute_1_literal_1", [], [[-1, 2, "<"], [-1, 2, "@"]]],
  [1, "insertion", "insertion", [], [[-1, 2, "+"], [0, 1, "s", "s"], [-1, 1, "insertion_1_alts_1", "insertion_1_alts_1"], [0, 1, "s", "s"]]],
  [-1, "insertion_1_alts_1", "insertion_1_alts_1", [], [[0, 1, "string", "string"]]],
  [-1, "insertion_1_alts_1", "insertion_1_alts_1", [], [[-1, 2, "#"], [0, 1, "hex", "hex"]]]
], qe = (m) => {
  const e = new w();
  return ae(Ze, m, null, null, e), e.generateRules(), e;
}, Ve = (m) => {
  const e = new w();
  return S(m.documentElement ?? m, e), e.generateRules(), e;
}, Qe = ([m, e]) => {
  const t = new w();
  return t.rules = m, t.generateParseFunction(), t.normalizingRules = e, t.generateNormalizeFunction(), t;
}, et = (m) => {
  const e = new w();
  return e.fromString(m), e.generateRules(), e;
};
export {
  qe as fromIXml,
  Ve as fromNode,
  Qe as fromRules,
  et as fromXml,
  re as richJSONstringify
};
