import { essayMetadata } from "@/lib/writings";

export const metadata = essayMetadata("against-templates");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
