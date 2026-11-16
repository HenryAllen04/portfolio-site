import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Not found | Henry Allen" };

/** Uses the essay shell so a dead link still lands inside the site. */
export default function NotFound() {
  return (
    <main className="essay">
      <p className="essay-path">
        <Link href="/">HenryAllen.me</Link> / 404
      </p>
      <h1>Nothing here.</h1>
    </main>
  );
}
