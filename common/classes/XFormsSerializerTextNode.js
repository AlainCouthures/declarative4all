import { TEXT_NODE } from "../utils/constants.js";
import { encodeTextEntities } from '../utils/encodeEntities.js';

export class XFormsSerializerTextNode {
  nodeType = TEXT_NODE;
  constructor(text) {
    this.textContent = text;
  }
  serialize() {
    return encodeTextEntities(this.textContent);
  }
}