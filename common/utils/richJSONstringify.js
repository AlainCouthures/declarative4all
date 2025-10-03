export const richJSONstringify =
  o =>
    JSON.stringify(o,
      (k, v) =>
        v instanceof RegExp ?
          '__REGEX__' + v.toString().replace(/"/g, '___quote___') + '___REGEXEND___' :
           v)
    .replace(/"__REGEX__/g, '')
    .replace(/___REGEXEND___"/g, '')
    .replace(/___quote___/g, '"');