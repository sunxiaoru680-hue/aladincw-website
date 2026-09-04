// news.html is the single source for the homepage's latest two articles.
export function renderHomeNews(news) {
  const items = [...news.matchAll(/<article class="news-item">([\s\S]*?)<\/article>/g)]
    .map((match) => {
      const content = match[1];
      const link = content.match(/<h3><a href="([^"#]+\.html)">([^<]+)<\/a><\/h3>/);
      if (!link) return null; // Older text-only news is not an article link.
      const date = content.match(/<span class="date"><strong>(\d{2})<\/strong>(\d{4}-\d{2})<\/span>/);
      const summary = content.match(/<p>([\s\S]*?)<\/p>/);
      if (!date || !summary) throw new Error(`Incomplete news item: ${link[1]}`);
      return { href: link[1], title: link[2], date: date[0], day: `${date[2]}-${date[1]}`, summary: summary[1] };
    }).filter(Boolean);
  if (items.length < 2) throw new Error("At least two linked news articles are required.");
  const seen = new Set();
  for (let i = 0; i < items.length; i++) {
    if (seen.has(items[i].href)) throw new Error(`Duplicate news article: ${items[i].href}`);
    seen.add(items[i].href);
    if (i && items[i].day > items[i - 1].day) throw new Error("News articles must be newest first.");
  }
  return '        <div class="news-list">\n' + items.slice(0, 2).map((item) =>
    `          <a class="news-item" href="${item.href}">${item.date}<span><h3>${item.title}</h3><p>${item.summary}</p></span></a>`
  ).join("\n") + '\n        </div>';
}

export function synchronizeHomeNews(home, news) {
  const start = '        <!-- home-news:start -->';
  const end = '        <!-- home-news:end -->';
  if (home.split(start).length !== 2 || home.split(end).length !== 2 || home.indexOf(start) > home.indexOf(end)) {
    throw new Error("Homepage news markers must exist exactly once and in order.");
  }
  const from = home.indexOf(start) + start.length;
  const to = home.indexOf(end);
  return home.slice(0, from) + '\n' + renderHomeNews(news) + '\n' + home.slice(to);
}
