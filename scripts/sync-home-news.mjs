import { readFileSync, writeFileSync } from "node:fs";
import { synchronizeHomeNews } from "./home-news.mjs";

const homeUrl = new URL("../index.html", import.meta.url);
const home = readFileSync(homeUrl, "utf8");
const news = readFileSync(new URL("../news.html", import.meta.url), "utf8");
const updated = synchronizeHomeNews(home, news);
if (updated !== home) {
  writeFileSync(homeUrl, updated);
  console.log("Homepage latest articles synchronized from news.html.");
} else {
  console.log("Homepage latest articles are already synchronized.");
}
