import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";
import { editorEnabled } from "@/lib/keystatic";

export const dynamic = "force-dynamic";

// Created on the first request, not at build time: in GitHub mode the GitHub App
// credentials are Worker secrets that only exist at runtime.
let handler: ReturnType<typeof makeRouteHandler> | undefined;
const getHandler = () => (handler ??= makeRouteHandler({ config }));

const notFound = () => new Response("Not found", { status: 404 });

export function GET(request: Request) {
  return editorEnabled ? getHandler().GET(request) : notFound();
}

export function POST(request: Request) {
  return editorEnabled ? getHandler().POST(request) : notFound();
}
