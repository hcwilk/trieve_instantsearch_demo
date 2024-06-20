/* global instantsearch */

import TrieveSearchAdapter from "../../../../trieve/trieve-instantsearch-adapter/dist/TrieveSearchAdapter";

const trieveSearchAdapter = new TrieveSearchAdapter(
  "tr-r28pHcQkPhHpzKZQ1Qw4OzQCQQAQM90k",
  "fbacc151-5342-4fe8-a762-d8b398d696c4"
);

const { searchClient } = trieveSearchAdapter;

const search = instantsearch({
  searchClient,
  indexName: "books",
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item(item) {
        return `
        <div>
          <img src="${item.image_url}" alt="${item.name}" height="100" />
          <div class="hit-name">
            ${item.title}
          </div>
          <div class="hit-authors">
          ${item.authors.map((a) => a.value).join(", ")}
          </div>
          <div class="hit-publication-year">${item.publication_year}</div>
          <div class="hit-rating">${item.average_rating}/5 rating</div>
        </div>
      `;
      },
    },
  }),
  instantsearch.widgets.pagination({
    container: "#pagination",
  }),
]);

search.start();