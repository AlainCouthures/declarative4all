import { fail } from "./EarleyParser.js";
import { EarleyState } from "./EarleyState.js";

export class EarleyColumn {
  states = [];
  wants = {};
  scannable = [];
  completed = {};
  constructor(parser, reference) {
    Object.assign(this, {parser, reference});
  }
  process(value) {
    const {states, wants, completed} = this;
    for (const state of states) {
      if (state.isComplete) {
        state.finish();
        if (state.data !== fail) {
          for (const left of state.wantedBy) {
            this.#complete(left, state, value);
          }
          if (state.reference === this.reference) {
            const exp = state.rule.name;
            (completed[exp] ??= []).push(state);
          }
        }
        continue;
      }
      const exp = state.rule.symbols[state.dot]?.name;
      if (!exp) {
        this.scannable.push(state);
        continue; 
      }
      if (wants[exp]) {
        wants[exp].push(state);
        if (completed[exp]) {
          for (const right of completed[exp]) {
            this.#complete(state, right, value);
          }
        }
      } else {
        wants[exp] = [state];
        this.predict(exp, value);
      }
    }
  }
  predict(exp, value) {
    //console.log(`Predicting: ${exp}`);
    const rules = this.parser.grammar.byName[exp] ?? [];
    for (const rule of rules) {
      const state = new EarleyState(rule, 0, this.reference, this.wants[exp], this.parser);
      const expectingState = state.expectingState(rule.symbols[0], this.reference, value, this.parser);
      if (expectingState) {
        this.states.push(expectingState);
      }
    }
  }
  #complete(left, right, value) {
    this.states.push(left.nextState(right, value, this.parser));
  }
}