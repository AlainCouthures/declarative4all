import { MARK_to_rulemark } from "./IXmlXmlDocument.js";
import { EarleySymbol } from "./EarleySymbol.js";

export class EarleyRule {
  constructor([mark, name, alias, ns, symbols]) {
    Object.assign(this, {mark, name, alias, ns});
    this.ns = ns.map(n => ({ prefix: n[0], URI: n[1] }));
    this.symbols = symbols.map(symbol => new EarleySymbol(symbol));
  }
  toString(cursorAt) {
    const symbolStr = this.symbols.map((s, i) => [i === cursorAt ? '● ' : '', s.toString()].join('')).join(', ');
    return `${MARK_to_rulemark[this.mark]}${this.name}${this.alias !== this.name ? `>${this.alias}` : ''}${this.ns.reduce((acc, n) => acc + ` xmlns${n.prefix ? ':' + n.prefix : ''}="${n.URI}"`, '')}: ${symbolStr}${cursorAt === this.symbols.length ? '. ●' : '.'}`;
  }
}