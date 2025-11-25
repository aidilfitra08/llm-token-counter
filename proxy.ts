import { NextRequest, NextResponse } from "next/server";

const sensitiveNames = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  "credentials",
  "config.json",
  "secrets",
  ".git",
  "package.json",
  "package-lock.json",
  ".npmrc",
  "yarn.lock",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();

  // Allow the redirect target itself
  if (pathname.startsWith("/rickrolled")) {
    return NextResponse.next();
  }

  // Split into path segments and test exact segment matches
  const segments = pathname.split("/").filter(Boolean);

  const isSensitive = segments.some((seg) => sensitiveNames.includes(seg));

  if (isSensitive) {
    return NextResponse.redirect(new URL("/rickrolled", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
