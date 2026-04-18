import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Decode the path so "%40" becomes "@"
  const decodedPath = decodeURIComponent(pathname);

  console.log("Checking path:", decodedPath);

  // 2. Check the decoded path
  if (decodedPath.startsWith("/@")) {
    const handle = decodedPath.substring(2); // Remove the "/@"

    console.log(`Rewriting to: /gallery/${handle}`);

    // 3. Perform the rewrite
    // This tells Next.js: "Show the content of /gallery/[slug], but keep the URL as /@handle"
    return NextResponse.rewrite(new URL(`/gallery/${handle}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Broaden the matcher to ensure it catches the encoded symbol too
  matcher: [
    "/(@.*)", // Matches literal @ followed by anything
    "/(%40.*)", // Matches encoded @ followed by anything
  ],
};
