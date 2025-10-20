import { ELEMENT_NODE, ATTRIBUTE_MARK, DELETED_MARK, ELEMENT_MARK, INHERITED_MARK, NON_TERMINAL_SYMBOL, TERMINAL_SYMBOL, CHARACTERSET_SYMBOL, INSERTION_SYMBOL, ELEMENT_START_SYMBOL, ELEMENT_END_SYMBOL, ATTRIBUTE_VALUE_SYMBOL } from "../utils/constants.js";
import { IXmlExpandedXmlDocument } from "./IXmlExpandedXmlDocument.js";
import { replicate } from "../utils/replicate.js";
import { loadFromString } from "../utils/loadFromString.js";
import { SerializerDocument } from "./SerializerDocument.js";
import { IXmlDocument } from "./IXmlDocument";
import { parseWithGrammar } from "../utils/parseWithGrammar.js";
import { XmlDocument } from "./XmlDocument.js";
import { XmlElement } from "./XmlElement.js";
import { richJSONstringify } from "../utils/richJSONstringify.js";

export class IXmlXmlDocument extends IXmlExpandedXmlDocument{
  grammarElement = null;
  normalizedGrammarElement = null;
  static MARK_to_rulemark = {
    [ATTRIBUTE_MARK]: "@",
    [DELETED_MARK]: "-",
    [ELEMENT_MARK]: ""
  };
  static MARK_to_termmark = {
    [ATTRIBUTE_MARK]: "@",
    [DELETED_MARK]: "-",
    [ELEMENT_MARK]: "^",
    [INHERITED_MARK]: ""
  };
  static #unicodeClassToDefault = {
    'L': 'A',
    'Ll': 'a',
    'Lu': 'A',
    'Lt': 'A',
    'Lm': 'A',
    'Lo': 'A',
    'M': '\u0300',
    'Mn': '\u0300',
    'Mc': '\u0903',
    'Me': '\u20DD',
    'N': '0',
    'Nd': '0',
    'Nl': '\u2160',
    'No': '\u00B2',
    'P': '.',
    'Pc': '_',
    'Pd': '-',
    'Ps': '(',
    'Pe': ')',
    'Pi': '\u0022',
    'Pf': '\u0022',
    'Po': '.',
    'S': '+',
    'Sm': '+',
    'Sc': '$',
    'Sk': '^',
    'So': '\u00A9',
    'Z': ' ',
    'Zs': ' ',
    'Zl': '\u2028',
    'Zp': '\u2029',
    'C': '\x7F',
    'Cc': '\x7F',
    'Cf': '\u200B',
    'Cs': '\uD800',
    'Co': '\uE000',
    'Cn': '\u0378',
    'White_Space': ' ',
    'Cased_Letter': 'A',
    'LC': 'A',
    'Alphabetic': 'A',
    'Upper': 'A',
    'Lower': 'a',
    'Title': 'A',
    'Digit': '0',
    'Hex_Digit': '0',
    'ASCII_Hex_Digit': '0',
    'Alnum': 'A',
    'Punctuation': '.',
    'Graph': '\x21',
    'Print': ' ',
    'Blank': ' ',
    'Control': '\x7F',
    'XID_Start': 'A',
    'XID_Continue': '0',
    'Assigned': ' ',
    'Space': ' ',
    'Letter': 'A',
    'Mark': '\u0300',
    'Number': '0-9',
    'Symbol': '+',
    'Separator': ' ',
    'Other': '\x7F',
  };
  appendChild(node) {
    if (node?.nodeType === ELEMENT_NODE) {
      this.grammarElement = node;
    }
  }
  toNode(node) {
    if (this.grammarElement) {
      replicate(this.grammarElement, node);
    }
  }
  toString() {
    const doc = new SerializerDocument();
    replicate(this.grammarElement, doc);
    return doc.textContent;
  }
  toNormalizedString() {
    const doc = new SerializerDocument();
    replicate(this.normalizedGrammarElement, doc);
    return doc.textContent;
  }
  toExpandedString() {
    const doc = new SerializerDocument();
    replicate(this.documentElement, doc);
    return doc.textContent;
  }
  toIndentedString() {
    const doc = new SerializerDocument(2);
    replicate(this.grammarElement, doc);
    return doc.textContent;
  }
  toIndentedNormalizedString() {
    const doc = new SerializerDocument(2);
    replicate(this.normalizedGrammarElement, doc);
    return doc.textContent;
  }
  toIndentedExpandedString() {
    const doc = new SerializerDocument(2);
    replicate(this.documentElement, doc);
    return doc.textContent;
  }
  toIXml() {
    const doc = new IXmlDocument();
    replicate(this.grammarElement, doc);
    return doc.textContent;
  }
  toNormalizedIXml() {
    const doc = new IXmlDocument();
    replicate(this.normalizedGrammarElement, doc);
    return doc.textContent;
  }
  toExpandedIXml() {
    const doc = new IXmlDocument();
    replicate(this.documentElement, doc);
    return doc.textContent;
  }
  toRules() {
    let res = '[';
    res += this.rules.reduce((ser, rule, index) => ser + (index !== 0 ? ',' : '') + richJSONstringify(rule).replace(/\\/g, '\\'), '[') + ']';
    res += ',';
    res += this.normalizingRules.reduce((ser, rule, index) => ser + (index !== 0 ? ',' : '') + richJSONstringify(rule).replace(/\\/g, '\\'), '[') + ']';
    res += ']';
    return res;
  }
  fromString(str) {
    loadFromString(this, str);
  }
  generateParseFunction() {
    this.parse = (input, node) => {
      if (!node) {
        node = new XmlDocument();
      }
      parseWithGrammar(this.rules, input, this.defaultNamespaceURI, this.defaultPrefix, node);
      return node
    }
  }
  generateNormalizeFunction() {
    this.normalize = input => {
      const doc = new XmlDocument();
      const inputDoc = new XmlDocument(input);
      parseWithGrammar(this.normalizingRules, inputDoc, this.defaultNamespaceURI, this.defaultPrefix, doc);
      if (doc.childNodes[0]?.localName === 'ixml') {
        throw new Error(doc.childNodes[0]?.childNodes[0]?.textContent ?? 'Invalid XML document for IXML grammar');
      }
      return doc.childNodes[0]?.textContent ?? '';
    }
  }
  #expandedGrammarFromRules() {
    const ixmlElt = this.createElement("ixml");
    let previousRuleName = "";
    let ruleElt = null;
    this.rules.forEach(rule => {
      const ruleName = IXmlXmlDocument.MARK_to_rulemark[rule[0]] + rule[1] + (rule[1] !== rule[2] ? ">" + rule[2] : "");
      if (!ruleElt || previousRuleName !== ruleName) {
        ruleElt = this.createElement("rule");
        if (IXmlXmlDocument.MARK_to_rulemark[rule[0]]) {
          ruleElt.setAttribute("mark", IXmlXmlDocument.MARK_to_rulemark[rule[0]]);
        }
        ruleElt.setAttribute("name", rule[1]);
        if (rule[2] !== rule[1]) {
          ruleElt.setAttribute("alias", rule[2]);
        }
        ixmlElt.appendChild(ruleElt);
        previousRuleName = ruleName;
      }
      const altElt = this.createElement("alt");
      rule[4].forEach(term => {
        switch(term[1]) {
          case NON_TERMINAL_SYMBOL: {
            const termElt = this.createElement("nonterminal");
            termElt.setAttribute("name", term[2]);
            if (term[3] !== term[2]) {
              termElt.setAttribute("alias", term[3]);
            }
            if (term[0] !== INHERITED_MARK) {
              termElt.setAttribute("mark", IXmlXmlDocument.MARK_to_termmark[term[0]]);
            }
            altElt.appendChild(termElt);
            break;
          }
          case TERMINAL_SYMBOL: {
            const termElt = this.createElement("literal");
            const code = term[2].codePointAt(0);
            if (code >= 32 && code <= 126) {
              termElt.setAttribute("string", term[2]);
            } else {
              termElt.setAttribute("hex", code.toString(16));
            }
            if (term[0] !== INHERITED_MARK) {
              termElt.setAttribute("tmark", IXmlXmlDocument.MARK_to_termmark[term[0]]);
            }
            altElt.appendChild(termElt);
            break;
          }
          case CHARACTERSET_SYMBOL: {
            const source = term[2].source.split("");
            const start = source[1] === "^" ? 2 : 1;
            const termElt = this.createElement(start === 1 ? "inclusion" : "exclusion");
            if (term[0] !== INHERITED_MARK) {
              termElt.setAttribute("tmark", IXmlXmlDocument.MARK_to_termmark[term[0]]);
            }
            let memberAttr = null;
            let rangeMemberElt = null;
            for (let i = start, l = source.length - 1; i < l; i++) {
              if (source[i] === "\\") {
                i++;
                if (source[i] === "p") {
                  i += 2;
                  let code = "";
                  while (source[i] !== "}") {
                    code += source[i];
                    i++;
                  }
                  if (memberAttr) {
                    const memberElt = this.createElement("member");
                    memberElt.setAttributeNode(memberAttr);
                    termElt.appendChild(memberElt);
                    memberAttr = null;
                  }
                  const memberElt = this.createElement("member");
                  memberElt.setAttribute("code", code);
                  termElt.appendChild(memberElt);
                } else {
                  if (source[i] === "x") {
                    i++;
                    if (rangeMemberElt) {
                      memberAttr = this.createAttribute("to");
                      memberAttr.value = "#" + source[i] + source[i + 1];
                      rangeMemberElt.setAttributeNode(memberAttr);
                      termElt.appendChild(rangeMemberElt);
                      rangeMemberElt = null;
                      memberAttr = null;
                    } else {
                      if (memberAttr) {
                        const memberElt = this.createElement("member");
                        memberElt.setAttributeNode(memberAttr);
                        termElt.appendChild(memberElt);
                        memberAttr = null;
                      }
                      memberAttr = this.createAttribute("hex");
                      memberAttr.value = source[i] + source[i + 1];
                    }
                    i++;
                  } else if (source[i] === "u") {
                    i++;
                    if (rangeMemberElt) {
                      memberAttr = this.createAttribute("to");
                      memberAttr.value = "#" + source[i] + source[i + 1] + source[i + 2] + source[i + 3];
                      rangeMemberElt.setAttributeNode(memberAttr);
                      termElt.appendChild(rangeMemberElt);
                      rangeMemberElt = null;
                      memberAttr = null;
                    } else {
                      if (memberAttr) {
                        const memberElt = this.createElement("member");
                        memberElt.setAttributeNode(memberAttr);
                        termElt.appendChild(memberElt);
                        memberAttr = null;
                      }
                      memberAttr = this.createAttribute("hex");
                      memberAttr.value = source[i] + source[i + 1] + source[i + 2] + source[i + 3];
                    }
                    i += 3;
                  } else {
                    if (memberAttr) {
                      if (memberAttr.name === "string") {
                        memberAttr.value += source[i];
                      } else {
                        const memberElt = this.createElement("member");
                        memberElt.setAttributeNode(memberAttr);
                        termElt.appendChild(memberElt);
                        memberAttr = this.createAttribute("string");
                        memberAttr.value = source[i];
                      }
                    } else {
                      memberAttr = this.createAttribute("string");
                      memberAttr.value = source[i];
                    }
                  }
                }
              } else if (source[i] === "-") {
                const fromValue = (memberAttr.nodeName === "hex" ? "#" : "") + memberAttr.value;
                memberAttr = this.createAttribute("from");
                memberAttr.value = fromValue;
                rangeMemberElt = this.createElement("member");
                rangeMemberElt.setAttributeNode(memberAttr);
              } else {
                if (rangeMemberElt) {
                  memberAttr = this.createAttribute("to");
                  memberAttr.value = source[i];
                  rangeMemberElt.setAttributeNode(memberAttr);
                  termElt.appendChild(rangeMemberElt);
                  rangeMemberElt = null;
                  memberAttr = null;
                } else if (source[i].codePointAt(0) <= 31 || source[i].codePointAt(0) >= 127) {
                  if (memberAttr) {
                    const memberElt = this.createElement("member");
                    memberElt.setAttributeNode(memberAttr);
                    termElt.appendChild(memberElt);
                    memberAttr = null;
                  }
                  const memberElt = this.createElement("member");
                  memberElt.setAttribute("hex", source[i].codePointAt(0).toString(16));
                  termElt.appendChild(memberElt);
                } else {
                  if (memberAttr) {
                    if (memberAttr.name === "string") {
                      memberAttr.value += source[i];
                    } else {
                      const memberElt = this.createElement("member");
                      memberElt.setAttributeNode(memberAttr);
                      termElt.appendChild(memberElt);
                      memberAttr = this.createAttribute("string");
                      memberAttr.value = source[i];
                    }
                  } else {
                    memberAttr = this.createAttribute("string");
                    memberAttr.value = source[i];
                  }
                }
              }
            }
            if (memberAttr) {
              const memberElt = this.createElement("member");
              memberElt.setAttributeNode(memberAttr);
              termElt.appendChild(memberElt);
            }
            altElt.appendChild(termElt);
            break;
          }
          case INSERTION_SYMBOL: {
            const content = term[2].split("");
            let scontent = "";
            for (let i = 0, l = content.length; i < l; i++) {
              const code = content[i].codePointAt(0);
              if (code >= 32 && code <= 126) {
                scontent += content[i];
              } else {
                if (scontent !== "") {
                  const termElt = this.createElement("insertion");
                  termElt.setAttribute("string", scontent);
                  altElt.appendChild(termElt);
                  scontent = "";
                }
                const termElt = this.createElement("insertion");
                termElt.setAttribute("hex", code.toString(16));
                altElt.appendChild(termElt);
              }
            }
            if (scontent !== "") {
              const termElt = this.createElement("insertion");
              termElt.setAttribute("string", scontent);
              altElt.appendChild(termElt);
              scontent = "";
            }
          break;
          }
        }
      });
      ruleElt.appendChild(altElt);
    });
    super.appendChild(ixmlElt);
  }
  #normalizeGrammar() {
    const normalizedDocument = new IXmlXmlDocument();
    replicate(this.grammarElement, normalizedDocument);
    this.normalizedGrammarElement = normalizedDocument.grammarElement;
    let ruleNodes = this.normalizedGrammarElement.childNodes.filter(e => e.nodeName === "rule");
    const inclusionReduce = n => {
      if (n.nodeName === "inclusion" && n.getAttribute("tmark") === "-") {
        n.nodeName = n.localName = "literal";
        const firstMember = n.childNodes[0];
        const code = firstMember.getAttribute("code");
        if (code) {
          n.setAttribute("string", IXmlXmlDocument.#unicodeClassToDefault[code]);
        } else {
          const from = firstMember.getAttribute("from");
          if (from) {
            if (from.startsWith("#")) {
              n.setAttribute("hex", from.substring(1));
            } else {
              n.setAttribute("string", from);
            }
          } else {
            const string = firstMember.getAttribute("string");
            if (string) {
              n.setAttribute("string", string[0]);
            } else {
              const hex = firstMember.getAttribute("hex");
              if (hex) {
                n.setAttribute("hex", hex);
              }
            }
          }
        }
        n.childNodes = [];
      } else if (n.nodeName === "exclusion" && n.getAttribute("tmark") === "-") {
        const reg = new RegExp(this.#termToRegex(n));
        n.nodeName = n.localName = "literal";
        let replacement = '';
        for (let c = 32; c <= 126; c++) {
          const char = String.fromCodePoint(c);
          if (reg.test(char)) {
            replacement = char;
            n.setAttribute("string", replacement);
            break;
          }
        }
        if (replacement === '') {
          for (let cp = 160; cp < 0xD800; cp++) {
            const char = String.fromCodePoint(cp);
            if (reg.test(char)) {
              replacement = char;
              n.setAttribute("hex", cp.toString(16));
              break;
            }
          }
        }
        if (replacement === '') {
          for (let cp = 0xE000; cp <= 0x10FFFF; cp++) {
            const char = String.fromCodePoint(cp);
            if (reg.test(char)) {
              replacement = char;
              n.setAttribute("hex", cp.toString(16));
              break;
            }
          }
        }
      } else {
        for (const c of n.childNodes) {
          inclusionReduce(c);
        }
      }
    };
    ruleNodes.forEach(inclusionReduce);
    const rulesMap = Object.fromEntries(ruleNodes.map(r => [r.getAttribute("name"), r]));
    let updated;
    const checkText = n => {
      if (n.getAttribute("ignoredText") === "") {
        switch (n.nodeName) {
          case "inclusion":
          case "exclusion":
          case "literal": {
            n.setAttribute("ignoredText", String(n.getAttribute("tmark") === "-"));
            updated = true;
            break;
          }
          case "comment":
          case "insertion": {
            n.setAttribute("ignoredText", "true");
            updated = true;
            break;
          }
          case "nonterminal": {
            const rule = rulesMap[n.getAttribute("name")];
            const ignoredText = rule?.getAttribute("ignoredText");
            const ignoredElement = rule?.getAttribute("mark") === "-" || n.getAttribute("mark") === "-";
            if (!ignoredElement) {
              n.setAttribute("ignoredText", "false");
              updated = true;
            } else if (ignoredText) {
              n.setAttribute("ignoredText", ignoredText);
              updated = true;
            }
            break;
          }
          default: {
            let ignoredText = "";
            for (const c of n.childNodes) {
              if (c.getAttribute("ignoredText") === "") {
                checkText(c);
                if (c.getAttribute("ignoredText") === "") {
                  ignoredText = null;
                }
              }
              if (ignoredText === "") {
                ignoredText = c.getAttribute("ignoredText");
              } else if (ignoredText === "true" && c.getAttribute("ignoredText") === "false") {
                ignoredText = "false";
              }
            }
            if (ignoredText) {
              n.setAttribute("ignoredText", ignoredText);
              updated = true;
            }
          }
        }
      }
    };
    do {
      updated = false;
      ruleNodes.forEach(checkText);
    } while (updated);
    const altReduce = n => {
      if ((n.nodeName === "alts" || n.nodeName === "rule") && n.childNodes.length > 1) {
        const ignoredText = n.childNodes.every(c => c.getAttribute("ignoredText") === "true");
        const emptyAlt = n.childNodes.some(c => c.childNodes.length === 0);
        if (ignoredText) {
          n.childNodes = [n.childNodes[0]];
          if (emptyAlt) {
            n.childNodes.push(this.createElement("alt"));
          }
          updated = true;
        }
      }
      for (const c of n.childNodes) {
        altReduce(c);
      }
    };
    do {
      updated = false;
      ruleNodes.forEach(altReduce);
    } while (updated);
    const checkDisposable = n => {
      for (const c of n.childNodes) {
        checkDisposable(c);
      }
      if (n.getAttribute("disposable") === "") {
        switch (n.nodeName) {
          case "option":
          case "repeat0": {
            let disposable = "true";
            for (const c of n.childNodes) {
              if (c.getAttribute("disposable") === "") {
                disposable = null;
                break;
              }
              if (c.getAttribute("ignoredText") !== "true" && c.getAttribute("disposable") !== "true") {
                disposable = "false";
                break;
              }
            }
            if (disposable) {
              n.setAttribute("disposable", disposable);
              updated = true;
            }
            if (n.childNodes.length === 1 && n.childNodes[0].nodeName === "alts" && n.getAttribute("disposable") === "false") {
              for (const alt of n.childNodes[0].childNodes) {
                if (alt.getAttribute("disposable") === "true" || alt.getAttribute("ignoredText") === "true") {
                  n.childNodes[0].removeChild(alt);
                  updated = true;
                }
              }
            }
            break;
          }
          case "nonterminal": {
            const mark = n.getAttribute("mark");
            const rule = rulesMap[n.getAttribute("name")];
            const disposable = (mark === "^" || mark === "@") ? "false" : rule?.getAttribute("disposable");
            if (disposable) {
              n.setAttribute("disposable", String(disposable));
              updated = true;
            }
            break;
          }
          case "insertion":
          case "inclusion":
          case "exclusion":
          case "member":
          case "literal": {
            n.setAttribute("disposable", "false");
            updated = true;
            break;
          }
          default: {
            let disposable = n.nodeName === "alt" && n.childNodes.length == 0 ? "false" : "true";
            for (const c of n.childNodes) {
              if (c.getAttribute("disposable") === "") {
                disposable = null;
                break;
              }
              if (c.getAttribute("disposable") !== "true") {
                disposable = "false";
                break;
              }
            }
            if (disposable) {
              if (n.nodeName === "rule") {
                n.setAttribute("disposable", disposable === "true" && n.getAttribute("mark") === "-" ? "true" : "false");
              } else {
              n.setAttribute("disposable", disposable);
              }
              updated = true;
            }
            break;
          }
        }
      }
    };
    do {
      updated = false;
      ruleNodes.forEach(checkDisposable);
    } while (updated);
    const purgeTerms = n => {
      for (const c of n.childNodes) {
        if (c instanceof XmlElement) {
          if (c.getAttribute("disposable") === "true") {
            n.removeChild(c);
          } else if (c.nodeName === "repeat1") {
            if (c.getAttribute("ignoredText") === "true") {
              c.removeAttribute("disposable");
              c.removeAttribute("ignoredText");
              purgeTerms(c);
              if (c.childNodes.length === 1) {
                n.childNodes[n.childNodes.indexOf(c)] = c.childNodes[0];
              } else {
                c.nodeName = c.localName = "alts";
                const alt = this.createElement("alt");
                c.childNodes.forEach(e => alt.appendChild(e));
                c.childNodes = [alt];
              }
            } else if (c.childNodes.length === 1 && c.childNodes[0].nodeName === "alts") {
              let firstDisposable = null;
              for (const alt of c.childNodes[0].childNodes) {
                if (alt.getAttribute("disposable") === "true" || alt.getAttribute("ignoredText") === "true") {
                  firstDisposable = alt;
                  break;
                }
              }
              c.removeAttribute("disposable");
              c.removeAttribute("ignoredText");
              const remainingAlts = c.childNodes[0].childNodes.filter(e => e.getAttribute("disposable") !== "true" && e.getAttribute("ignoredText") !== "true");
              purgeTerms(c);
              if (firstDisposable) {
                c.nodeName = c.localName = "alts";
                const alt1 = this.createElement("alt");
                alt1.appendChild(firstDisposable);
                const alt2 = this.createElement("alt");
                const newRepeat1 = this.createElement("repeat1");
                const newAlts = this.createElement("alts");
                newAlts.childNodes = remainingAlts;
                newRepeat1.appendChild(newAlts);
                alt2.appendChild(newRepeat1);
                c.childNodes = [firstDisposable, alt2];
              }
            } else {
              c.removeAttribute("disposable");
              c.removeAttribute("ignoredText");
              purgeTerms(c);
            }
          } else {
            c.removeAttribute("disposable");
            c.removeAttribute("ignoredText");
            purgeTerms(c);
          }
        }
      }
    }
    ruleNodes.forEach(purgeTerms);
    const usedTerms = new Set();
    if (ruleNodes.length > 0) {
      usedTerms.add(ruleNodes[0].getAttribute("name"));
    }
    const checkUsedTerms = n => {
      for (const c of n.childNodes ?? []) {
        checkUsedTerms(c);
      }
      if (n.nodeName === "nonterminal") {
        usedTerms.add(n.getAttribute("name"));
      }
    };
    this.normalizedGrammarElement.childNodes.forEach(checkUsedTerms);
    this.normalizedGrammarElement.childNodes = this.normalizedGrammarElement.childNodes.filter(e => !(e instanceof XmlElement) || usedTerms.has(e.getAttribute("name")));
    this.normalizedGrammarElement.childNodes.forEach(e => {
      if (e instanceof XmlElement) {
        e.removeAttribute("disposable");
        e.removeAttribute("ignoredText");
      }
    });
    ruleNodes = this.normalizedGrammarElement.childNodes.filter(e => e.nodeName === "rule");
    const checkAlts = n => {
      for (const c of n.childNodes) {
        checkAlts(c);
        if (c.nodeName === "alts" && c.childNodes.length === 1 && c.childNodes[0].childNodes.length === 1 && !["option", "repeat0", "repeat1"].includes(c.childNodes[0].childNodes[0].nodeName)) {
          n.childNodes[n.childNodes.indexOf(c)] = c.childNodes[0].childNodes[0];
          updated = true;
        }
      }
    };
    do {
      updated = false;
      ruleNodes.forEach(checkAlts);
    } while (updated);
  }
  #termToRegex(term) {
    return (term.localName === "inclusion" ? "[" : "[^")  + term.childNodes.reduce((members, member) => {
      let s = "";
      let term_from = member.getAttribute("from") || "";
      if (term_from !== "") {
        let term_to = member.getAttribute("to") || "";
        if (term_from.startsWith("#")) {
          const fromstring = parseInt(term_from.substring(1), 16).toString(16);
          if (fromstring.length < 3) {
            term_from = "\\x" + fromstring.padStart(2, '0');
          } else {
            term_from = "\\u" + fromstring.padStart(4, '0');
          }
        }
        if (term_to.startsWith("#")) {
          const tostring = parseInt(term_to.substring(1), 16).toString(16);
          if (tostring.length < 3) {
            term_to = "\\x" + tostring.padStart(2, '0');
          } else {
            term_to = "\\u" + tostring.padStart(4, '0');
          }
        }
        s = term_from + "-" + term_to;
      } else {
        const term_string = member.getAttribute("string") || "";
        if (term_string !== "") {
          s = term_string.replace(/([[\]\\^-])/g, '\\$1');
        } else {
          const term_hex = member.getAttribute("hex") || "";
          if (term_hex !== "") {
            let num = parseInt(term_hex, 16);
            if (num <= 0xFF) {
              s = "\\x" + num.toString(16).padStart(2, '0');
            } else if (num <= 0xFFFF) {
              s = "\\u" + num.toString(16).padStart(4, '0');
            } else {
              num -= 0x10000;
              let highSurrogate = ((num >> 10) & 0x3FF) | 0xD800;
              let lowSurrogate = (num & 0x3FF) | 0xDC00;
              s = "\\u" + highSurrogate.toString(16) + "\\u" + lowSurrogate.toString(16);
            }
          } else {
            const term_code = member.getAttribute("code") || "";
            s += "\\p{" + term_code + "}";
          }
        }
      }
      return members + s;
    }, "") + "]";
  }
  #generateRulesFromNode(grammarElement) {
    const termmark_to_MARK = { "@": ATTRIBUTE_MARK, "-": DELETED_MARK, "^": ELEMENT_MARK, "": INHERITED_MARK };
    const rulemark_to_MARK = { "@": ATTRIBUTE_MARK, "-": DELETED_MARK, "^": ELEMENT_MARK, "": ELEMENT_MARK };
    let rules = [];
    grammarElement.childNodes.forEach(rule => {
      if (rule.localName === "rule") {
        const rule_name = rule.getAttribute("name");
        const rule_alias = rule.getAttribute("alias");
        const rule_ns = [];
        const rule_targetName = rule_alias ? rule_alias : rule_name;
        const terms_reduce = (terms_o, term) => {
          let term_name = "";
          let term_alias = "";
          let term_targetName = "";
          let term_pick = null;
          let term_subrules = [];
          switch (term.localName) {
            case "nonterminal": {
              term_name = term.getAttribute("name");
              term_alias = term.getAttribute("alias");
              term_targetName = term_alias ? term_alias : term_name;
              term_pick = [[termmark_to_MARK[term.getAttribute("mark") || ""], NON_TERMINAL_SYMBOL, term_name, term_targetName]];
              break;
            }
            case 'attribute': {
              term_name = term.getAttribute("name");
              term_pick = [[INHERITED_MARK, ATTRIBUTE_VALUE_SYMBOL, term_name]];
              break;
            }
            case "starttag": {
              term_name = term.getAttribute("name");
              term_pick = [[INHERITED_MARK, ELEMENT_START_SYMBOL, term_name, term.childNodes.filter(c => c.localName === "ns").map(n => [n.getAttribute("prefix"), n.getAttribute("uri")])]];
              break;
            }
            case "endtag": {
              term_name = term.getAttribute("name");
              term_pick = [[INHERITED_MARK, ELEMENT_END_SYMBOL, term_name]];
              break;
            }
            case "insertion":
            case "literal": {
              const term_tmark = term.localName === "insertion" ? "" : (term.getAttribute("tmark") || "");
              const term_literal = term.getAttribute("string") || "";
              if (term_literal !== "") {
                if (term_literal.length === 1 || term.localName === "insertion") {
                  term_pick = [[termmark_to_MARK[term_tmark], term.localName === "insertion" ? INSERTION_SYMBOL : TERMINAL_SYMBOL, term_literal]];
                } else {
                  term_name = terms_o.name + "_" + terms_o.rule_count + "_literal_" + terms_o.literal_count++;
                  const term_reduce_o = term_literal.split("").map(c => {
                    const e = term.ownerDocument.createElement("literal");
                    e.setAttribute("string", c);
                    e.setAttribute("tmark", "-");
                    return e;
                  }).reduce(terms_reduce, {pick: [], subrules: [], name: terms_o.name, rule_count: terms_o.rule_count, literal_count: 1});
                  term_subrules = [[DELETED_MARK, term_name, term_name, [], term_tmark !== "-" ? term_reduce_o.pick.concat([[INHERITED_MARK, INSERTION_SYMBOL, term_literal]]) : term_reduce_o.pick]];
                  term_pick = [[termmark_to_MARK[term.getAttribute("mark") || ""], NON_TERMINAL_SYMBOL, term_name, term_name]];
                }
              } else {
                const term_hex = term.getAttribute("hex") || "";
                if (term_hex !== "") {
                  let num = parseInt(term_hex, 16);
                  if (num <= 0xFFFF) {
                    term_pick = [[termmark_to_MARK[term_tmark], term.localName === "insertion" ? INSERTION_SYMBOL : TERMINAL_SYMBOL, String.fromCodePoint(num)]];
                  } else {
                    num -= 0x10000;
                    let highSurrogate = ((num >> 10) & 0x3FF) | 0xD800;
                    let lowSurrogate = (num & 0x3FF) | 0xDC00;
                    const surrogates = [[DELETED_MARK, TERMINAL_SYMBOL, String.fromCodePoint(highSurrogate)], [DELETED_MARK, TERMINAL_SYMBOL, String.fromCodePoint(lowSurrogate)]];
                    term_name = terms_o.name + "_" + terms_o.rule_count + "_literal_" + terms_o.literal_count++;
                    term_subrules = [[DELETED_MARK, term_name, term_name, [], term_tmark !== "-" ? surrogates.concat([[INHERITED_MARK, INSERTION_SYMBOL, String.fromCodePoint(num)]]) : surrogates]];
                    term_pick = [[termmark_to_MARK[term.getAttribute("mark") || ""], NON_TERMINAL_SYMBOL, term_name, term_name]];
                    }
                }
              }
              break;
            }
            case "inclusion":
            case "exclusion": {
              const term_tmark = term.getAttribute("tmark") || "";
              const term_reg = this.#termToRegex(term);
              term_pick = [[termmark_to_MARK[term_tmark], CHARACTERSET_SYMBOL, new RegExp(term_reg, "u")]];
              break;
            }
            case "alts": {
              term_name = terms_o.name + "_" + terms_o.rule_count + "_alts_" + terms_o.alts_count++;
              term.childNodes.forEach(alt => {
                const term_reduce_o = alt.childNodes.reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                term_subrules.push([DELETED_MARK, term_name, term_name, [], term_reduce_o.pick]);
                term_subrules = term_subrules.concat(term_reduce_o.subrules);
              });
              term_pick = [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]];
              break; 
            }
            case "option": {
              term_name = terms_o.name + "_" + terms_o.rule_count + "_option_" + terms_o.option_count++;
              if (term.childNodes[0].localName !== "alts") {
                const term_reduce_o = term.childNodes.reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                term_subrules.push([DELETED_MARK, term_name, term_name, [], term_reduce_o.pick]);
                term_subrules = term_subrules.concat(term_reduce_o.subrules);
              } else {
                term.childNodes[0].childNodes.forEach(alt => {
                  const term_reduce_o = alt.childNodes.reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                  term_subrules.push([DELETED_MARK, term_name, term_name, [], term_reduce_o.pick]);
                  term_subrules = term_subrules.concat(term_reduce_o.subrules);
                  });
              }
              term_subrules.push([DELETED_MARK, term_name, term_name, [], []]);
              term_pick = [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]];
              break;
            }
            case "repeat0": {
              term_name = terms_o.name + "_" + terms_o.rule_count + "_repeat0_" + terms_o.repeat0_count++;
              if (term.childNodes.length === 2) {
                const tsep = [];
                term.childNodes[1].childNodes.forEach(t => {
                  tsep.push(t);
                });
                const term_sep_reduce_o = tsep.concat([term.childNodes[0]]).reduce(terms_reduce, {pick: [], subrules: [], name: term_name + "_sep", rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                const term_reduce_o = [term.childNodes[0]].reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                term_subrules.push([DELETED_MARK, term_name, term_name, [], term_reduce_o.pick.concat([[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name + "_next"]])]);
                term_subrules = term_subrules.concat(term_reduce_o.subrules);
                term_subrules.push([DELETED_MARK, term_name + "_next", term_name + "_next", [], [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name + "_next"], [DELETED_MARK, NON_TERMINAL_SYMBOL, term_name + "_sep"]]]);
                term_subrules.push([DELETED_MARK, term_name + "_sep", term_name + "_sep", [], term_sep_reduce_o.pick]);
                term_subrules = term_subrules.concat(term_sep_reduce_o.subrules);
                term_subrules.push([DELETED_MARK, term_name + "_next", term_name + "_next", [], []]);
              } else {
                if (term.childNodes[0].localName !== "alts") {
                  const term_reduce_o = [term.childNodes[0]].reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                  term_subrules.push([DELETED_MARK, term_name, term_name, [], [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]].concat(term_reduce_o.pick)]);
                  term_subrules = term_subrules.concat(term_reduce_o.subrules);
                } else {
                  term.childNodes[0].childNodes.forEach(alt => {
                    const term_reduce_o = alt.childNodes.reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                    term_subrules.push([DELETED_MARK, term_name, term_name, [], [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]].concat(term_reduce_o.pick)]);
                    term_subrules = term_subrules.concat(term_reduce_o.subrules);
                    });
                }
              }
              term_subrules.push([DELETED_MARK, term_name, term_name, [], []]);
              term_pick = [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]];
              break;
            }
            case "repeat1": {
              term_name = terms_o.name + "_" + terms_o.rule_count + "_repeat1_" + terms_o.repeat1_count++;
              let term_reduce_o;
              if (term.childNodes.length === 2) {
                const term_sep_reduce_o = term.childNodes[1].childNodes.reduce(terms_reduce, {pick: [], subrules: [], name: term_name + "_sep", rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                term_reduce_o = [term.childNodes[0]].reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                term_subrules.push([DELETED_MARK, term_name, term_name, [], [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]].concat(term_sep_reduce_o.pick.concat(term_reduce_o.pick))]);
                term_subrules = term_subrules.concat(term_sep_reduce_o.subrules);
                term_subrules = term_subrules.concat(term_reduce_o.subrules);
              } else {
                term_reduce_o = [term.childNodes[0]].reduce(terms_reduce, {pick: [], subrules: [], name: term_name, rule_count: terms_o.rule_count, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
                term_subrules.push([DELETED_MARK, term_name, term_name, [], [[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]].concat(term_reduce_o.pick)]);
                term_subrules = term_subrules.concat(term_reduce_o.subrules);
              }
              term_subrules.push([DELETED_MARK, term_name, term_name, [], []]);
              term_pick = term_reduce_o.pick.concat([[DELETED_MARK, NON_TERMINAL_SYMBOL, term_name, term_name]]);
              break;
            }
          }
          return {pick: term_pick ? terms_o.pick.concat(term_pick) : terms_o.pick, subrules: terms_o.subrules.concat(term_subrules), name: terms_o.name, rule_count: terms_o.rule_count, alts_count: terms_o.alts_count, option_count: terms_o.option_count, repeat0_count: terms_o.repeat0_count, repeat1_count: terms_o.repeat1_count, literal_count: terms_o.literal_count};
        }
        rule.childNodes.forEach((alt, index) => {
          if (alt.localName === "ns") {
            const prefix = alt.getAttribute("prefix") ?? '';
            const uri = alt.getAttribute("uri");
            rule_ns.push([prefix, uri]);
          }
          if (alt.localName === "alt") {
            const alt_o = alt.childNodes.reduce(terms_reduce, {pick: [], subrules: [], name: rule_name, rule_count: index + 1, alts_count: 1, option_count: 1, repeat0_count: 1, repeat1_count: 1, literal_count: 1});
            const rule_pick = rule.getAttribute("mark") || "";
            rules.push([rulemark_to_MARK[rule_pick], rule_name, rule_targetName, rule_ns, alt_o.pick]);
            rules = rules.concat(alt_o.subrules);
          }
        });
      }
    });
    const ruleNames = [];
    const rulePositions = {};
    rules.forEach((rule, index) => {
      const ruleName = IXmlXmlDocument.MARK_to_rulemark[rule[0]] + rule[1] + (rule[1] !== rule[2] ? ">" + rule[2] : "");
      if (!rulePositions[ruleName]) {
        rulePositions[ruleName] = [index];
        ruleNames.push(ruleName);
      } else {
        rulePositions[ruleName].push(index);
      }
    });
    const orderedRules = [];
    ruleNames.forEach(ruleName => {
      rulePositions[ruleName].forEach(index => {
        orderedRules.push(rules[index]);
      });
    });
    return orderedRules;
  }
  #generateNormalizingRules() {
    this.normalizingRules = [];
    for (const rule of this.normalizedRules) {
      const [, name, alias,, terms] = rule;
      const newTerms = [];
      let deletedString = "";
      let insertedString = "";
      const stringProcess = () => {
        if (insertedString !== "") {
          for (const char of insertedString) {
            newTerms.push([DELETED_MARK, TERMINAL_SYMBOL, char]);
          }
        }
        insertedString = "";
        if (deletedString !== "") {
          newTerms.push([INHERITED_MARK, INSERTION_SYMBOL, deletedString]);
        }
        deletedString = "";
      };
      for (const term of terms) {
        const [tmark, type, name, alias] = term;
        if (type === TERMINAL_SYMBOL && tmark === DELETED_MARK) {
          deletedString += name;
        } else if (type === INSERTION_SYMBOL) {
          insertedString += name;
        } else {
          stringProcess();
          if (type === NON_TERMINAL_SYMBOL) {
            newTerms.push([tmark, type, name, alias]);
          } else {
            newTerms.push([tmark, type, name]);
          }
        }
      }
      stringProcess();
      this.normalizingRules.push([DELETED_MARK, name, alias, [], newTerms]);
    }
    if (this.normalizingRules.length !== 0) {
      const [, firstRuleName, firstRuleAlias] = this.normalizingRules[0];
      this.normalizingRules = [[DELETED_MARK, '#initialRule', '#initialRule', [], [[ELEMENT_MARK, NON_TERMINAL_SYMBOL, firstRuleName, firstRuleAlias]]], ...this.normalizingRules];
      const defaultMarks = {};
      const defaultAliases = {};
      this.normalizedRules.forEach(r => {
        const [mark, name, alias] = r;
        defaultMarks[name] = mark;
        defaultAliases[name] = alias;
      });
      this.normalizingRules.forEach(r => {
        const terms = r[4];
        const newTerms = [];
        terms.forEach(term => {
          const [tmark, type, name, alias] = term;
          const defaultMark = defaultMarks[name];
          const defaultAlias = defaultAliases[name];
          const newTmark = type === NON_TERMINAL_SYMBOL && tmark === INHERITED_MARK ? defaultMark : tmark;
          const newAlias = type === NON_TERMINAL_SYMBOL && name === alias ? defaultAlias : alias;
          if (newTmark === ATTRIBUTE_MARK) {
            newTerms.push([INHERITED_MARK, ATTRIBUTE_VALUE_SYMBOL, name, newAlias]);
          } else {
            if (type === NON_TERMINAL_SYMBOL && newTmark !== DELETED_MARK) {
              newTerms.push([DELETED_MARK, ELEMENT_START_SYMBOL, newAlias]);
            }
            if (type !== NON_TERMINAL_SYMBOL || !alias && !defaultAlias) {
              newTerms.push([newTmark, type, name]);
            } else {
              newTerms.push([DELETED_MARK, type, name, newTmark !== DELETED_MARK && type === NON_TERMINAL_SYMBOL && name === alias || !alias ? defaultAlias : alias]);
            }
            if (type === NON_TERMINAL_SYMBOL && newTmark !== DELETED_MARK) {
              newTerms.push([DELETED_MARK, ELEMENT_END_SYMBOL, newAlias]);
            }
          }
        });
        r[4] = newTerms;
      });
    }
  }
  generateRules(rules) {
    this.rules = rules ?? this.#generateRulesFromNode(this.grammarElement);
    this.#expandedGrammarFromRules()
    this.generateParseFunction();
    this.#normalizeGrammar();
    this.normalizedRules = this.#generateRulesFromNode(this.normalizedGrammarElement);
    this.#generateNormalizingRules();
    this.generateNormalizeFunction();
  }
}

export const MARK_to_termmark = IXmlXmlDocument.MARK_to_termmark;
export const MARK_to_rulemark = IXmlXmlDocument.MARK_to_rulemark;