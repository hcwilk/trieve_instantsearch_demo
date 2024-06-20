/* global instantsearch */

import TrieveSearchAdapter from "trieve-instantsearch-adapter";

const trieveSearchAdapter = new TrieveSearchAdapter(
  process.env.TRIEVE_API_KEY,
  process.env.TRIEVE_DATASET_ID
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
