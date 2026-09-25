import { NextResponse } from "next/server";
import { createSession, createUser, sessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const requiredFields = ["firstName", "lastName", "email", "phone", "password"];
  if (requiredFields.some((field) => typeof body[field] !== "string" || !body[field].trim())) {
    return NextResponse.json({ error: "First name, last name, email, phone and password are required." }, { status: 400 });
  }

  if (!/^\S+@\S+\.\S+$/.test(body.email) || body.password.length < 8 || !/[A-Z]/.test(body.password) || !/[0-9]/.test(body.password)) {
    return NextResponse.json({ error: "Use a valid email and a password with 8+ characters, one uppercase letter and one number." }, { status: 400 });
  }

  const result = createUser(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  const response = NextResponse.json({ user: result.user }, { status: 201 });
  response.cookies.set(sessionCookie.name, createSession(result.user.id), sessionCookie.options);
  return response;
}