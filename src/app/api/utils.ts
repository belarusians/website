import { NextResponse } from "next/server";

export function sendError(status: number, message: string, reason?: string) {
  return NextResponse.json({ message, reason }, { status });
}

export function sendSuccess(message: string) {
  return NextResponse.json({ message }, { status: 200 });
}
