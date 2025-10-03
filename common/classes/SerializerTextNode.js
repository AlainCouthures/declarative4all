import { encodeTextEntities } from '../utils/encodeEntities.js';

export class SerializerTextNode {
  constructor(text) {
    this.textContent = encodeTextEntities(text);
  }
  toParentNode() {
    return this.textContent;
  }
}