import Link from "next/link";
import { site } from "@/config/site";
import { editorEnabled } from "@/lib/keystatic";
import KeystaticApp from "./keystatic";

export const metadata = {
  title: "Editor — Book in Cambodia",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout() {
  if (!editorEnabled) {
    return (
      <html lang="en">
        <body
          style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 32, lineHeight: 1.6 }}
        >
          <main style={{ maxWidth: 560, margin: "10vh auto" }}>
            <h1>Online editing isn&apos;t switched on yet</h1>
            <p>
              The content editor will be available here once GitHub sign-in is set up (see
              docs/EDITOR_GUIDE.md). Until then, you can suggest changes on{" "}
              <a href={site.repoUrl}>GitHub</a> or email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
            <p>
              <Link href="/en">← Back to Book in Cambodia</Link>
            </p>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
