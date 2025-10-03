class V {
  constructor(t, e) {
    if (this.nodeType = 2, this.nodeName = e, t) {
      this.namespaceURI = t;
      const n = e.split(":");
      this.prefix = n.length > 1 ? n[0] : "", this.localName = n.length > 1 ? n[1] : n[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = e;
    this.name = e, this.value = "";
  }
  appendChild(t) {
    t && (this.value += t.textContent || "");
  }
}
class dt {
  constructor(t, e) {
    this.nodeType = 133, this.URI = t ?? "", this.prefix = e ?? "";
  }
}
class j {
  attributes = [];
  namespaces = [];
  childNodes = [];
  nodeType = 1;
  parentNode = null;
  previousSibling = null;
  nextSibling = null;
  constructor(t, e) {
    if (this.nodeName = e, t) {
      this.namespaceURI = t;
      const n = e.split(":");
      this.prefix = n.length > 1 ? n[0] : "", this.localName = n.length > 1 ? n[1] : n[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = e;
  }
  appendChild(t) {
    t && (t.previousSibling = this.childNodes[this.childNodes.length - 1], t.previousSibling && (t.previousSibling.nextSibling = t), this.childNodes.push(t), t.parentNode = this);
  }
  removeChild(t) {
    t.previousSibling && (t.previousSibling.nextSibling = t.nextSibling), this.childNodes = this.childNodes.filter((e) => e !== t);
  }
  getAttribute(t) {
    for (let e = 0, n = this.attributes.length; e < n; e++)
      if (this.attributes[e].name === t)
        return this.attributes[e].value;
    return "";
  }
  getAttributeNS(t, e) {
    const n = e.split(":"), s = n.length > 1 ? n[1] : n[0];
    for (let a = 0, r = this.attributes.length; a < r; a++)
      if (this.attributes[a].namespaceURI === t && this.attributes[a].localName === s)
        return this.attributes[a].value;
    return "";
  }
  setAttributeNS(t, e, n) {
    if (t === "http://www.w3.org/2000/xmlns/")
      this.setNamespace(n, e === "xmlns" ? "" : e.slice(6));
    else {
      const s = e.split(":"), a = s.length > 1 ? s[1] : s[0];
      for (let c = 0, _ = this.attributes.length; c < _; c++)
        if (this.attributes[c].namespaceURI === t && this.attributes[c].localName === a) {
          this.attributes[c].value = n;
          return;
        }
      const r = new V(t, e);
      r.value = n, this.attributes.push(r), r.ownerElement = this;
    }
  }
  setAttribute(t, e) {
    this.setAttributeNS("", t, e);
  }
  setAttributeNodeNS(t) {
    for (let e = 0, n = this.attributes.length; e < n; e++)
      if (this.attributes[e].namespaceURI === t.namespaceURI && this.attributes[e].localName === t.localName) {
        this.attributes[e] = t;
        return;
      }
    this.attributes.push(t), t.ownerElement = this;
  }
  setAttributeNode(t) {
    this.setAttributeNodeNS(t);
  }
  removeAttribute(t) {
    this.attributes = this.attributes.filter((e) => e.name !== t);
  }
  setNamespace(t, e) {
    const n = new dt(t, e);
    this.namespaces.push(n);
  }
}
class ot {
  constructor(t) {
    this.nodeType = 3, this.textContent = t ?? "";
  }
}
class Et {
  constructor() {
    this.nodeType = 132, this.childNodes = [];
  }
  appendChild(t) {
    t && this.childNodes.push(t);
  }
}
const lt = (m) => m.replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[t]), Nt = (m) => m.replace(/[&<]/g, (t) => ({ "&": "&amp;", "<": "&lt;" })[t]);
class ct {
  textContent = "";
  attributes = [];
  constructor(t, e) {
    if (this.nodeName = e, t) {
      this.namespaceURI = t;
      const n = e.split(":");
      this.prefix = n.length > 1 ? n[0] : "", this.localName = n.length > 1 ? n[1] : n[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = e;
  }
  toParentNode() {
    if (this.nodeName) {
      let t = "<" + this.nodeName;
      if (this.attributes.length !== 0) {
        const e = [], n = [];
        this.attributes.forEach((s) => {
          s.name === "xmlns" ? e.unshift(s) : s.name.startsWith("xmlns:") ? e.push(s) : n.push(s);
        }), e.sort((s, a) => s.name === "xmlns" ? -1 : a.name === "xmlns" ? 1 : s.name.localeCompare(a.name)), n.sort((s, a) => {
          const r = s.name.split(":"), c = a.name.split(":"), _ = r.length > 1 ? r[0] : "", f = r.length > 1 ? r[1] : r[0], i = c.length > 1 ? c[0] : "", d = c.length > 1 ? c[1] : c[0];
          return _ < i ? -1 : _ > i ? 1 : f.localeCompare(d);
        });
        for (let s = 0, a = e.length; s < a; s++)
          t += " " + e[s].name + '="' + lt(e[s].value) + '"';
        for (let s = 0, a = n.length; s < a; s++)
          t += " " + n[s].name + '="' + lt(n[s].value) + '"';
      }
      return this.textContent ? t += ">" + this.textContent + (this.ownerDocument.indent && this.textContent.startsWith(`
`) ? `
` : "") + "</" + this.nodeName + ">" : t += "/>", t;
    }
    return this.textContent;
  }
  appendChild(t) {
    const e = t.toParentNode(this);
    if (this.ownerDocument.indent) {
      const n = " ".repeat(this.ownerDocument.indent);
      e.startsWith("<") || this.textContent ? (this.textContent && !this.textContent.startsWith(`
`) && (this.textContent = `
` + n + this.textContent), this.textContent += `
` + n + e.replace(/\n/g, `
` + n)) : this.textContent += e;
    } else
      this.textContent += e;
  }
  setAttributeNS(t, e, n) {
    const s = e.split(":"), a = s.length > 1 ? s[1] : s[0];
    for (let c = 0, _ = this.attributes.length; c < _; c++)
      if (this.attributes[c].namespaceURI === t && this.attributes[c].localName === a) {
        this.attributes[c].value = n;
        return;
      }
    const r = new V(t, e);
    r.value = n, this.attributes.push(r);
  }
  setAttributeNodeNS(t) {
    this.attributes.push(t);
  }
}
class ut {
  constructor(t, e) {
    if (this.nodeName = e, t) {
      this.namespaceURI = t;
      const n = e.split(":");
      this.prefix = n.length > 1 ? n[0] : "", this.localName = n.length > 1 ? n[1] : n[0];
    } else
      this.namespaceURI = "", this.prefix = "", this.localName = e;
    this.name = e, this.value = "";
  }
  appendChild(t) {
    t && (this.value += t.textContent || "");
  }
}
class gt {
  constructor(t) {
    this.textContent = Nt(t);
  }
  toParentNode() {
    return this.textContent;
  }
}
class B {
  constructor(t) {
    this.textContent = "", this.indent = t;
  }
  createElement(t) {
    const e = new ct("", t);
    return e.ownerDocument = this, e;
  }
  createElementNS(t, e) {
    const n = new ct(t, e);
    return n.ownerDocument = this, n;
  }
  createAttribute(t) {
    return new ut("", t);
  }
  createAttributeNS(t, e) {
    return new ut(t, e);
  }
  createTextNode(t) {
    return new gt(t);
  }
  appendChild(t) {
    this.textContent = `<?xml version="1.0" encoding="UTF-8"?>
` + t.toParentNode();
  }
}
class _t {
  textContent = "";
  attributes = "";
  childNodes = "";
  ownerDocument = null;
  constructor(t, e, n) {
    const [s, a] = t && e.includes(":") ? e.split(":") : [null, e];
    this.textContent = [
      '"nodeType": 1,',
      `"nodeName": "${e}",`,
      `"namespaceURI": ${JSON.stringify(t || null)},`,
      `"prefix": ${JSON.stringify(s)},`,
      `"localName": "${a}"`
    ].join(n ? `
` : " ");
  }
  setAttributeNS(t, e, n) {
    const [s, a] = t && e.includes(":") ? e.split(":") : [null, e], { indent: r } = this.ownerDocument;
    let c = [
      '"nodeType": 2,',
      `"nodeName": "${e}",`,
      `"namespaceURI": ${JSON.stringify(t || null)},`,
      `"prefix": ${JSON.stringify(s)},`,
      `"localName": "${a}",`,
      `"value": ${JSON.stringify(n)}`
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
  appendChild(t) {
    const e = t.toParentNode(this), { indent: n } = this.ownerDocument;
    if (n) {
      const s = " ".repeat(this.ownerDocument.indent);
      this.childNodes += `${this.childNodes ? `,
` : `
`}${s}${e.replaceAll(`
`, `
${s}`)}`;
    } else
      this.childNodes += `${this.childNodes ? ", " : ""}${e}`;
  }
  toParentNode() {
    const { indent: t } = this.ownerDocument, e = t ? `
` : "";
    let n = [
      `${e}${this.textContent},`,
      `"attributes": [${this.attributes ? this.attributes + e : ""}],`,
      `"childNodes": [${this.childNodes ? this.childNodes + e : ""}]`
    ].join(t ? `
` : " ");
    if (t) {
      const s = " ".repeat(t);
      n = n.replaceAll(`
`, `
${s}`);
    }
    return `{${n}${e}}`;
  }
}
const bt = (m) => m.split("-").map(([t, ...e]) => t.toUpperCase() + e.join("")).join(""), U = (m) => m.includes('"') ? m.includes("'") ? `"${m.replaceAll('"', '""')}"` : `'${m}'` : `"${m}"`, At = (m) => m.includes("'") ? m.includes('"') ? `'${m.replaceAll("'", "\\'").replace(/\r?\n/g, "\\n")}'` : `"${m.replace(/\r?\n/g, "\\n")}"` : `'${m.replace(/\r?\n/g, "\\n")}'`;
class Tt {
  textContent = "";
  ownerDocument = null;
  constructor(t, e) {
    this.textContent = `"nodeType": 3,${e ? `
` : " "}"textContent": ${At(t)}`;
  }
  toParentNode() {
    const { indent: t } = this.ownerDocument, e = t ? `
` : "";
    let n = `${e}${this.textContent}`;
    if (t) {
      const s = " ".repeat(t);
      n = n.replaceAll(`
`, `
${s}`);
    }
    return `{${n}${e}}`;
  }
}
class ht {
  textContent = "";
  indent = 0;
  constructor(t) {
    this.indent = t;
  }
  createElement(t) {
    const e = new _t("", t, this.indent);
    return e.ownerDocument = this, e;
  }
  createElementNS(t, e) {
    const n = new _t(t, e, this.indent);
    return n.ownerDocument = this, n;
  }
  createTextNode(t) {
    const e = new Tt(t, this.indent);
    return e.ownerDocument = this, e;
  }
  appendChild(t) {
    this.textContent = t.toParentNode();
  }
}
function Rt(m, t) {
  const e = {
    amp: "&",
    lt: "<",
    gt: ">",
    apos: "'",
    quot: '"'
  }, [n, ...s] = t.split("&");
  return s.reduce((a, r) => {
    const [c, ..._] = r.split(";"), f = c.startsWith("#") ? String.fromCharCode(c[1] === "x" ? parseInt(c.slice(2), 16) : parseInt(c.slice(1), 10)) : e[c] ?? m?.getEntity(c);
    return a + (f ?? `&${c};`) + _.join(";");
  }, n);
}
function K(m, t, e) {
  const n = e.substring(0, t).split(`
`).length, s = t - e.lastIndexOf(`
`, t - 1) + 1;
  return `Error: ${m} at line ${n}, column ${s}`;
}
function Q(m) {
  if (typeof m != "string" || !m)
    return !1;
  const t = m.indexOf(":");
  if (t !== -1) {
    if (t === 0 || t === m.length - 1 || m.indexOf(":", t + 1) !== -1)
      return !1;
    const r = m.substring(0, t), c = m.substring(t + 1);
    return Q(r) && Q(c);
  }
  const e = (r) => r >= 65 && r <= 90 || r === 95 || r >= 97 && r <= 122 || r >= 192 && r <= 214 || r >= 216 && r <= 246 || r >= 248 && r <= 767 || r >= 880 && r <= 893 || r >= 895 && r <= 8191 || r >= 8204 && r <= 8205 || r >= 8304 && r <= 8591 || r >= 11264 && r <= 12271 || r >= 12289 && r <= 55295 || r >= 63744 && r <= 64975 || r >= 65008 && r <= 65533 || r >= 65536 && r <= 983039, n = (r) => e(r) || r === 45 || r === 46 || r >= 48 && r <= 57 || r === 183 || r >= 768 && r <= 879 || r >= 8255 && r <= 8256;
  let s = 0, a = m.codePointAt(s);
  if (!e(a))
    return !1;
  for (s += a > 65535 ? 2 : 1; s < m.length; ) {
    if (a = m.codePointAt(s), !n(a))
      return !1;
    s += a > 65535 ? 2 : 1;
  }
  return !0;
}
function pt(m) {
  return Q(m) && !/^[Xx][Mm][Ll]/.test(m);
}
const nt = 0;
function mt(m, t, e, n) {
  e = e ?? nt;
  for (var s, a, r, c, _, f, i = 0, d = t.length, x, o, l, p, h = [], E = m.ownerDocument || m, S = m, A, N, u, T = ` 	
\r?`, C = ` 	
\r[>`, $ = ` 	
\r>`, k = ` 	
\r/>`, G = ` 	
\r=/<>'"`, R = ` 	
\r`, D, I = { xmlns: "http://www.w3.org/2000/xmlns/", xml: "http://www.w3.org/XML/1998/namespace" }, L = {}, y, g, J, Y, F, X, P, et, v; i !== d; ) {
    for (r = "", u = t.charAt(i); u !== "<" && i !== d; ) {
      if (u === "&") {
        for (u = t.charAt(++i), c = i, _ = ""; u !== ";" && i !== d; )
          _ += u, u = t.charAt(++i);
        if (i === d)
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
            _.charAt(0) === "#" ? r += String.fromCharCode(parseInt(_.charAt(1).toLowerCase() === "x" ? "0" + _.substring(1).toLowerCase() : _.substring(1), _.charAt(1).toLowerCase() === "x" ? 16 : 10)) : E.doctype && (P = E.doctype.getEntity(_), t = t.substring(0, c - 1) + P + t.substring(i + 1), i = c - 2, d = t.length);
        }
      } else
        r += u;
      u = t.charAt(++i);
    }
    if (r.trim() !== "" && S.appendChild(E.createTextNode(r.trim())), i === d)
      break;
    if (i++, t.charAt(i) === "!") {
      if (i++, t.substr(i, 2) === "--") {
        if (i += 2, f = t.indexOf("-->", i), f !== i) {
          for (f === -1 && (f = d), r = "", s = i; s < f; )
            r += t.charAt(s++);
          if (S.appendChild(E.createComment(r)), f === d)
            break;
          i = f;
        }
        i += 3;
      } else if (t.substr(i, 7) === "[CDATA[") {
        if (i += 7, f = t.indexOf("]]>", i), f !== i) {
          for (f === -1 && (f = d), r = "", s = i; s < f; )
            r += t.charAt(s++);
          if (S.appendChild(E.createCDATASection(r)), f === d)
            break;
          i = f;
        }
        i += 3;
      } else if (t.substr(i, 7) === "DOCTYPE") {
        for (i += 7, f = t.indexOf(">", i); R.indexOf(u) !== -1; )
          u = t.charAt(i++);
        for (x = ""; C.indexOf(u) === -1 && i !== d; )
          x += u, u = t.charAt(i++);
        for (; R.indexOf(u) !== -1; )
          u = t.charAt(i++);
        for (Y = ""; C.indexOf(u) === -1 && i !== d; )
          Y += u, u = t.charAt(i++);
        if (Y === "PUBLIC" || Y === "SYSTEM") {
          if (Y === "PUBLIC") {
            for (; R.indexOf(u) !== -1; )
              u = t.charAt(i++);
            for (F = "", s = i, a = Math.min(f - 1, t.indexOf(u, i)); s < a; )
              F += t.charAt(s++);
            i += F.length + 1, u = t.charAt(i++);
          }
          for (; R.indexOf(u) !== -1; )
            u = t.charAt(i++);
          for (X = "", s = i, a = Math.min(f - 1, t.indexOf(u, i)); s < a; )
            X += t.charAt(s++);
          for (i += X.length + 1, u = t.charAt(i++); R.indexOf(u) !== -1; )
            u = t.charAt(i++);
        } else
          F = X = null;
        if (E.implementation && (S.appendChild(E.doctype = E.implementation.createDocumentType(x, F, X)), E.doctype.ownerDocument = E), u === "[") {
          for (f = t.indexOf("]", i), u = t.charAt(i++); u !== "]" && i < d; ) {
            for (; R.indexOf(u) !== -1; )
              u = t.charAt(i++);
            if (u === "]")
              break;
            if (t.substr(i, 7) === "!ENTITY") {
              for (i += 7, u = t.charAt(i++); R.indexOf(u) !== -1; )
                u = t.charAt(i++);
              if (u === "%")
                for (u = t.charAt(i++); R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
              for (x = ""; C.indexOf(u) === -1; )
                x += u, u = t.charAt(i++);
              for (; R.indexOf(u) !== -1; )
                u = t.charAt(i++);
              if (t.substr(i - 1, 6) === "SYSTEM")
                for (i += 5, u = t.charAt(i++); R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
              else if (t.substr(i - 1, 6) === "PUBLIC") {
                for (i += 5, u = t.charAt(i++); R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
                for (; C.indexOf(u) === -1 && i !== d; )
                  u = t.charAt(i++);
                for (; R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
              }
              for (P = "", s = i, a = Math.min(f - 1, t.indexOf(u, i)); s < a; )
                P += t.charAt(s++);
              i += P.length + 1, u = t.charAt(i++), E.doctype.setEntity(x, P);
            } else if (t.substr(i, 9) === "!NOTATION") {
              for (i += 9, u = t.charAt(i++); R.indexOf(u) !== -1; )
                u = t.charAt(i++);
              for (x = ""; C.indexOf(u) === -1 && i !== d; )
                x += u, u = t.charAt(i++);
              for (; R.indexOf(u) !== -1; )
                u = t.charAt(i++);
              if (t.substr(i - 1, 6) === "SYSTEM")
                for (i += 5, u = t.charAt(i++); R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
              else if (t.substr(i - 1, 6) === "PUBLIC") {
                for (i += 5, u = t.charAt(i++); R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
                for (; C.indexOf(u) === -1 && i !== d; )
                  u = t.charAt(i++);
                for (; R.indexOf(u) !== -1; )
                  u = t.charAt(i++);
              }
              if (u === '"' || u === "'") {
                for (et = "", s = i, a = Math.min(f - 1, t.indexOf(u, i)); s < a; )
                  et += t.charAt(s++);
                i += et.length + 1, u = t.charAt(i++);
              }
            }
            i = t.indexOf(">", i - 1) + 1, u = t.charAt(i++);
          }
          f = t.indexOf(">", i);
        }
        if (f !== i) {
          if (f === -1 && (f = d), f === d)
            break;
          i = f;
        }
        i++;
      }
    } else if (t.charAt(i) === "?") {
      for (i++, u = t.charAt(i++), x = ""; T.indexOf(u) === -1 && i !== d; )
        x += u, u = t.charAt(i++);
      if (f = t.indexOf("?>", i - 1), f === -1 && (f = d), x === "xml") {
        if (i != 6)
          throw new Error(K("Invalid position for XML declaration", i - 7, t));
        t.charCodeAt(f + 2) === 13 && f++, t.charCodeAt(f + 2) === 10 && f++;
      } else if (x !== "") {
        for (r = "", s = i; s < f; )
          r += t.charAt(s++);
        S.appendChild(E.createProcessingInstruction(x, f === i - 1 ? "" : r));
      }
      if (f === d)
        break;
      i = f + 2;
    } else if (t.charAt(i) === "/") {
      for (i++, u = t.charAt(i++), x = ""; $.indexOf(u) === -1 && i !== d; )
        x += u, u = t.charAt(i++);
      if (!pt(x))
        throw new Error(K("Invalid XML element name", i - 2 - x.length, t));
      if (x === A) {
        D = h.pop(), I = {};
        for (g in D.namespaces)
          Object.prototype.hasOwnProperty.call(D.namespaces, g) && (I[g] = D.namespaces[g]);
        S = D.node, A = D.nodeName;
      } else {
        if (e === nt)
          throw new Error(K("Not well-formed XML", i - 2 - x.length, t));
        for (; h.length !== 0; )
          if (D = h.pop(), x === D.node.nodeName) {
            I = {};
            for (g in D.namespaces)
              Object.prototype.hasOwnProperty.call(D.namespaces, g) && (I[g] = D.namespaces[g]);
            S = D.node, A = D.nodeName;
            break;
          }
      }
      if (i = t.indexOf(">", i - 1) + 1, i === 0)
        break;
    } else {
      for (u = t.charAt(i++), x = ""; k.indexOf(u) === -1 && i !== d; )
        x += u, u = t.charAt(i++);
      if (f = t.indexOf(">", i - 1), x !== "") {
        if (!pt(x))
          throw new Error(K("Invalid XML element name", i - 2 - x.length, t));
        L = {};
        for (g in I)
          Object.prototype.hasOwnProperty.call(I, g) && (L[g] = I[g]);
        for (p = {}; i !== d; ) {
          for (; R.indexOf(u) !== -1; )
            u = t.charAt(i++);
          if (G.indexOf(u) !== -1 || i === d)
            break;
          for (o = ""; G.indexOf(u) === -1 && i !== d; )
            o += u, u = t.charAt(i++);
          if (o !== "") {
            if (o !== "xmlns" && !Q(o))
              throw new Error(K("Invalid XML attribute name", i - 2 - o.length, t));
            for (; R.indexOf(u) !== -1 && i !== d; )
              u = t.charAt(i++);
            if (u === "=") {
              for (u = t.charAt(i++); R.indexOf(u) !== -1 && i !== d; )
                u = t.charAt(i++);
              if (l = "", u === "'" || u === '"') {
                l = "", s = i;
                const at = t.indexOf(u, i);
                if (at !== -1) {
                  for (a = Math.min(f - 1, at); s < a; )
                    l += t.charAt(s++);
                  i += l.length + 1, u = t.charAt(i++);
                } else
                  i = d;
              } else
                for (; k.indexOf(u) === -1 && i !== d; )
                  l += u, u = t.charAt(i++);
            } else
              l = o;
            y = o.indexOf(":"), g = y !== -1 ? o.substring(0, y) : "", J = y !== -1 ? o.substring(y + 1) : o, g === "xmlns" ? L[J] = l : g === "" && J === "xmlns" && (L[""] = l), p[g] || (p[g] = {}), p[g][J] = l;
          }
        }
        y = x.indexOf(":"), v = L[y !== -1 ? x.substring(0, y) : ""], N = E.createElementNS(v, x), E._elementsByTagName && (E._elementsByTagName[v] ? E._elementsByTagName[v][x] ? E._elementsByTagName[v][x].push(N) : E._elementsByTagName[v][x] = [N] : (E._elementsByTagName[v] = {}, E._elementsByTagName[v][x] = [N]));
        for (g in p)
          if (Object.prototype.hasOwnProperty.call(p, g)) {
            if (g !== "" && !(g in L))
              throw new Error(K(`Prefix '${g}' not declared`, i - 2 - o.length, t));
            for (o in p[g])
              Object.prototype.hasOwnProperty.call(p[g], o) && (l = Rt(E.doctype, p[g][o]), E._elementById && o === "id" && (g === "" || g === "xml") && (E._elementById[l] = N), N.setAttributeNS(g !== "" ? L[g] : o === "xmlns" ? "http://www.w3.org/2000/xmlns/" : null, g !== "" ? g + ":" + o : o, l));
          }
        if (S.appendChild(N), t.charAt(i - 1) !== "/") {
          h.push({ node: S, nodeName: A, namespaces: I }), S = N, A = x, I = {};
          for (g in L)
            Object.prototype.hasOwnProperty.call(L, g) && (I[g] = L[g]);
        }
      }
      if (i = f + 1, i === 0)
        break;
    }
  }
  if (h.length !== 0 && e === nt)
    throw new Error(K("Not well-formed XML", i - 2 - x.length, t));
}
const M = (m, t) => {
  const e = t.ownerDocument ?? t;
  switch (m.nodeType) {
    case 1: {
      const n = e.createElementNS(m.namespaceURI, m.nodeName);
      if (m.namespaces)
        for (const s of m.namespaces)
          n.setAttributeNS("http://www.w3.org/2000/xmlns/", s.prefix ? `xmlns:${s.prefix}` : "xmlns", s.URI);
      for (const s of m.attributes)
        M(s, n);
      for (const s of m.childNodes)
        M(s, n);
      t.appendChild(n);
      break;
    }
    case 2: {
      t.setAttributeNS(m.namespaceURI, m.name, m.value);
      break;
    }
    case 3: {
      t.appendChild(e.createTextNode(m.textContent));
      break;
    }
  }
}, Mt = {
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
  doctype = Mt;
  documentElement = null;
  childNodes = [];
  nodeType = 0;
  constructor(t) {
    t && this.fromString(t);
  }
  createElement(t) {
    const e = new j("", t);
    return e.ownerDocument = this, e;
  }
  createElementNS(t, e) {
    const n = new j(t, e);
    return n.ownerDocument = this, n;
  }
  createAttribute(t) {
    return new V("", t);
  }
  createAttributeNS(t, e) {
    return new V(t, e);
  }
  createNamespace(t, e) {
    return new dt(t, e);
  }
  createTextNode(t) {
    return new ot(t);
  }
  createComment() {
    return null;
  }
  createProcessingInstruction() {
    return null;
  }
  createCDATASection(t) {
    return new ot(t);
  }
  createArray() {
    return new Et();
  }
  appendChild(t) {
    t && t.nodeType === 1 && (this.documentElement = t), this.childNodes.push(t);
  }
  fromString(t) {
    mt(this, t);
  }
  toString() {
    const t = new B();
    return M(this.documentElement, t), t.textContent;
  }
  toNode(t) {
    return M(this.documentElement, t), t;
  }
  toIndentedString() {
    const t = new B(2);
    return M(this.documentElement, t), t.textContent;
  }
  toJson() {
    const t = new ht();
    return M(this.documentElement, t), t.textContent;
  }
  toIndentedJson() {
    const t = new ht(2);
    return M(this.documentElement, t), t.textContent;
  }
}
const St = (m) => JSON.stringify(
  m,
  (t, e) => e instanceof RegExp ? "__REGEX__" + e.toString().replace(/"/g, "___quote___") + "___REGEXEND___" : e
).replace(/"__REGEX__/g, "").replace(/___REGEXEND___"/g, "").replace(/___quote___/g, '"');
class Ot extends q {
  globalNamespaceURI = "";
  globalPrefix = "";
  rules = [];
  canonicalRules = [];
  toArray() {
    return this.rules;
  }
  toJSON() {
    return St(this.rules);
  }
  addNamespace(t, e) {
    this.globalNamespaceURI = t, this.globalPrefix = e;
  }
}
class O {
  textContent = "";
  toParentNode() {
    return this.textContent;
  }
  appendChild(t) {
    this.textContent += t.toParentNode(this);
  }
  setAttributeNS(t, e, n) {
    this[`$$${e}`] = n;
  }
}
class wt extends O {
  appendChild(t) {
    this.textContent += (t instanceof ft ? " " : this.textContent && `
`) + t.toParentNode(this);
  }
}
class ft extends O {
  toParentNode() {
    return `{${this.textContent}}`;
  }
}
class Ct extends O {
  toParentNode() {
    return `ixml ${this.textContent}.`;
  }
  appendChild(t) {
    this.textContent += (this.textContent && " ") + t.toParentNode(this);
  }
}
class Dt extends O {
  toParentNode() {
    return `version ${U(this.$$string)}`;
  }
}
class $t extends O {
  toParentNode() {
    return `${this.$$mark ?? ""}${this.$$name}${this.$$alias ? `>${this.$$alias}` : ""}: ${this.textContent}.`;
  }
  appendChild(t) {
    this.textContent += (this.textContent && "; ") + t.toParentNode(this);
  }
}
class It extends O {
  toParentNode() {
    return `(${this.textContent})`;
  }
  appendChild(t) {
    this.textContent += (this.textContent && "; ") + t.toParentNode(this);
  }
}
class Lt extends O {
  appendChild(t) {
    this.textContent += (this.textContent && ", ") + t.toParentNode(this);
  }
}
class kt extends O {
  toParentNode() {
    return `${this.textContent}?`;
  }
}
class yt extends O {
  constructor() {
    super(), this.hasSeparator = !1;
  }
  toParentNode() {
    return this.textContent + (this.hasSeparator ? "" : "*");
  }
  appendChild(t) {
    this.textContent += (t instanceof z ? "**" : "") + t.toParentNode(this), this.hasSeparator = t instanceof z;
  }
}
class vt extends O {
  constructor() {
    super(), this.hasSeparator = !1;
  }
  toParentNode() {
    return this.textContent + (this.hasSeparator ? "" : "+");
  }
  appendChild(t) {
    this.textContent += (t instanceof z ? "++" : "") + t.toParentNode(this), this.hasSeparator = t instanceof z;
  }
}
class z extends O {
}
class Bt extends O {
  toParentNode() {
    return (this.$$tmark ?? "") + (this.$$string ? U(this.$$string) : `#${this.$$hex}`);
  }
}
class Pt extends O {
  toParentNode() {
    return `${this.$$tmark ?? ""}[${this.textContent}]`;
  }
  appendChild(t) {
    this.textContent += (this.textContent && "; ") + t.toParentNode(this);
  }
}
class Kt extends O {
  toParentNode() {
    return `${this.$$tmark ?? ""}~[${this.textContent}]`;
  }
  appendChild(t) {
    this.textContent += (this.textContent && "; ") + t.toParentNode(this);
  }
}
class Ut extends O {
  toParentNode() {
    return this.$$string ? U(this.$$string) : this.$$hex ? `#${this.$$hex}` : this.$$from ? `${this.$$from.startsWith("#") ? this.$$from : U(this.$$from)}-${this.$$to.startsWith("#") ? this.$$to : U(this.$$to)}` : this.$$code;
  }
}
class Yt extends O {
  toParentNode() {
    return `${this.$$mark ?? ""}${this.$$name}${this.$$alias ? `>${this.$$alias}` : ""}`;
  }
}
class Ft extends O {
  toParentNode() {
    return `+${this.$$string ? U(this.$$string) : this.$$hex}`;
  }
}
const Xt = {
  IXmlElementIxml: wt,
  IXmlElementComment: ft,
  IXmlElementProlog: Ct,
  IXmlElementVersion: Dt,
  IXmlElementRule: $t,
  IXmlElementAlts: It,
  IXmlElementAlt: Lt,
  IXmlElementOption: kt,
  IXmlElementRepeat0: yt,
  IXmlElementRepeat1: vt,
  IXmlElementSep: z,
  IXmlElementLiteral: Bt,
  IXmlElementInclusion: Pt,
  IXmlElementExclusion: Kt,
  IXmlElementMember: Ut,
  IXmlElementNonterminal: Yt,
  IXmlElementInsertion: Ft
};
class jt {
  textContent = "";
  constructor(t) {
    this.textContent = t ?? "";
  }
  toParentNode() {
    return this.textContent;
  }
}
class st {
  textContent = "";
  createElementNS(t, e) {
    const n = new Xt[`IXmlElement${bt(e.substring(e.indexOf(":") + 1))}`]();
    return n.ownerDocument = this, n;
  }
  createTextNode(t) {
    return new jt(t);
  }
  appendChild(t) {
    this.textContent = t.toParentNode();
  }
}
class tt {
  #e = "";
  #s = 0;
  #n = 1;
  #i = 1;
  #t = 0;
  [Symbol.iterator]() {
    return this;
  }
  reset(t, e) {
    this.#e = t, this.#s = 0, this.#n = e?.line ?? 1, this.#i = this.#n, this.#t = e ? -e.col : 0;
  }
  next() {
    if (this.#s < this.#e.length) {
      const t = this.#e[this.#s++];
      return t === `
` && (this.#n += 1, this.#t = this.#s), {
        value: {
          char: t
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
      line: this.#n,
      col: this.#s - this.#t
    };
  }
  formatError(t, e) {
    if (typeof this.#e != "string")
      return `${e} at index ${this.#s - 1}`;
    const n = this.#s - this.#t + (t.endOfText ? 1 : 0), s = this.#e.split(`
`).slice(Math.max(0, this.#n - this.#i - 4), this.#n - this.#i + 1), a = String(this.#n).length, r = (c, _) => " ".repeat(_ - String(c).length) + c;
    return [
      t.endOfText ? `${e} at end of line ${this.#n}` : `${e} at line ${this.#n} col ${n}:`,
      "",
      s.map(
        (c, _) => `${r(this.#n - s.length + _ + 1, a)}: ${c}`
      ).join(`
`),
      `${" ".repeat(a + n + 1)}^`
    ].join(`
`);
  }
}
class b {
  data = [];
  constructor(t, e, n, s, a) {
    Object.assign(this, { rule: t, dot: e, reference: n, wantedBy: s, parser: a }), this.isComplete = this.dot === t.symbols.length;
  }
  toString() {
    return `{${this.rule.toString(this.dot)}}, from: ${this.reference || 0}, wantedBy: ${this.wantedBy.map((t) => t.rule.name).join(", ")}`;
  }
  expectingState(t, e, n, s) {
    if (t) {
      if ("string" in t)
        return this.nextState({ data: t.string, reference: e }, n, s);
      if ("attributeName" in t && "attributes" in n && t.alias in n.attributes) {
        const a = new H(s.grammar, new tt(), t.attributeName);
        a.feed(n.attributes[t.alias]);
        const r = a.finish();
        return r.length > 0 ? this.nextState({
          data: {
            attributeName: t.alias,
            resultingValue: r[0].childNodes[0]?.textContent ?? ""
          },
          reference: this.reference
        }, n, s) : null;
      } else return s.lexer instanceof tt && ("startName" in t || "endName" in t) ? this.nextState({ data: "", reference: e }, n, s) : this;
    } else
      return this;
  }
  nextState(t, e, n) {
    let s = this.dot + 1;
    const a = new b(this.rule, s, this.reference, this.wantedBy, n);
    if (a.left = this, a.right = t, a.isComplete)
      a.data = a.build(), a.right = void 0;
    else
      return a.expectingState(this.rule.symbols[s], this.reference, e, n);
    return a;
  }
  build() {
    const t = [];
    for (let e = this; e.left; e = e.left)
      e.right?.data !== null && t.unshift(e.right.data);
    return t;
  }
  finish() {
    const t = {
      1: () => b.createElement(this.rule.alias, this.rule.ns),
      2: () => b.createAttribute(this.rule.alias),
      [-1]: () => b.createArray()
    };
    this.#e(t[this.rule.mark]?.()) || (this.data = xt);
  }
  static getTextContent(t) {
    switch (t.nodeType) {
      case 1:
      case 132:
        return t.childNodes.reduce((e, n) => e + b.getTextContent(n), "");
      case 2:
        return t.value;
      case 3:
        return t.textContent;
    }
  }
  static appendToNode(t, e) {
    switch (e.nodeType) {
      case 1: {
        t.nodeType == 2 ? t.value += b.getTextContent(e) : t.appendChild(e);
        break;
      }
      case 2: {
        t.nodeType == 2 ? t.value += b.getTextContent(e) : t.nodeType == 1 ? t.attributes.push(e) : t.appendChild(e);
        break;
      }
      case 3: {
        switch (t.nodeType) {
          case 1:
          case 132: {
            t.childNodes.at(-1)?.nodeType === 3 ? t.childNodes.at(-1).textContent += b.getTextContent(e) : t.appendChild(b.createTextNode(b.getTextContent(e)));
            break;
          }
          case 2: {
            t.value += b.getTextContent(e);
            break;
          }
        }
        break;
      }
      case 132: {
        e.childNodes.forEach((n) => b.appendToNode(t, n)), e.attributes && t.nodeType === 132 && e.attributes.forEach((n) => t.setAttribute(n.name, n.value));
        break;
      }
    }
  }
  #e(t) {
    let e = 0, n = {}, s = [];
    for (const a of this.rule.symbols) {
      const r = this.data[e];
      if (typeof r == "object" && r !== null && "startName" in r)
        Object.keys(r.attributes).forEach((c) => {
          n[c] = "";
        }), s = t.attributes, t.attributes = [];
      else if (typeof r == "object" && r !== null && "endName" in r) {
        if (t.attributes.forEach((c) => {
          delete n[c.name];
        }), t.attributes = s, Object.keys(n).length > 0)
          return !1;
      } else if (typeof r == "object" && r !== null && "attributeName" in r)
        b.appendToNode(t, b.createTextNode(r.resultingValue)), t.setAttribute(r.attributeName, r.resultingValue);
      else if (r || a.string || a.attributeName)
        switch (a.mark) {
          case -1: {
            if (a.name)
              switch (r.nodeType) {
                case 1: {
                  r.attributes.forEach((c) => b.appendToNode(t, c)), r.childNodes.forEach((c) => b.appendToNode(t, c));
                  break;
                }
                case 132: {
                  r.childNodes.forEach((c) => b.appendToNode(t, c)), t.nodeType === 132 && r.attributes && r.attributes.forEach((c) => t.setAttribute(c.name, c.value));
                  break;
                }
                case 2: {
                  b.appendToNode(t, b.createTextNode(r.value));
                  break;
                }
              }
            break;
          }
          case 0: {
            const c = a.name ? r : a.regExp || a.attributeName ? b.createTextNode(r) : b.createTextNode(a.char || a.string);
            b.appendToNode(t, c);
            break;
          }
          case 1: {
            if (r.nodeType === 132) {
              const c = b.createElement(a.alias);
              r.childNodes.forEach((_) => b.appendToNode(c, _)), b.appendToNode(t, c);
            } else
              b.appendToNode(t, r);
            break;
          }
          case 2: {
            if ([132, 1, 3].includes(r.nodeType)) {
              const c = b.createAttribute(a.alias);
              c.value = b.getTextContent(r), b.appendToNode(t, c);
            } else
              b.appendToNode(t, r);
            break;
          }
        }
      e++;
    }
    return this.data = t, !0;
  }
  static createElement(t, e) {
    return {
      nodeType: 1,
      attributes: [],
      namespaces: e || [],
      childNodes: [],
      nodeName: t,
      localName: t,
      appendChild: function(n) {
        this.childNodes.push(n);
      },
      getAttribute: function(n) {
        return this.attributes.find((a) => a.name === n)?.value ?? "";
      },
      setAttribute: function(n, s) {
        const a = this.attributes.find((r) => r.name === n);
        a ? a.value = s : this.attributes.push({
          nodeType: 2,
          name: n,
          value: s
        });
      },
      setNamespace(n, s) {
        this.namespaces.push({
          nodeType: 133,
          prefix: s,
          URI: n
        });
      },
      lookupNamespaceURI(n) {
        const s = this.namespaces.find((a) => a.prefix === n);
        return s ? s.URI : null;
      },
      lookupPrefix(n) {
        const s = this.namespaces.find((a) => a.URI === n);
        return s ? s.prefix : null;
      }
    };
  }
  static createAttribute(t) {
    return {
      nodeType: 2,
      name: t,
      value: ""
    };
  }
  static createTextNode(t) {
    return {
      nodeType: 3,
      textContent: t
    };
  }
  static createArray() {
    return {
      nodeType: 132,
      attributes: [],
      childNodes: [],
      appendChild: function(t) {
        this.childNodes.push(t);
      },
      setAttribute: function(t, e) {
        const n = this.attributes.find((s) => s.name === t);
        n ? n.value = e : this.attributes.push({
          nodeType: 2,
          name: t,
          value: e
        });
      }
    };
  }
}
class it {
  states = [];
  wants = {};
  scannable = [];
  completed = {};
  constructor(t, e) {
    Object.assign(this, { parser: t, reference: e });
  }
  process(t) {
    const { states: e, wants: n, completed: s } = this;
    for (const a of e) {
      if (a.isComplete) {
        if (a.finish(), a.data !== xt) {
          for (const c of a.wantedBy)
            this.#e(c, a, t);
          if (a.reference === this.reference) {
            const c = a.rule.name;
            (s[c] ??= []).push(a);
          }
        }
        continue;
      }
      const r = a.rule.symbols[a.dot]?.name;
      if (!r) {
        this.scannable.push(a);
        continue;
      }
      if (n[r]) {
        if (n[r].push(a), s[r])
          for (const c of s[r])
            this.#e(a, c, t);
      } else
        n[r] = [a], this.predict(r, t);
    }
  }
  predict(t, e) {
    const n = this.parser.grammar.byName[t] ?? [];
    for (const s of n) {
      const r = new b(s, 0, this.reference, this.wants[t], this.parser).expectingState(s.symbols[0], this.reference, e, this.parser);
      r && this.states.push(r);
    }
  }
  #e(t, e, n) {
    this.states.push(t.nextState(e, n, this.parser));
  }
}
class W extends Error {
  constructor(t, e, n) {
    super(t), this.name = "EarleyParserError", this.offset = e, this.value = n;
  }
}
class H {
  static fail = {};
  grammar = null;
  lexer = null;
  #e = null;
  #s = [];
  #n = 0;
  #i = null;
  #t = {
    char: null
  };
  //  #stringInput = true;
  constructor(t, e, n) {
    this.grammar = t, this.lexer = e;
    const s = new it(this, 0);
    this.#s = [s], this.#i = n ?? t.rules[0]?.name, s.wants[this.#i] = [], s.predict(this.#i), s.process();
  }
  feed(t) {
    const e = this.lexer;
    e.reset(t, this.#e);
    try {
      for (this.#t of e) {
        const n = this.#s[this.#n];
        delete this.#s[this.#n - 1];
        const s = new it(this, this.#n + 1);
        if (this.#s.push(s), n.scannable.forEach((a) => {
          if (!this.#t.endOfText) {
            const r = a.rule.symbols[a.dot];
            let c = null;
            if ("char" in r && "char" in this.#t && r.char === this.#t.char ? c = this.#t.char : "regExp" in r && "char" in this.#t && r.regExp.test(this.#t.char) ? c = this.#t.char : "startName" in r && r.startName === this.#t.startName ? (this.#t.attributes = this.#t.nextAttributes, c = {
              startName: this.#t.startName,
              attributes: this.#t.attributes
            }) : "endName" in r && r.endName === this.#t.endName && (c = {
              endName: this.#t.endName,
              attributes: this.#t.attributes
            }, this.#t.attributes = this.#t.nextAttributes), c !== null) {
              const _ = a.nextState({ data: c, reference: this.#n }, this.#t, this);
              _ && s.states.push(_);
            }
          }
        }), s.process(this.#t), s.states.length === 0)
          throw new W(this.#a(), this.#n, this.#t.char);
        this.#n++;
      }
    } catch (n) {
      if (n instanceof W)
        throw n;
      {
        const s = new it(this, this.#n + 1);
        throw this.#s.push(s), new W(this.#r(n), this.#n, n.value?.char);
      }
    }
    return this.#t = {
      endOfText: !0
    }, this.#s[this.#n] && (this.#e = e.save()), this;
  }
  #r(t) {
    const { token: e } = t, n = e ? `input ${JSON.stringify(e.text[0])} (lexer error)` : "input (lexer error)", s = e ? this.lexer.formatError(e, "Syntax error") : t.message;
    return this.#o(s, n);
  }
  #a() {
    let t = "";
    return this.#t.endOfText ? t = "end of text" : "startName" in this.#t ? t = `<${this.#t.startName}>` : "endName" in this.#t ? t = `</${this.#t.endName}>` : t = JSON.stringify(this.#t.char), this.#o(this.lexer.formatError(this.#t, this.lexer instanceof tt ? "Syntax error" : "Normalizing error"), t);
  }
  #o(t, e) {
    const n = [t], s = this.#s[this.#s.length - (this.#t.endOfText ? 1 : 2)];
    if (!s)
      return n.concat("").join(`
`);
    const a = s.states.filter((r) => {
      const c = r.rule.symbols[r.dot];
      return c?.char || c?.regExp || c?.startName || c?.endName;
    });
    return a.length === 0 ? (n.push(`Unexpected ${e}. I did not expect any more input. Here is the state of my parse table:
`), this.#l(s.states, n)) : (n.push(`Unexpected ${e}. Instead, I was expecting to see one of the following:
`), a.map((r) => this.#u(r, []) || [r]).forEach((r) => {
      const c = r[0].rule.symbols[r[0].dot], _ = this.#c(c);
      n.push(`${/^[aeiou]/i.test(_) ? "An" : "A"} ${_} based on:`), this.#l(r, n);
    })), n.concat("").join(`
`);
  }
  #l(t, e) {
    let n = null, s = 0;
    for (const a of t) {
      const r = a.rule.toString(a.dot);
      if (r === n) {
        s++;
        continue;
      }
      s > 0 && e.push(`    ^ ${s} more lines identical to this`), e.push(`    ${r}`), n = r, s = 0;
    }
  }
  #c(t) {
    return t.name || t.char ? t.toString() : t.regExp ? `character matching ${t.toString()}` : t.startName ? `start tag <${t.startName}>` : t.endName ? `end tag </${t.endName}>` : t.attributeName ? `attribute ${t.attributeName}` : `insertion of ${JSON.stringify(t.string)}`;
  }
  #u(t, e) {
    if (e.indexOf(t) !== -1)
      return null;
    if (t.wantedBy.length === 0)
      return [t];
    const n = t.wantedBy[0], s = [t].concat(e), a = this.#u(n, s);
    return a === null ? null : [t].concat(a);
  }
  finish() {
    if (this.#t.endOfText || this.#t.char) {
      const t = this.#s.at(-1).states.filter(
        (e) => e.rule.name === this.#i && e.dot === e.rule.symbols.length && e.reference === 0 && e.data !== H.fail
      ).map((e) => e.data);
      if (t.length === 0)
        throw new W(this.#a(), this.#n, this.#t.char);
      return t;
    }
    return [];
  }
}
const xt = H.fail;
class zt {
  constructor([t, e, n, s]) {
    return this.mark = t, {
      2: () => this.char = n,
      3: () => this.regExp = n,
      4: () => this.string = n,
      1: () => {
        this.name = n, this.alias = s;
      },
      5: () => {
        this.startName = n, this.ns = (s ?? []).map((r) => ({
          prefix: r[0],
          URI: r[1]
        }));
      },
      6: () => this.endName = n,
      7: () => {
        this.attributeName = n, this.alias = s;
      }
    }[e]?.(), this;
  }
  toString() {
    if (this.name)
      return `${Z[this.mark]}${this.name}${this.alias && this.name !== this.alias ? ">" + this.alias : ""}`;
    if (this.startName)
      return `<${this.startName}${this.ns.reduce((t, e) => t + ` xmlns${e.prefix ? ":" + e.prefix : ""}="${e.URI}"`, "")}>`;
    if (this.endName)
      return `</${this.endName}>`;
    if (this.attributeName)
      return `<@${this.attributeName}>`;
    if (this.char) {
      const t = this.char.codePointAt(0);
      if (t <= 31 || t >= 127)
        return `${Z[this.mark]}#${t.toString(16)}`;
      const e = this.char.includes('"') ? "'" : '"';
      return `${Z[this.mark]}${e}${this.char}${e}`;
    }
    if (this.regExp) {
      const t = [...this.regExp.source], e = t[1] === "^" ? 2 : 1, n = [];
      let s = "", a = !1;
      for (let r = e; r < t.length - 1; r++) {
        const c = t[r];
        if (c === "\\") {
          const _ = t[++r];
          if (_ === "p") {
            r += 2;
            let f = "";
            for (; t[r] !== "}"; )
              f += t[r++];
            if (s) {
              const i = s.includes('"') ? "'" : '"';
              n.push(`${i}${s}${i}`), s = "";
            }
            n.push(f);
          } else if (["x", "u"].includes(_)) {
            if (s) {
              const d = s.includes('"') ? "'" : '"';
              n.push(`${d}${s}${d}`), s = "";
            }
            const f = _ === "x" ? 2 : 4, i = t.slice(r + 1, r + 1 + f).join("");
            a ? (n[n.length - 1] += `#${i}`, a = !1) : n.push(`#${i}`), r += f;
          } else
            s += _;
        } else if (c === "-") {
          if (s.length > 1) {
            const [f, ...i] = [...s].reverse();
            if (i.length) {
              const d = i.join("").includes('"') ? "'" : '"';
              n.push(`${d}${i.reverse().join("")}${d}`);
            }
            s = f;
          }
          const _ = s.includes('"') ? "'" : '"';
          n.push(`${_}${s}${_}-`), a = !0, s = "";
        } else {
          const _ = c.codePointAt(0);
          if (_ <= 31 || _ >= 127) {
            if (s) {
              const f = s.includes('"') ? "'" : '"';
              n.push(`${f}${s}${f}`), s = "";
            }
            a ? (n[n.length - 1] += `#${_.toString(16)}`, a = !1) : n.push(`#${_.toString(16)}`);
          } else if (a) {
            const f = c.includes('"') ? "'" : '"';
            n[n.length - 1] += `${f}${c}${f}`, a = !1;
          } else
            s += c;
        }
      }
      if (s) {
        const r = s.includes('"') ? "'" : '"';
        n.push(`${r}${s}${r}`);
      }
      return `${Z[this.mark]}${e === 1 ? "" : "~"}[${n.join("; ")}]`;
    }
    if (this.string) {
      const t = [];
      let e = "";
      for (const n of this.string) {
        const s = n.codePointAt(0);
        if (s >= 32 && s <= 126)
          e += n;
        else {
          if (e) {
            const a = e.includes('"') ? "'" : '"';
            t.push(`+${a}${e}${a}`), e = "";
          }
          t.push(`+#${s.toString(16)}`);
        }
      }
      if (e) {
        const n = e.includes('"') ? "'" : '"';
        t.push(`+${n}${e}${n}`);
      }
      return t.join(", ");
    }
  }
}
class Ht {
  constructor([t, e, n, s, a]) {
    Object.assign(this, { mark: t, name: e, alias: n, ns: s }), this.ns = s.map((r) => ({ prefix: r[0], URI: r[1] })), this.symbols = a.map((r) => new zt(r));
  }
  toString(t) {
    const e = this.symbols.map((n, s) => [s === t ? "● " : "", n.toString()].join("")).join(", ");
    return `${Wt[this.mark]}${this.name}${this.alias !== this.name ? `>${this.alias}` : ""}${this.ns.reduce((n, s) => n + ` xmlns${s.prefix ? ":" + s.prefix : ""}="${s.URI}"`, "")}: ${e}${t === this.symbols.length ? ". ●" : "."}`;
  }
}
class Gt {
  byName = {};
  constructor(t) {
    this.rules = t.map((e) => new Ht(e)), this.rules.forEach((e) => {
      (this.byName[e.name] ??= []).push(e);
    });
  }
  toString() {
    return this.rules.map((t) => t.toString()).join(`
`);
  }
}
class Jt {
  #e = null;
  #s = [];
  #n = "";
  #i = 0;
  #t = !0;
  #r = !1;
  #a = !1;
  #o = "";
  #l = 0;
  #c = !1;
  [Symbol.iterator]() {
    return this;
  }
  reset(t) {
    this.#e = t.documentElement ?? t;
  }
  inject(t) {
    this.#o = t, this.#c = !0, this.#l = 0;
  }
  #u() {
    this.#n = "", this.#i = 0, this.#e.nextSibling ? (this.#e = this.#e.nextSibling, this.#e.nodeType === 3 ? (this.#n = this.#e.textContent, this.#i = 0) : this.#t = !0) : (this.#e = this.#e.parentNode, this.#r = !0, this.#a = !this.#e);
  }
  next() {
    if (this.#a)
      return {
        done: !0
      };
    if (this.#c)
      return this.#l < this.#o.length ? {
        value: {
          char: this.#o[this.#l++],
          injected: !0
        }
      } : (this.#c = !1, {
        value: {
          completed: !0,
          injected: !0
        }
      });
    if (this.#e.nodeType === 3 && this.#i < this.#n.length) {
      const t = this.#n[this.#i++], e = this.#s[this.#s.length - 1];
      return this.#i === this.#n.length && this.#u(), {
        value: {
          char: t,
          attributes: e
        }
      };
    }
    if (this.#t) {
      const t = this.#s[this.#s.length - 1] ?? {}, e = Object.fromEntries((this.#e.attributes?.filter((s) => s.namespaceURI !== "http://invisiblexml.org/NS") ?? []).map(({ name: s, value: a }) => [s, a]));
      this.#s.push(e), this.#t = !1;
      const n = this.#e.nodeName;
      return this.#e.childNodes.length > 0 ? (this.#e = this.#e.childNodes[0], this.#e.nodeType === 3 ? (this.#n = this.#e.textContent, this.#i = 0) : this.#t = !0) : this.#r = !0, {
        value: {
          startName: n,
          attributes: t,
          nextAttributes: e
        }
      };
    }
    if (this.#r) {
      this.#r = !1;
      const t = this.#e.nodeName, e = this.#s.pop(), n = this.#s[this.#s.length - 1] ?? {};
      return this.#u(), {
        value: {
          endName: t,
          attributes: e,
          nextAttributes: n
        }
      };
    }
  }
  save() {
    return null;
  }
  formatError(t, e) {
    let n = "";
    return t.endOfText ? n = "end of text" : "startName" in t ? n = `<${t.startName}>` : "endName" in t ? n = `</${t.endName}>` : n = JSON.stringify(t.char), `${e} at ${n}`;
  }
}
const rt = (m, t, e, n, s) => {
  const a = typeof t == "string";
  try {
    const r = new H(new Gt(m), a ? new tt() : new Jt());
    r.feed(t);
    const c = r.finish();
    let _ = c[0];
    if (_?.nodeType === 132 && _?.childNodes.length === 1 && (_ = _.childNodes[0]), a && _?.nodeType !== 1)
      throw new Error("Parse error");
    if (c.length > 1 && a) {
      const f = _.lookupNamespaceURI("") === "http://invisiblexml.org/NS" ? "" : _.lookupPrefix("http://invisiblexml.org/NS") ?? "ixml";
      f === "ixml" && !_.lookupPrefix("http://invisiblexml.org/NS") && _.setNamespace("http://invisiblexml.org/NS", "xmlns:ixml"), _.attributes.push({
        nodeType: 2,
        namespaceURI: "http://invisiblexml.org/NS",
        prefix: f,
        name: (f === "" ? "" : f + ":") + "state",
        value: "ambiguous"
      });
    }
    M(_, s);
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
        return this.attributes.find((i) => i.name === _)?.value ?? "";
      },
      setAttribute: function(_, f) {
        const i = this.attributes.find((d) => d.name === _);
        i ? i.value = f : this.attributes.push({
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
    }), M(c, s);
  }
};
class w extends Ot {
  grammarElement = null;
  canonicalGrammarElement = null;
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
  static #e = {
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
  appendChild(t) {
    t?.nodeType === 1 && (this.grammarElement = t);
  }
  toNode(t) {
    this.grammarElement && M(this.grammarElement, t);
  }
  toString() {
    const t = new B();
    return M(this.grammarElement, t), t.textContent;
  }
  toCanonicalString() {
    const t = new B();
    return M(this.canonicalGrammarElement, t), t.textContent;
  }
  toExpandedString() {
    const t = new B();
    return M(this.documentElement, t), t.textContent;
  }
  toIndentedString() {
    const t = new B(2);
    return M(this.grammarElement, t), t.textContent;
  }
  toIndentedCanonicalString() {
    const t = new B(2);
    return M(this.canonicalGrammarElement, t), t.textContent;
  }
  toIndentedExpandedString() {
    const t = new B(2);
    return M(this.documentElement, t), t.textContent;
  }
  toIXml() {
    const t = new st();
    return M(this.grammarElement, t), t.textContent;
  }
  toCanonicalIXml() {
    const t = new st();
    return M(this.canonicalGrammarElement, t), t.textContent;
  }
  toExpandedIXml() {
    const t = new st();
    return M(this.documentElement, t), t.textContent;
  }
  fromString(t) {
    mt(this, t);
  }
  #s() {
    this.parse = (t, e) => (e || (e = new q()), rt(this.rules, t, this.defaultNamespaceURI, this.defaultPrefix, e), e);
  }
  #n() {
    this.canonicalize = (t) => {
      const e = new q(), n = new q(t);
      if (rt(this.canonicalizingRules, n, this.defaultNamespaceURI, this.defaultPrefix, e), e.childNodes[0]?.localName === "ixml")
        throw new Error(e.childNodes[0]?.childNodes[0]?.textContent ?? "Invalid XML document for IXML grammar");
      return e.childNodes[0]?.textContent ?? "";
    };
  }
  #i() {
    const t = this.createElement("ixml");
    let e = "", n = null;
    this.rules.forEach((s) => {
      const a = w.MARK_to_rulemark[s[0]] + s[1] + (s[1] !== s[2] ? ">" + s[2] : "");
      (!n || e !== a) && (n = this.createElement("rule"), w.MARK_to_rulemark[s[0]] && n.setAttribute("mark", w.MARK_to_rulemark[s[0]]), n.setAttribute("name", s[1]), s[2] !== s[1] && n.setAttribute("alias", s[2]), t.appendChild(n), e = a);
      const r = this.createElement("alt");
      s[4].forEach((c) => {
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
            const _ = c[2].source.split(""), f = _[1] === "^" ? 2 : 1, i = this.createElement(f === 1 ? "inclusion" : "exclusion");
            c[0] !== 0 && i.setAttribute("tmark", w.MARK_to_termmark[c[0]]);
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
                    E.setAttributeNode(d), i.appendChild(E), d = null;
                  }
                  const h = this.createElement("member");
                  h.setAttribute("code", p), i.appendChild(h);
                } else if (_[o] === "x") {
                  if (o++, x)
                    d = this.createAttribute("to"), d.value = "#" + _[o] + _[o + 1], x.setAttributeNode(d), i.appendChild(x), x = null, d = null;
                  else {
                    if (d) {
                      const p = this.createElement("member");
                      p.setAttributeNode(d), i.appendChild(p), d = null;
                    }
                    d = this.createAttribute("hex"), d.value = _[o] + _[o + 1];
                  }
                  o++;
                } else if (_[o] === "u") {
                  if (o++, x)
                    d = this.createAttribute("to"), d.value = "#" + _[o] + _[o + 1] + _[o + 2] + _[o + 3], x.setAttributeNode(d), i.appendChild(x), x = null, d = null;
                  else {
                    if (d) {
                      const p = this.createElement("member");
                      p.setAttributeNode(d), i.appendChild(p), d = null;
                    }
                    d = this.createAttribute("hex"), d.value = _[o] + _[o + 1] + _[o + 2] + _[o + 3];
                  }
                  o += 3;
                } else if (d)
                  if (d.name === "string")
                    d.value += _[o];
                  else {
                    const p = this.createElement("member");
                    p.setAttributeNode(d), i.appendChild(p), d = this.createAttribute("string"), d.value = _[o];
                  }
                else
                  d = this.createAttribute("string"), d.value = _[o];
              else if (_[o] === "-") {
                const p = (d.nodeName === "hex" ? "#" : "") + d.value;
                d = this.createAttribute("from"), d.value = p, x = this.createElement("member"), x.setAttributeNode(d);
              } else if (x)
                d = this.createAttribute("to"), d.value = _[o], x.setAttributeNode(d), i.appendChild(x), x = null, d = null;
              else if (_[o].codePointAt(0) <= 31 || _[o].codePointAt(0) >= 127) {
                if (d) {
                  const h = this.createElement("member");
                  h.setAttributeNode(d), i.appendChild(h), d = null;
                }
                const p = this.createElement("member");
                p.setAttribute("hex", _[o].codePointAt(0).toString(16)), i.appendChild(p);
              } else if (d)
                if (d.name === "string")
                  d.value += _[o];
                else {
                  const p = this.createElement("member");
                  p.setAttributeNode(d), i.appendChild(p), d = this.createAttribute("string"), d.value = _[o];
                }
              else
                d = this.createAttribute("string"), d.value = _[o];
            if (d) {
              const o = this.createElement("member");
              o.setAttributeNode(d), i.appendChild(o);
            }
            r.appendChild(i);
            break;
          }
          case 4: {
            const _ = c[2].split("");
            let f = "";
            for (let i = 0, d = _.length; i < d; i++) {
              const x = _[i].codePointAt(0);
              if (x >= 32 && x <= 126)
                f += _[i];
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
              const i = this.createElement("insertion");
              i.setAttribute("string", f), r.appendChild(i), f = "";
            }
            break;
          }
        }
      }), n.appendChild(r);
    }), super.appendChild(t);
  }
  #t() {
    const t = new w();
    M(this.grammarElement, t), this.canonicalGrammarElement = t.grammarElement;
    let e = this.canonicalGrammarElement.childNodes.filter((o) => o.nodeName === "rule");
    const n = (o) => {
      if (o.nodeName === "inclusion" && o.getAttribute("tmark") === "-") {
        o.nodeName = o.localName = "literal";
        const l = o.childNodes[0], p = l.getAttribute("code");
        if (p)
          o.setAttribute("string", w.#e[p]);
        else {
          const h = l.getAttribute("from");
          if (h)
            h.startsWith("#") ? o.setAttribute("hex", h.substring(1)) : o.setAttribute("string", h);
          else {
            const E = l.getAttribute("string");
            if (E)
              o.setAttribute("string", E[0]);
            else {
              const S = l.getAttribute("hex");
              S && o.setAttribute("hex", S);
            }
          }
        }
        o.childNodes = [];
      } else if (o.nodeName === "exclusion" && o.getAttribute("tmark") === "-") {
        const l = new RegExp(this.#r(o));
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
          n(l);
    };
    e.forEach(n);
    const s = Object.fromEntries(e.map((o) => [o.getAttribute("name"), o]));
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
            const l = s[o.getAttribute("name")], p = l?.getAttribute("ignoredText");
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
      a = !1, e.forEach(r);
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
      a = !1, e.forEach(c);
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
            const l = o.getAttribute("mark"), p = s[o.getAttribute("name")], h = l === "^" || l === "@" ? "false" : p?.getAttribute("disposable");
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
      a = !1, e.forEach(_);
    while (a);
    const f = (o) => {
      for (const l of o.childNodes)
        if (l instanceof j)
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
                const S = this.createElement("alt"), A = this.createElement("repeat1"), N = this.createElement("alts");
                N.childNodes = h, A.appendChild(N), S.appendChild(A), l.childNodes = [p, S];
              }
            } else
              l.removeAttribute("disposable"), l.removeAttribute("ignoredText"), f(l);
          else
            l.removeAttribute("disposable"), l.removeAttribute("ignoredText"), f(l);
    };
    e.forEach(f);
    const i = /* @__PURE__ */ new Set();
    e.length > 0 && i.add(e[0].getAttribute("name"));
    const d = (o) => {
      for (const l of o.childNodes ?? [])
        d(l);
      o.nodeName === "nonterminal" && i.add(o.getAttribute("name"));
    };
    this.canonicalGrammarElement.childNodes.forEach(d), this.canonicalGrammarElement.childNodes = this.canonicalGrammarElement.childNodes.filter((o) => !(o instanceof j) || i.has(o.getAttribute("name"))), this.canonicalGrammarElement.childNodes.forEach((o) => {
      o instanceof j && (o.removeAttribute("disposable"), o.removeAttribute("ignoredText"));
    }), e = this.canonicalGrammarElement.childNodes.filter((o) => o.nodeName === "rule");
    const x = (o) => {
      for (const l of o.childNodes)
        x(l), l.nodeName === "alts" && l.childNodes.length === 1 && l.childNodes[0].childNodes.length === 1 && !["option", "repeat0", "repeat1"].includes(l.childNodes[0].childNodes[0].nodeName) && (o.childNodes[o.childNodes.indexOf(l)] = l.childNodes[0].childNodes[0], a = !0);
    };
    do
      a = !1, e.forEach(x);
    while (a);
  }
  #r(t) {
    return (t.localName === "inclusion" ? "[" : "[^") + t.childNodes.reduce((e, n) => {
      let s = "", a = n.getAttribute("from") || "";
      if (a !== "") {
        let r = n.getAttribute("to") || "";
        if (a.startsWith("#")) {
          const c = parseInt(a.substring(1), 16).toString(16);
          c.length < 3 ? a = "\\x" + c.padStart(2, "0") : a = "\\u" + c.padStart(4, "0");
        }
        if (r.startsWith("#")) {
          const c = parseInt(r.substring(1), 16).toString(16);
          c.length < 3 ? r = "\\x" + c.padStart(2, "0") : r = "\\u" + c.padStart(4, "0");
        }
        s = a + "-" + r;
      } else {
        const r = n.getAttribute("string") || "";
        if (r !== "")
          s = r.replace(/([[\]\\^-])/g, "\\$1");
        else {
          const c = n.getAttribute("hex") || "";
          if (c !== "") {
            let _ = parseInt(c, 16);
            if (_ <= 255)
              s = "\\x" + _.toString(16).padStart(2, "0");
            else if (_ <= 65535)
              s = "\\u" + _.toString(16).padStart(4, "0");
            else {
              _ -= 65536;
              let f = _ >> 10 & 1023 | 55296, i = _ & 1023 | 56320;
              s = "\\u" + f.toString(16) + "\\u" + i.toString(16);
            }
          } else {
            const _ = n.getAttribute("code") || "";
            s += "\\p{" + _ + "}";
          }
        }
      }
      return e + s;
    }, "") + "]";
  }
  #a(t) {
    const e = { "@": 2, "-": -1, "^": 1, "": 0 }, n = { "@": 2, "-": -1, "^": 1, "": 1 };
    let s = [];
    t.childNodes.forEach((_) => {
      if (_.localName === "rule") {
        const f = _.getAttribute("name"), i = _.getAttribute("alias"), d = [], x = i || f, o = (l, p) => {
          let h = "", E = "", S = "", A = null, N = [];
          switch (p.localName) {
            case "nonterminal": {
              h = p.getAttribute("name"), E = p.getAttribute("alias"), S = E || h, A = [[e[p.getAttribute("mark") || ""], 1, h, S]];
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
                  A = [[e[u], p.localName === "insertion" ? 4 : 2, T]];
                else {
                  h = l.name + "_" + l.rule_count + "_literal_" + l.literal_count++;
                  const C = T.split("").map(($) => {
                    const k = p.ownerDocument.createElement("literal");
                    return k.setAttribute("string", $), k.setAttribute("tmark", "-"), k;
                  }).reduce(o, { pick: [], subrules: [], name: l.name, rule_count: l.rule_count, literal_count: 1 });
                  N = [[-1, h, h, [], u !== "-" ? C.pick.concat([[0, 4, T]]) : C.pick]], A = [[e[p.getAttribute("mark") || ""], 1, h, h]];
                }
              else {
                const C = p.getAttribute("hex") || "";
                if (C !== "") {
                  let $ = parseInt(C, 16);
                  if ($ <= 65535)
                    A = [[e[u], p.localName === "insertion" ? 4 : 2, String.fromCodePoint($)]];
                  else {
                    $ -= 65536;
                    let k = $ >> 10 & 1023 | 55296, G = $ & 1023 | 56320;
                    const R = [[-1, 2, String.fromCodePoint(k)], [-1, 2, String.fromCodePoint(G)]];
                    h = l.name + "_" + l.rule_count + "_literal_" + l.literal_count++, N = [[-1, h, h, [], u !== "-" ? R.concat([[0, 4, String.fromCodePoint($)]]) : R]], A = [[e[p.getAttribute("mark") || ""], 1, h, h]];
                  }
                }
              }
              break;
            }
            case "inclusion":
            case "exclusion": {
              const u = p.getAttribute("tmark") || "", T = this.#r(p);
              A = [[e[u], 3, new RegExp(T, "u")]];
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
                const T = u.concat([p.childNodes[0]]).reduce(o, { pick: [], subrules: [], name: h + "_sep", rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 }), C = [p.childNodes[0]].reduce(o, { pick: [], subrules: [], name: h, rule_count: l.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1 });
                N.push([-1, h, h, [], C.pick.concat([[-1, 1, h + "_next"]])]), N = N.concat(C.subrules), N.push([-1, h + "_next", h + "_next", [], [[-1, 1, h + "_next"], [-1, 1, h + "_sep"]]]), N.push([-1, h + "_sep", h + "_sep", [], T.pick]), N = N.concat(T.subrules), N.push([-1, h + "_next", h + "_next", [], []]);
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
            s.push([n[E], f, x, d, h.pick]), s = s.concat(h.subrules);
          }
        });
      }
    });
    const a = [], r = {};
    s.forEach((_, f) => {
      const i = w.MARK_to_rulemark[_[0]] + _[1] + (_[1] !== _[2] ? ">" + _[2] : "");
      r[i] ? r[i].push(f) : (r[i] = [f], a.push(i));
    });
    const c = [];
    return a.forEach((_) => {
      r[_].forEach((f) => {
        c.push(s[f]);
      });
    }), c;
  }
  #o() {
    this.canonicalizingRules = [];
    for (const t of this.canonicalRules) {
      const [, e, n, , s] = t, a = [];
      let r = "", c = "";
      const _ = () => {
        if (c !== "")
          for (const f of c)
            a.push([-1, 2, f]);
        c = "", r !== "" && a.push([0, 4, r]), r = "";
      };
      for (const f of s) {
        const [i, d, x, o] = f;
        d === 2 && i === -1 ? r += x : d === 4 ? c += x : (_(), d === 1 ? a.push([i, d, x, o]) : a.push([i, d, x]));
      }
      _(), this.canonicalizingRules.push([-1, e, n, [], a]);
    }
    if (this.canonicalizingRules.length !== 0) {
      const [, t, e] = this.canonicalizingRules[0];
      this.canonicalizingRules = [[-1, "#initialRule", "#initialRule", [], [[1, 1, t, e]]], ...this.canonicalizingRules];
      const n = {}, s = {};
      this.canonicalRules.forEach((a) => {
        const [r, c, _] = a;
        n[c] = r, s[c] = _;
      }), this.canonicalizingRules.forEach((a) => {
        const r = a[4], c = [];
        r.forEach((_) => {
          const [f, i, d, x] = _, o = n[d], l = s[d], p = i === 1 && f === 0 ? o : f, h = i === 1 && d === x ? l : x;
          p === 2 ? c.push([0, 7, d, h]) : (i === 1 && p !== -1 && c.push([-1, 5, h]), i !== 1 || !x && !l ? c.push([p, i, d]) : c.push([-1, i, d, p !== -1 && i === 1 && d === x || !x ? l : x]), i === 1 && p !== -1 && c.push([-1, 6, h]));
        }), a[4] = c;
      });
    }
  }
  generateRules(t) {
    this.rules = t ?? this.#a(this.grammarElement), this.#i(), this.#s(), this.#t(), this.canonicalRules = this.#a(this.canonicalGrammarElement), this.#o(), this.#n();
  }
}
const Z = w.MARK_to_termmark, Wt = w.MARK_to_rulemark, Zt = [
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
], Qt = (m) => {
  const t = new w();
  return rt(Zt, m, null, null, t), t.generateRules(), t;
}, te = (m) => {
  const t = new w();
  return M(m.documentElement ?? m, t), t.generateRules(), t;
}, ee = (m) => {
  const t = new w();
  return t.generateRules(m), t;
}, ne = (m) => {
  const t = new w();
  return t.fromString(m), t.generateRules(), t;
};
async function qt(m = []) {
  const [t, e] = m.map(Number);
  if (Number.isNaN(t) || Number.isNaN(e)) {
    console.error("Usage: node monapp.mjs <a> <b>"), process.exitCode = 1;
    return;
  }
  const n = calculTruc(t, e);
  console.log(n);
}
const Vt = typeof process < "u" && process.versions?.node;
Vt && import.meta.url === new URL(process.argv[1], "file:").href && await Promise.resolve(qt(process.argv.slice(2))).catch((t) => {
  console.error(t?.stack || t), process.exit(1);
});
export {
  Qt as fromIXml,
  te as fromNode,
  ee as fromRules,
  ne as fromXml,
  qt as mainCLI,
  St as richJSONstringify
};
