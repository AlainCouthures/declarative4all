export class EarleyStreamLexer {
  #buffer = '';
  #index = 0;
  #line = 1;
  #bufferFirstLine = 1;
  #lastLineBreak = 0;
  [Symbol.iterator]() {
    return this;
  }
  reset(data, state) {
    this.#buffer = data;
    this.#index = 0;
    this.#line = state?.line ?? 1;
    this.#bufferFirstLine = this.#line;
    this.#lastLineBreak = state ? -state.col : 0;
  }
  next() {
    if (this.#index < this.#buffer.length) {
      const c = this.#buffer[this.#index++];
      if (c === '\n') {
        this.#line += 1;
        this.#lastLineBreak = this.#index;
      }
      return {
        value: {
          char: c
        },
        done: false
      };
    }
    return {
      value: null,
      done: true
    };
  }
  save() {
    return {
      line: this.#line,
      col: this.#index - this.#lastLineBreak
    };
  }
  formatError(value, message) {
    if (typeof this.#buffer !== 'string') {
      return `${message} at index ${this.#index - 1}`;
    }
    const col = this.#index - this.#lastLineBreak + (value.endOfText ? 1 : 0);
    const lines = this.#buffer.split('\n').slice(Math.max(0, this.#line - this.#bufferFirstLine - 4), this.#line - this.#bufferFirstLine + 1);
    const lastLineDigits = String(this.#line).length;
    const pad = (n, len) => ' '.repeat(len - String(n).length) + n;
    return [
      value.endOfText ? `${message} at end of line ${this.#line}` : `${message} at line ${this.#line} col ${col}:`,
      "",
      lines.map((text, i) => 
        `${pad(this.#line - lines.length + i + 1, lastLineDigits)}: ${text}`
      ).join('\n'),
      `${' '.repeat(lastLineDigits + col + 1)}^`
    ].join('\n');
  }
}