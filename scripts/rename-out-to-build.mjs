import { existsSync, rmSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve(process.cwd(), 'out');
const buildDir = resolve(process.cwd(), 'build');

async function main() {
  if (!existsSync(outDir)) {
    console.log('No "out" directory found. This is expected for apps with API routes that do not use static export.');
    return;
  }
  if (existsSync(buildDir)) {
    rmSync(buildDir, { recursive: true, force: true });
  }
  await rename(outDir, buildDir);
  console.log('Renamed "out" to "build".');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
