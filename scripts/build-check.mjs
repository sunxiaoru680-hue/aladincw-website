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
const vercelConfig = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const baseUrl = "https://aladincw.cn";
const requiredUrls = htmlFiles.map((file) => {
  const rel = file.slice(root.length + 1).replace(/\\/g, "/");
  if (rel === "index.html") return `${baseUrl}/`;
  if (rel === "en/index.html") return `${baseUrl}/en/`;
  return `${baseUrl}/${rel}`;
});

function expectedCanonicalUrl(file) {
  const rel = file.slice(root.length + 1).replace(/\\/g, "/");
  if (rel === "index.html") return `${baseUrl}/`;
  if (rel === "en/index.html") return `${baseUrl}/en/`;
  return `${baseUrl}/${rel}`;
}

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
  const canonicalMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)">/g)];
  if (canonicalMatches.length !== 1) fail(`${rel} must have exactly one canonical tag.`);
  const canonicalUrl = canonicalMatches[0][1];
  const expectedCanonical = expectedCanonicalUrl(file);
  if (canonicalUrl !== expectedCanonical) {
    fail(`${rel} canonical must be ${expectedCanonical}, found ${canonicalUrl}`);
  }
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

if (!existsSync(join(root, "index.html"))) fail("Root index.html is required for Vercel static hosting.");
if (vercelConfig.buildCommand !== null) fail("vercel.json buildCommand must be null for this static HTML site.");
if (vercelConfig.outputDirectory !== ".") fail('vercel.json outputDirectory must be "." for root static hosting.');

console.log(`Build check passed: ${htmlFiles.length} HTML files, ${requiredUrls.length} sitemap URLs.`);
