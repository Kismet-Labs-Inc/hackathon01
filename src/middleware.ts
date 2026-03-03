import { NextRequest, NextResponse } from "next/server";

const EXPECTED_USER = "foodness";
const EXPECTED_PASS = "snaplunch2026";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    try {
      const base64 = authHeader.replace(/^Basic\s+/i, "");
      const decoded = atob(base64);
      const colonIndex = decoded.indexOf(":");
      if (colonIndex !== -1) {
        const user = decoded.slice(0, colonIndex);
        const pass = decoded.slice(colonIndex + 1);
        if (user === EXPECTED_USER && pass === EXPECTED_PASS) {
          return NextResponse.next();
        }
      }
    } catch {
      // invalid base64 — fall through to 401
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}
