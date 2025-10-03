import { TEXT_NODE } from "../utils/constants.js";

export class EarleyXmlLexer {
  #node = null;
  #ancestorsAttributes = [];
  #buffer = '';
  #index = 0;
  #startTag = true;
  #endTag = false;
  #done = false;
  #text = '';
  #textIndex = 0;
  #inject = false;
  [Symbol.iterator]() {
    return this;
  }
  reset(node) {
    this.#node = node.documentElement ?? node;
  }
  inject(text) {
    this.#text = text;
    this.#inject = true;
    this.#textIndex = 0;
  }
  #nextNode() {
    this.#buffer = '';
    this.#index = 0;
    if (this.#node.nextSibling) {
      this.#node = this.#node.nextSibling;
      if (this.#node.nodeType === TEXT_NODE) {
        this.#buffer = this.#node.textContent;
        this.#index = 0;
      } else {
        this.#startTag = true;
      }
    } else {
      this.#node = this.#node.parentNode;
      this.#endTag = true;
      this.#done = !this.#node;
    }
  }
  next() {
    if (this.#done) {
      return {
        done: true
      };
    }
    if (this.#inject) {
      if (this.#textIndex < this.#text.length) {
        const c = this.#text[this.#textIndex++];
        return {
          value: {
            char: c,
            injected: true
          }
        };
      } else {
        this.#inject = false;
        return {
          value: {
            completed: true,
            injected: true
          }
        }
      }
    }
    if (this.#node.nodeType === TEXT_NODE && this.#index < this.#buffer.length) {
      const c = this.#buffer[this.#index++];
      const parentAttributes = this.#ancestorsAttributes[this.#ancestorsAttributes.length - 1];
      if (this.#index === this.#buffer.length) {
        this.#nextNode();
      }
      return {
        value: {
          char: c,
          attributes: parentAttributes
        }
      };
    }
    if (this.#startTag) {
      const previousAttributes = this.#ancestorsAttributes[this.#ancestorsAttributes.length - 1] ?? {};
      const parentAttributes = Object.fromEntries((this.#node.attributes?.filter(attr => attr.namespaceURI !== 'http://invisiblexml.org/NS') ?? []).map(({name, value}) => [name, value]));
      this.#ancestorsAttributes.push(parentAttributes);
      this.#startTag = false;
      const elementName = this.#node.nodeName;
      if (this.#node.childNodes.length > 0) {
        this.#node = this.#node.childNodes[0];
        if (this.#node.nodeType === TEXT_NODE) {
          this.#buffer = this.#node.textContent;
          this.#index = 0;
        } else {
          this.#startTag = true;
        }
      } else {
        this.#endTag = true;
      }
      return {
        value: {
          startName: elementName,
          attributes: previousAttributes,
          nextAttributes: parentAttributes
        }
      };
    }
    if (this.#endTag) {
      this.#endTag = false;
      const elementName = this.#node.nodeName;
      const parentAttributes = this.#ancestorsAttributes.pop();
      const previousAttributes = this.#ancestorsAttributes[this.#ancestorsAttributes.length - 1] ?? {};
      this.#nextNode();
      return {
        value: {
          endName: elementName,
          attributes: parentAttributes,
          nextAttributes: previousAttributes
        }
      };
    }
  }
  save() {
    return null;
  }
  formatError(value, message) {
    let valueDisplay = '';
    if (value.endOfText) {
      valueDisplay = 'end of text';
    } else if ('startName' in value) {
      valueDisplay = `<${value.startName}>`;
    } else if ('endName' in value) {
      valueDisplay = `</${value.endName}>`;
    } else {
      valueDisplay = JSON.stringify(value.char);
    }
    return `${message} at ${valueDisplay}`;
  }
}