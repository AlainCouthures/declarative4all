export function resolveEntities(doctype, s) {
  const entityMap = {
    amp: '&',
    lt: '<',
    gt: '>',
    apos: "'",
    quot: '"'
  };
  const [first, ...parts] = s.split('&');
  return parts.reduce((result, part) => {
    const [name, ...rest] = part.split(';');
    const value = name.startsWith('#') 
      ? String.fromCharCode(name[1] === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10))
      : entityMap[name] ?? doctype?.getEntity(name);
    return result + (value ?? `&${name};`) + rest.join(';');
  }, first);
}