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
// Keep generated statistics readable when animations are disabled.
const stillRules = '*{animation:none!important;transition:none!important}.stagger{opacity:1!important}';
for (const name of ['stats', 'top-langs', 'trophy']) {
  let source = await readFile(new URL(`profile/${name}.svg`, root), 'utf8');
  // Trophy progress widths were previously defined only in animation end frames.
  for (const match of source.matchAll(/@keyframes (\w+)RankAnimation\s*\{\s*from\s*\{\s*width:\s*0px;\s*\}\s*to\s*\{\s*width:\s*([\d.]+)px;/g)) {
    const id = new RegExp(`\\bid="${match[1]}-rank-progress"`);
    source = source.replace(/<rect\b[^>]*>/g, tag => id.test(tag)
      ? tag.replace(/\swidth="[^"]*"/, '').replace(/\/?>$/, closing => ` width="${match[2]}"${closing}`)
      : tag);
  }
  source = source.replace(/<style id="profile-motion">[\s\S]*?<\/style>/g, '');
  const insertStyle = (svg, rule) => svg.slice(0, svg.lastIndexOf('</svg>')) + rule + svg.slice(svg.lastIndexOf('</svg>'));
  source = insertStyle(source, `<style id="profile-motion">@media(prefers-reduced-motion:reduce){${stillRules}}</style>`);
  await writeFile(new URL(`profile/${name}.svg`, root), source);
  await writeFile(new URL(`profile/${name}-static.svg`, root), insertStyle(source, `<style>${stillRules}</style>`));
  markdown = markdown.replaceAll(`./profile/${name}.svg`, `./profile/${name}-static.svg`);
}
await writeFile(new URL('PROFILE_STATIC.md', root), markdown);
console.log('Generated static README, artwork, and readable motion-free statistics.');
