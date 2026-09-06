// Repository-owned vector artwork; run with Node.js, no packages required.
import { mkdir, writeFile } from 'node:fs/promises';
const root = new URL('../assets/', import.meta.url);
await mkdir(root, { recursive: true });
const svg = (w,h,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-labelledby="title"><title id="title">${title}</title>${body}</svg>\n`;
const save = (name,content) => writeFile(new URL(`${name}.svg`,root),content);
for (const theme of ['light','dark']) {
  const dark = theme === 'dark';
  const ink = dark ? '#f0f6fc' : '#171b23';
  const muted = dark ? '#a6b0bd' : '#59636f';
  const line = dark ? '#30363d' : '#d8dee4';
  const accent = dark ? '#ffa36c' : '#c64b1e';
  const soft = dark ? '#261c19' : '#fff4ed';
  await save(`profile-header-${theme}`,svg(1000,210,'Aman Anurag. Senior Full Stack Engineer. Web, mobile, desktop, applied AI.',`
<style>.orbit{transform-origin:886px 103px;animation:orbit 28s linear infinite}@keyframes orbit{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>
<g font-family="Arial,Helvetica,sans-serif">
<rect x="1" y="16" width="6" height="13" rx="3" fill="${accent}"/>
<text x="20" y="27" fill="${muted}" font-size="13" font-weight="700" letter-spacing="2.5">ENGINEERING WITH PRODUCT INSTINCT.</text>
<text x="0" y="108" fill="${ink}" font-size="76" font-weight="800" letter-spacing="-4">Aman Anurag<tspan fill="${accent}">.</tspan></text>
<text x="3" y="148" fill="${ink}" font-size="25" font-weight="600">Senior Full Stack Engineer</text>
<text x="3" y="179" fill="${muted}" font-size="18">Web. Mobile. Desktop. Applied AI.</text></g>
<circle cx="886" cy="103" r="74" fill="${soft}"/>
<g stroke="${line}" stroke-width="1.3"><ellipse cx="886" cy="103" rx="101" ry="38" transform="rotate(-35 886 103)"/><ellipse cx="886" cy="103" rx="101" ry="38" transform="rotate(35 886 103)"/><circle cx="886" cy="103" r="74"/></g>
<g class="orbit"><circle cx="886" cy="29" r="7" fill="${accent}"/><circle cx="886" cy="177" r="4" fill="${ink}"/></g>
<path d="M871 85 853 103l18 18m30-36 18 18-18 18m-11-43-8 50" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0 207H1000" stroke="${line}"/><path d="M0 207H96" stroke="${accent}" stroke-width="3"/>`));
}
await save('developer-desk',svg(480,132,'A developer desk with web, mobile, desktop and AI devices',`
<style>.signal{animation:signal 4s ease-in-out infinite}@keyframes signal{0%,100%{opacity:.35}50%{opacity:1}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>
<rect width="480" height="132" rx="10" fill="#eaf3f3"/>
<path d="m40 115 162-60 238 30-156 47" fill="#dcebea"/><path d="m40 115 162-60 238 30" stroke="#adc9c7"/>
<path d="m208 91 42-14 32 6-41 15Z" fill="#538684"/><path d="M243 71v15" stroke="#538684" stroke-width="8"/>
<rect x="172" y="19" width="137" height="63" rx="6" fill="#204d50"/><rect x="179" y="26" width="123" height="48" rx="2" fill="#f6fcfb"/>
<path d="m199 39-7 6 7 6m18-12 7 6-7 6m-8-15-4 21" stroke="#3f7c78" stroke-width="2"/><path d="M237 39h44m-44 9h34m-34 9h42" stroke="#bad9d2" stroke-width="4" stroke-linecap="round"/>
<rect x="323" y="54" width="29" height="48" rx="5" fill="#204d50"/><rect x="327" y="60" width="21" height="34" rx="2" fill="#bfe0d8"/>
<path d="m111 68 44 7v32l-44-9Z" fill="#477a79"/><path d="m116 75 33 6v20l-33-7Z" fill="#c5e4da"/><path d="m95 102 48 11 14-6-46-9Z" fill="#89b6af"/>
<circle cx="371" cy="36" r="17" fill="#cce1d6"/><path d="m365 36 4 4 8-9" stroke="#3f7360" stroke-width="2.5" stroke-linecap="round"/>
<g class="signal" fill="#2f8a79"><circle cx="73" cy="42" r="3"/><circle cx="383" cy="101" r="3"/><circle cx="337" cy="23" r="3"/></g>`));
await save('career-rush',svg(480,132,'Career Rush: an original three-lane runner with obstacles and collectibles',`
<style>.pickup{animation:pickup 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}.runner{animation:run 1.4s ease-in-out infinite}@keyframes pickup{50%{transform:translateY(-4px)}}@keyframes run{50%{transform:translateY(-2px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>
<rect width="480" height="132" rx="10" fill="#fff0e5"/><circle cx="366" cy="38" r="25" fill="#ffd6b5"/>
<path d="M36 84V56h24v28m16 0V39h29v45m19 0V61h20v23m231 0V58h29v26m14 0V45h26v39" stroke="#e5b798" stroke-width="7"/>
<path d="M202 49h76l114 83H87Z" fill="#eed5c3"/><path d="m226 49-38 83m65-83 38 83" stroke="#fff9f2" stroke-width="2" stroke-dasharray="8 8"/>
<path d="m306 87 15-4 10 18-19 5Z" fill="#be653f"/><path d="m308 88 14-3m-11 8 14-3" stroke="#ffe5cb" stroke-width="3"/>
<g class="pickup" fill="#dc932c" stroke="#fff7dd" stroke-width="2"><path d="m206 76 5 7-5 7-5-7Z"/><path d="m217 63 4 6-4 6-4-6Z"/><path d="m224 54 3 4-3 4-3-4Z"/></g>
<g class="runner"><circle cx="247" cy="79" r="8" fill="#512e25"/><path d="m246 91-3 16m3-14-11 9m10-10 13 5m-15 10-10 12m10-12 12 9" stroke="#ba4d28" stroke-width="7" stroke-linecap="round"/><path d="m240 88 11 2-2 16-12-2Z" fill="#263a46"/><path d="m239 80 8 3" stroke="#efb38b" stroke-width="5" stroke-linecap="round"/></g>`));
await save('activity-still',svg(880,72,'GitHub activity: open my contribution history','<rect width="880" height="72" rx="8" fill="#f0f5f1"/><text x="24" y="43" font-family="Arial,Helvetica,sans-serif" font-size="20" fill="#276440">GitHub activity · Open my contribution history ↗</text>'));
console.log('Generated theme-aware headers, compact playground artwork, and activity fallback.');
