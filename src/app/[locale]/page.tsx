import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

export const dynamic = "force-static";

export default async function Home() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const books = await reader.collections.books.all();

  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>Book in Cambodia</h1>
      <p>Phase 0 spike: this page is prerendered at build time from Keystatic content.</p>
      <ul>
        {books.map((book) => (
          <li key={book.slug}>{book.entry.title}</li>
        ))}
      </ul>
    </main>
  );
}
