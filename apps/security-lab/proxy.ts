// proxy.ts (Next.js 16 uses proxy(), not middleware())
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * =============================================================================
 * SECURITY LAB: CORS Protection in Next.js
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHAT IS CORS?
 * ---------------------------------------------------------------------------
 * CORS (Cross-Origin Resource Sharing) is a browser security feature that
 * blocks web pages from making requests to a different domain than the one
 * that served the page. Without CORS headers, a malicious site cannot read
 * responses from your API.
 *
 * WHERE TO IMPLEMENT CORS:
 * ---------------------------------------------------------------------------
 *
 * Option 1: Proxy/Middleware (this file)
 *   ✅ Good for: Blocking requests early, before they hit your routes
 *   ✅ Centralized logic for all routes
 *   ⚠️  Must also set response headers for preflight (OPTIONS) requests
 *
 * Option 2: API Route Handlers
 *   ✅ Good for: Fine-grained control per endpoint
 *   ✅ Can have different CORS policies for different routes
 *
 * Option 3: next.config.js headers
 *   ✅ Good for: Static CORS configuration
 *   ⚠️  Less flexible, can't have dynamic logic
 *
 * IMPORTANT: CORS is NOT a substitute for authentication!
 * ---------------------------------------------------------------------------
 * CORS only affects BROWSER requests. Server-to-server requests (curl,
 * Postman, other backends) completely bypass CORS. Always authenticate
 * and authorize requests on the server side.
 */

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3005",
  "https://your-production-domain.com",
];

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const response = NextResponse.next();

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return handlePreflight(origin);
  }

  // CORS origin check
  // Note: Requests without an origin header (same-origin, server-to-server)
  // should be allowed through—only cross-origin browser requests have origin
  if (origin && !allowedOrigins.includes(origin)) {
    // Block requests from disallowed origins
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden - Origin not allowed",
    });
  }

  // Set CORS headers on the response
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

/**
 * Handle CORS preflight requests
 *
 * Browsers send an OPTIONS request before certain cross-origin requests
 * (those with custom headers, non-simple methods like PUT/DELETE, etc.)
 * to check if the server allows the actual request.
 */
function handlePreflight(origin: string | null): NextResponse {
  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 204, // No Content
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}

export const config = {
  matcher: [
    // Match API routes for CORS handling
    "/api/:path*",
  ],
};
