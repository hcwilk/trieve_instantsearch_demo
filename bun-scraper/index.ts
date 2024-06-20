/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/// <reference lib="dom" />

const API_URL = Bun.env.API_URL as string;

export interface CreateChunkData {
  chunk_html: string;
  group_ids?: string[];
  link: string;
  tag_set: string[];
  tracking_id: string;
  upsert_by_tracking_id?: boolean;
  metadata: Object;
}

export const createChunk = async (chunkData: CreateChunkData) => {
  const response = await fetch(`${API_URL}/chunk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bun.env.API_KEY ?? "",
      "TR-Dataset": Bun.env.DATASET_ID ?? "",
    },
    body: JSON.stringify(chunkData),
  });
  if (!response.ok) {
    console.error("error creating chunk", response.status, response.statusText);
    const respText = await response.text();
    console.error("error creating chunk", respText);
    return "";
  }

  const responseJson = await response.json();
  if (!response.ok) {
    console.error("error creating chunk", responseJson.message);
    return "";
  }
  console.log("success creating chunk", responseJson.chunk_metadata.id);
  const chunkId = responseJson.chunk_metadata.id;

  return chunkId as string;
};

interface BookData {
  title: string;
  authors: string[];
  publication_year: number;
  id: string;
  average_rating: number;
  image_url: string;
  ratings_count: number;
}

const processBookChunk = async (book: BookData) => {
  console.log(`Processing book: ${book.title}`);
  const titleHtml = `<h1>${book.title}</h1>`;
  const authorsHtml = `<h3>Authors: ${book.authors.join(", ")}</h3>`;
  const publicationYearHtml = `<p>Published: ${book.publication_year}</p>`;
  const ratingHtml = `<p>Average Rating: ${book.average_rating} (${book.ratings_count} ratings)</p>`;
  const imageUrlHtml = `<img src="${book.image_url}" alt="Cover image of ${book.title}">`;

  const chunk_html = `<div>${titleHtml}${authorsHtml}${publicationYearHtml}${ratingHtml}${imageUrlHtml}</div>`;

  const chunkData: CreateChunkData = {
    chunk_html,
    link: book.image_url,
    tag_set: [
      "book",
      "literature",
      book.title.toLowerCase().replace(/\s/g, "_"),
    ],
    tracking_id: book.id,
    metadata: {
      title: book.title,
      authors: book.authors,
      publication_year: book.publication_year,
      average_rating: book.average_rating,
      ratings_count: book.ratings_count,
      image_url: book.image_url,
    },
  };

  const chunkId = await createChunk(chunkData);
  console.log(`Chunk created with ID: ${chunkId}`);
};

const processBooks = async () => {
  const bookList = Bun.file("./books.json"); 
  const books: BookData[] = JSON.parse(await bookList.text());

  for (const book of books) {
    await processBookChunk(book);
  }
};

processBooks().catch(console.error);
