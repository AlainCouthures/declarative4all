import { INSERTION_SYMBOL, TERMINAL_SYMBOL, ELEMENT_MARK } from "./constants.js";
import { richJSONstringify } from "./richJSONstringify.js";

export const generateGrammar = rules => ({
  Lexer: undefined,
  ParserRules: rules.map(([type, name, alias, terms]) => ({
    name,
    symbols: terms
      .filter(([ , termType]) => termType !== INSERTION_SYMBOL)
      .map(([ , termType, value]) => termType === TERMINAL_SYMBOL ? { literal: value } : value),
    postprocess: terms.length > 0 || type === ELEMENT_MARK ? eval(`T => termsToNode(T, ${richJSONstringify([type, name, alias, terms]).replaceAll('\\\\', '\\')})`) : undefined
  })),
  ParserStart: rules[0]?.[1]
});