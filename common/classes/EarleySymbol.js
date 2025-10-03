import { TERMINAL_SYMBOL, NON_TERMINAL_SYMBOL, ELEMENT_START_SYMBOL, ELEMENT_END_SYMBOL, ATTRIBUTE_VALUE_SYMBOL, INSERTION_SYMBOL, CHARACTERSET_SYMBOL } from "../utils/constants.js";
import { MARK_to_termmark } from "./IXmlXmlDocument.js";

export class EarleySymbol {
  constructor([sMark, sType, sValue, sComp]) {
    this.mark = sMark;
    const handlers = {
      [TERMINAL_SYMBOL]: () => this.char = sValue,
      [CHARACTERSET_SYMBOL]: () => this.regExp = sValue,
      [INSERTION_SYMBOL]: () => this.string = sValue,
      [NON_TERMINAL_SYMBOL]: () => {
        this.name = sValue;
        this.alias = sComp;
      },
      [ELEMENT_START_SYMBOL]: () => {
        this.startName = sValue;
        this.ns = (sComp ?? []).map(ns => ({
          prefix: ns[0],
          URI: ns[1]
        }));
      },
      [ELEMENT_END_SYMBOL]: () => this.endName = sValue,
      [ATTRIBUTE_VALUE_SYMBOL]: () => {
        this.attributeName = sValue;
        this.alias = sComp;
      }
    };
    handlers[sType]?.();
    return this;
  }
  toString() {
    if (this.name) {
      return `${MARK_to_termmark[this.mark]}${this.name}${this.alias && this.name !== this.alias ? '>' + this.alias : ''}`;
    }
    if (this.startName) {
      return `<${this.startName}${this.ns.reduce((acc, n) => acc + ` xmlns${n.prefix ? ':' + n.prefix : ''}="${n.URI}"`, '')}>`;
    }
    if (this.endName) {
      return `</${this.endName}>`;
    }
    if (this.attributeName) {
      return `<@${this.attributeName}>`;
    }
    if (this.char) {
      const code = this.char.codePointAt(0);
      if (code <= 31 || code >= 127) {
        return `${MARK_to_termmark[this.mark]}#${code.toString(16)}`;
      }
      const sep = this.char.includes('"') ? "'" : '"';
      return `${MARK_to_termmark[this.mark]}${sep}${this.char}${sep}`;
    }
    if (this.regExp) {
      const source = [...this.regExp.source];
      const start = source[1] === '^' ? 2 : 1;
      const parts = [];
      let chunk = '';
      let inRange = false;
      for (let i = start; i < source.length - 1; i++) {
        const char = source[i];
        if (char === '\\') {
          const next = source[++i];
          if (next === 'p') {
            i += 2;
            let code = '';
            while (source[i] !== '}') {
              code += source[i++];
            }
            if (chunk) {
              const sep = chunk.includes('"') ? "'" : '"';
              parts.push(`${sep}${chunk}${sep}`);
              chunk = '';
            }
            parts.push(code);
          } else if (['x', 'u'].includes(next)) {
            if (chunk) {
              const sep = chunk.includes('"') ? "'" : '"';
              parts.push(`${sep}${chunk}${sep}`);
              chunk = '';
            }
            const len = next === 'x' ? 2 : 4;
            const hex = source.slice(i + 1, i + 1 + len).join("");
            if (inRange) {
              parts[parts.length - 1] += `#${hex}`;
              inRange = false;
            } else {
              parts.push(`#${hex}`);
            }
            i += len;
          } else {
            chunk += next;
          }
        } else if (char === '-') {
          if (chunk.length > 1) {
            const [from, ...rest] = [...chunk].reverse();
            if (rest.length) {
              const sep = rest.join('').includes('"') ? "'" : '"'; 
              parts.push(`${sep}${rest.reverse().join("")}${sep}`);
            }
            chunk = from;
          }
          const sep = chunk.includes('"') ? "'" : '"';
          parts.push(`${sep}${chunk}${sep}-`);
          inRange = true;
          chunk = '';
        } else {
          const code = char.codePointAt(0);
          if (code <= 31 || code >= 127) {
            if (chunk) {
              const sep = chunk.includes('"') ? "'" : '"';
              parts.push(`${sep}${chunk}${sep}`);
              chunk = '';
            }
            if (inRange) {
              parts[parts.length - 1] += `#${code.toString(16)}`;
              inRange = false;
            } else {
              parts.push(`#${code.toString(16)}`);
            }
          } else if (inRange) {
            const sep = char.includes('"') ? "'" : '"';
            parts[parts.length - 1] += `${sep}${char}${sep}`;
            inRange = false;
          } else {
            chunk += char;
          }
        }
      }
      if (chunk) {
        const sep = chunk.includes('"') ? "'" : '"';
        parts.push(`${sep}${chunk}${sep}`);
      }
      return `${MARK_to_termmark[this.mark]}${start === 1 ? '' : '~'}[${parts.join('; ')}]`;
    }
    if (this.string) {
      const parts = [];
      let chunk = '';
      for (const char of this.string) {
        const code = char.codePointAt(0);
        if (code >= 32 && code <= 126) {
          chunk += char;
        } else {
          if (chunk) {
            const sep = chunk.includes('"') ? "'" : '"';
            parts.push(`+${sep}${chunk}${sep}`);
            chunk = '';
          }
          parts.push(`+#${code.toString(16)}`);
        }
      }
      if (chunk) {
        const sep = chunk.includes('"') ? "'" : '"';
        parts.push(`+${sep}${chunk}${sep}`);
      }
      return parts.join(', ');
    }
  }
}