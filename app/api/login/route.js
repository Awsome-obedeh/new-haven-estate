import { NextResponse } from "next/server";
import { authenticateUser, createSession, sessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (typeof body.email !== "string" || typeof body.password !== "string" || !body.email.trim() || !body.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const result = authenticateUser(body.email, body.password);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({ user: result.user });
  response.cookies.set(sessionCookie.name, createSession(result.user.id), sessionCookie.options);
  return response;
}