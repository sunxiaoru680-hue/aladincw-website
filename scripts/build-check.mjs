import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const abs = join(dir, name);
    const stat = statSync(abs);
    if (stat.isDirectory()) walk(abs);
    if (stat.isFile() && name.endsWith(".html")) htmlFiles.push(abs);
  }
}

function fail(message) {
  throw new Error(message);
}

walk(root);

if (htmlFiles.length < 12) fail(`Expected bilingual pages, found ${htmlFiles.length} HTML files.`);

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const requiredUrls = [
  "https://aladincw.com/",
  "https://aladincw.com/about.html",
  "https://aladincw.com/services.html",
  "https://aladincw.com/cases.html",
  "https://aladincw.com/news.html",
  "https://aladincw.com/contact.html",
  "https://aladincw.com/en/",
  "https://aladincw.com/en/about.html",
  "https://aladincw.com/en/services.html",
  "https://aladincw.com/en/cases.html",
  "https://aladincw.com/en/news.html",
  "https://aladincw.com/en/contact.html"
];

for (const url of requiredUrls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`Missing sitemap URL: ${url}`);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const rel = file.slice(root.length + 1);
  for (const tag of ["<title>", 'name="description"', 'name="keywords"', "<h1"]) {
    if (!html.includes(tag)) fail(`${rel} missing ${tag}`);
  }
  if (!html.includes("lang-switch")) fail(`${rel} missing language switch`);
  if (!html.includes("wechat-qr.png")) fail(`${rel} missing WeChat QR code`);
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|tel:|mailto:|#)/.test(ref)) continue;
    const clean = ref.split("#")[0];
    if (!clean) continue;
    const target = normalize(join(dirname(file), clean));
    if (!target.startsWith(root) || !existsSync(target)) fail(`${rel} has missing reference: ${ref}`);
  }
}

for (const required of ["robots.txt", "assets/img/wechat-qr.png", "assets/img/hero-finance-office.png"]) {
  if (!existsSync(join(root, required))) fail(`Missing required file: ${required}`);
}

console.log(`Build check passed: ${htmlFiles.length} HTML files, ${requiredUrls.length} sitemap URLs.`);
