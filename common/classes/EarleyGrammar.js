import { EarleyRule } from "../classes/EarleyRule.js";

export class EarleyGrammar {
  byName = {};
  constructor(rules) {
    this.rules = rules.map(r => new EarleyRule(r));
    this.rules.forEach(rule => {
      (this.byName[rule.name] ??= []).push(rule);
    });
  }
  toString() {
    return this.rules.map(rule => rule.toString()).join('\n');
  }
}