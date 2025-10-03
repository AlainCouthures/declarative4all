import { EarleyColumn } from "./EarleyColumn.js";
import { EarleyStreamLexer } from "./EarleyStreamLexer.js";

class EarleyParserError extends Error {
  constructor(message, offset, value) {
    super(message);
    this.name = "EarleyParserError";
    this.offset = offset;
    this.value = value;
  }
}

export class EarleyParser {
  static fail = {};
  grammar = null;
  lexer = null;
  #lexerState = null;
  #table = [];
  #current = 0;
  #start = null;
  #value = {
    char: null
  };
//  #stringInput = true;
  constructor(grammar, lexer, start) {
    this.grammar = grammar;
    this.lexer = lexer;
    const column = new EarleyColumn(this, 0);
    this.#table = [column];
    this.#start = start ?? grammar.rules[0]?.name;
    column.wants[this.#start] = [];
    column.predict(this.#start);
    column.process();
  }
  feed(chunk) {
    const lexer = this.lexer;
    lexer.reset(chunk, this.#lexerState);
    try {
      for (this.#value of lexer) {
        //console.log('-------------------------------------------------');
        //console.log(`Processing '${JSON.stringify(this.#value)}'`);
        //console.log('-------------------------------------------------');
        const column = this.#table[this.#current];
        delete this.#table[this.#current - 1];
        const nextColumn = new EarleyColumn(this, this.#current + 1);
        this.#table.push(nextColumn);
        column.scannable.forEach(state => {
          if (!this.#value.endOfText) {
            const expect = state.rule.symbols[state.dot];
            let data = null;
            if ('char' in expect && 'char' in this.#value && expect.char === this.#value.char) {
              data = this.#value.char;
            } else if ('regExp' in expect && 'char' in this.#value && expect.regExp.test(this.#value.char)) {
              data = this.#value.char;
            } else if ('startName' in expect && expect.startName === this.#value.startName) {
              this.#value.attributes = this.#value.nextAttributes;
              data = {
                startName: this.#value.startName,
                attributes: this.#value.attributes
              };
            } else if ('endName' in expect && expect.endName === this.#value.endName) {
              data = {
                endName: this.#value.endName,
                attributes: this.#value.attributes
              };
              this.#value.attributes = this.#value.nextAttributes;
            }
            if (data !== null) {
              const nextState = state.nextState({data: data, reference: this.#current}, this.#value, this);
              if (nextState) {
                nextColumn.states.push(nextState);
              }
            }
          }
        });
        nextColumn.process(this.#value);
        if (nextColumn.states.length === 0) {
          throw new EarleyParserError(this.#reportError(), this.#current, this.#value.char);
        }
        this.#current++;
      }
    } catch (e) {
      if (e instanceof EarleyParserError) {
        throw e;
      } else {
        const nextColumn = new EarleyColumn(this, this.#current + 1);
        this.#table.push(nextColumn);
        throw new EarleyParserError(this.#reportLexerError(e), this.#current, e.value?.char);
      }
    }
    this.#value = {
      endOfText: true
    };
    if (this.#table[this.#current]) {
      this.#lexerState = lexer.save();
    }
    return this;
  }
  #reportLexerError(lexerError) {
    const {token} = lexerError;
    const tokenDisplay = token ? `input ${JSON.stringify(token.text[0])} (lexer error)` : 'input (lexer error)';
    const lexerMessage = token ? this.lexer.formatError(token, "Syntax error") : lexerError.message;
    return this.#reportErrorCommon(lexerMessage, tokenDisplay);
  }
  #reportError() {
    let valueDisplay = '';
    if (this.#value.endOfText) {
      valueDisplay = 'end of text';
    } else if ('startName' in this.#value) {
      valueDisplay = `<${this.#value.startName}>`;
    } else if ('endName' in this.#value) {
      valueDisplay = `</${this.#value.endName}>`;
    } else {
      valueDisplay = JSON.stringify(this.#value.char);
    }
    return this.#reportErrorCommon(this.lexer.formatError(this.#value, this.lexer instanceof EarleyStreamLexer ? 'Syntax error' : 'Normalizing error'), valueDisplay);
  }
  #reportErrorCommon(lexerMessage, valueDisplay) {
    const lines = [lexerMessage];
    const lastColumn = this.#table[this.#table.length - (this.#value.endOfText ? 1 : 2)];
    if (!lastColumn) {
      return lines.concat('').join('\n');
    }
    const expectantStates = lastColumn.states.filter(state => {
      const nextSymbol = state.rule.symbols[state.dot];
      return nextSymbol?.char || nextSymbol?.regExp || nextSymbol?.startName || nextSymbol?.endName;
    });
    if (expectantStates.length === 0) {
      lines.push(`Unexpected ${valueDisplay}. I did not expect any more input. Here is the state of my parse table:\n`);
      this.#displayStateStack(lastColumn.states, lines);
    } else {
      lines.push(`Unexpected ${valueDisplay}. Instead, I was expecting to see one of the following:\n`);
      expectantStates.map(state => this.#buildFirstStateStack(state, []) || [state]).forEach(stateStack => {
        const nextSymbol = stateStack[0].rule.symbols[stateStack[0].dot];
        const symbolDisplay = this.#getSymbolDisplay(nextSymbol);
        lines.push(`${/^[aeiou]/i.test(symbolDisplay) ? 'An' : 'A'} ${symbolDisplay} based on:`);
        this.#displayStateStack(stateStack, lines);
      });
    }
    return lines.concat('').join('\n');
  }
  #displayStateStack(stateStack, lines) {
    let lastDisplay = null;
    let count = 0;
    for (const state of stateStack) {
      const display = state.rule.toString(state.dot);
      if (display === lastDisplay) {
        count++;
        continue;
      }
      if (count > 0) {
        lines.push(`    ^ ${count} more lines identical to this`);
      }
      lines.push(`    ${display}`);
      lastDisplay = display;
      count = 0;
    }
  }
  #getSymbolDisplay(symbol) {
    if (symbol.name) {
      return symbol.toString();
    } else if (symbol.char) {
      return symbol.toString();
    } else if (symbol.regExp) {
      return `character matching ${symbol.toString()}`;
    } else if (symbol.startName) {
      return `start tag <${symbol.startName}>`;
    } else if (symbol.endName) {
      return `end tag </${symbol.endName}>`;
    } else if (symbol.attributeName) {
      return `attribute ${symbol.attributeName}`;
    } else {
      return `insertion of ${JSON.stringify(symbol.string)}`;
    }
  }
  #buildFirstStateStack(state, visited) {
    if (visited.indexOf(state) !== -1) {
      return null;
    }
    if (state.wantedBy.length === 0) {
      return [state];
    }
    const prevState = state.wantedBy[0];
    const childVisited = [state].concat(visited);
    const childResult = this.#buildFirstStateStack(prevState, childVisited);
    if (childResult === null) {
      return null;
    }
    return [state].concat(childResult);
  }
  finish() {
    if (this.#value.endOfText ||  this.#value.char) {
      const results = this.#table.at(-1).states.filter(state => 
        state.rule.name === this.#start &&
        state.dot === state.rule.symbols.length &&
        state.reference === 0 &&
        state.data !== EarleyParser.fail
      ).map(state => state.data);
      if (results.length === 0) {
        throw new EarleyParserError(this.#reportError(), this.#current,this.#value.char);
      }
      return results;
    }
    return [];
  }
}

export const fail = EarleyParser.fail;