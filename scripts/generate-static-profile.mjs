// Generate a motion-free README, including theme-aware artwork.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
let markdown = await readFile(new URL('README.md', root), 'utf8');
for (const name of ['profile-header-light', 'profile-header-dark', 'developer-desk', 'career-rush']) {
  const source = await readFile(new URL(`assets/${name}.svg`, root), 'utf8');
  const still = source.replace(/<style>[\s\S]*?<\/style>/g, '');
  await writeFile(new URL(`assets/${name}-static.svg`, root), still);
  markdown = markdown.replaceAll(`./assets/${name}.svg`, `./assets/${name}-static.svg`);
}
markdown = markdown.replace('[Motion-free version](./PROFILE_STATIC.md)', '[Animated version](./README.md)');
markdown = markdown.replace(/<!-- activity-start -->[\s\S]*?<!-- activity-end -->/, '[View my GitHub contribution history](https://github.com/amananurag20)');
markdown = markdown.replace('Contribution arcade → watch the snake clear my GitHub activity', 'GitHub contribution history');
await writeFile(new URL('PROFILE_STATIC.md', root), markdown);
console.log('Generated static README and four motion-free SVG alternatives.');
