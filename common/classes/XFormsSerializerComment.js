import { COMMENT_NODE } from "../utils/constants.js";

export class XFormsSerializerComment {
  nodeType = COMMENT_NODE;
  constructor(data) {
    this.data = data;
  }
  serialize(offset = '') {
    return `${offset}<!--${this.data}-->`;
  }
}