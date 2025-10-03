export async function mainCLI(argv = []) {
  const [a, b] = argv.map(Number);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    console.error('Usage: node monapp.mjs <a> <b>');
    process.exitCode = 1;
    return;
  }
  const res = calculTruc(a, b);
  console.log(res);
}

const isNode = typeof process !== 'undefined' && process.versions?.node;
if (isNode) {
  const isMain = import.meta.url === new URL(process.argv[1], 'file:').href;
  if (isMain) {
    await Promise.resolve(mainCLI(process.argv.slice(2))).catch(err => {
      console.error(err?.stack || err);
      process.exit(1);
    });
  }
}