import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { renderHomeNews, synchronizeHomeNews } from "./home-news.mjs";

const article = (day, file = `news-${day}.html`) => `<article class="news-item"><span class="date"><strong>${day}</strong>2026-09</span><span><h3><a href="${file}">Title ${day}</a></h3><p>Summary ${day}</p></span></article>`;
const home = 'prefix\n        <!-- home-news:start -->\nold content\n        <!-- home-news:end -->\nsuffix';

test("newest two retain titles, summaries, dates and direct links", () => {
  const result = synchronizeHomeNews(home, article("04") + article("03") + article("01"));
  assert.match(result, /href="news-04.html"/);
  assert.match(result, /href="news-03.html"/);
  assert.doesNotMatch(result, /news-01.html|old content/);
  assert.ok(result.startsWith("prefix\n") && result.endsWith("\nsuffix"));
  assert.match(result, /<strong>04<\/strong>2026-09/);
  assert.match(result, /<h3>Title 04<\/h3><p>Summary 04<\/p>/);
  assert.equal(synchronizeHomeNews(result, article("04") + article("03")), result);
});

test("missing or reversed boundaries cannot overwrite unrelated homepage content", () => {
  assert.throws(() => synchronizeHomeNews("no markers", article("04") + article("03")), /markers/);
  assert.throws(() => synchronizeHomeNews(home + home, article("04") + article("03")), /markers/);
});

test("duplicate, out-of-order and incomplete articles fail clearly", () => {
  assert.throws(() => renderHomeNews(article("03") + article("04")), /newest first/);
  assert.throws(() => renderHomeNews(article("04") + article("04")), /Duplicate/);
  assert.throws(() => renderHomeNews(article("04").replace("<p>Summary 04</p>", "") + article("03")), /Incomplete/);
});

test("repository homepage matches its news source", () => {
  const actual = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const news = readFileSync(new URL("../news.html", import.meta.url), "utf8");
  assert.equal(synchronizeHomeNews(actual, news), actual);
});
